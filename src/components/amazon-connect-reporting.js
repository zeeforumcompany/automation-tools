'use client'

import Link from "next/link";
import { useRef, useState } from "react";
import * as XLSX from 'xlsx';
import moment from "moment";
import { saveAs } from "file-saver";
import Input from "./shared/input";
import { isDefined } from "@/helpers/functions";

export default function AmazonConnectReporting() {
	const htmlRef = useRef();
	const tableRef = useRef();

	const [showDownload, setShowDownload] = useState(false);
	const [tableHeader, setTableHeader] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [error, setError] = useState(null);

	// Function to convert Excel serial number to a formatted date
	const excelSerialToDate = (serial) => {
		// Excel's epoch starts at January 1, 1900
		const excelEpoch = moment('1900-01-01T00:00:00.000Z');
		// Subtract 2 days to account for Excel's leap year bug (1900 is not a leap year)
		const daysAdjustment = serial >= 60 ? 2 : 1;
		// Calculate the date by adding (serial - adjustment) days to the epoch
		const date = moment(excelEpoch).add(serial - daysAdjustment, 'days');
		// Handle fractional part for time (if any)
		const fractionalDay = serial % 1;
		if (fractionalDay > 0) {
			const hours = Math.floor(fractionalDay * 24);
			const minutes = Math.floor((fractionalDay * 24 * 60) % 60);
			const seconds = Math.floor((fractionalDay * 24 * 60 * 60) % 60);
			date.add(hours, 'hours').add(minutes, 'minutes').add(seconds, 'seconds');
		}

		return date;
	};

	const handleFileChange = (e) => {
		setError(null);
		setTableHeader([]);
		setTableData([]);
		setShowDownload(false);

		try {
			const file = event.target.files[0];
			if (!file) {
				setError('No file selected');
				return;
			}

			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const data = new Uint8Array(e.target.result);
					const workbook = XLSX.read(data, { type: 'array', raw: true });
					const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
					const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

					if (jsonData.length === 0) {
						setError('No data found in the Excel file');
						return;
					}

					let headerCellCount = 0;
					let haveFoundInterval = false;

					jsonData.map((row, rowIndex) => {
						if (rowIndex === 0) {
							headerCellCount = row.length;

							let filteredRow = row.filter(cell => {
								return cell === 'StartInterval' || cell === 'EndInterval';
							});

							if (filteredRow.length === 0) {
								haveFoundInterval = false;
								return;
							}

							row[1] = "Start Date";
							row.splice(2, 0, "Start Time");

							row[3] = "End Date";
							row.splice(4, 0, "End Time");

							setTableHeader(row);
							headerCellCount = row.length;
							haveFoundInterval = true;
						} else if (haveFoundInterval) {
							let startDateTime = moment(row[1]);
							let startDate = startDateTime.clone();
							let endDateTime = moment(row[2]);
							let endDate = endDateTime.clone();

							row[1] = startDate.format('MM/DD/yyyy');
							row.splice(2, 0, startDateTime.format('HH:mm:ss'));

							row[3] = endDate.format('MM/DD/yyyy');
							row.splice(4, 0, endDateTime.format('HH:mm:ss'));
						} else {
							row[1] = moment(excelSerialToDate(row[1])).format('MM/DD/yyyy');
							row[3] = moment(excelSerialToDate(row[3])).format('MM/DD/yyyy');
						}

						if (rowIndex > 0 && headerCellCount > 0) {
							for (let i = 0; i < headerCellCount; i++) {
								let val = row[i];

								if (!isDefined(val)) {
									row[i] = "";
								}
							}
						}
					});

					setTableData(jsonData);
					setShowDownload(true);
				} catch (err) {
					setError(`Error parsing Excel file: ${err.message}`);
				}
			};

			reader.onerror = () => setError('Error reading file');
			reader.readAsArrayBuffer(file);
		} catch (err) {
			setError(`Error: ${err.message}`);
		}
	};

	// Function to export JSON to XLSX and trigger download
	const exportToExcel = () => {
		try {
			// Create a worksheet from JSON data
			const worksheet = XLSX.utils.table_to_sheet(tableRef.current, { header: tableHeader, raw: true });
			// Create a new workbook
			const workbook = XLSX.utils.book_new();
			// Append worksheet to workbook
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
			// Generate buffer
			const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
			// Create a Blob for download
			const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
			console.log("Exporting to Excel with data");

			// Trigger download
			saveAs(blob, 'data.xlsx');
			console.log("Exporting to Excel with data");
		} catch (error) {
			console.error('Error exporting to Excel:', error);
		}
	};

	return (
		<>
			<div className="flex flex-row justify-between items-center">
				<Link href="/" className="text-blue-600 font-bold hover:text-blue-500">‹ Back</Link>

				<a href="https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/connect/command/SearchContactsCommand/" target="_blank" className="text-blue-600 font-bold hover:text-blue-500 hover:underline">Amazon Connect - Reporting</a>
			</div>

			<div className="py-4">
				<h1 className="text-4xl font-bold border-b-1 border-b-gray-200 mb-4">Amazon Connect - Excel Reporting</h1>

				<div className="grid grid-cols-2 gap-4">
					<Input type="file" name="file" onChange={handleFileChange} placeholder="Upload Excel File" className="mb-4" />

					{showDownload && (
						<div>
							<div>&nbsp;</div>
							<button type="button" id="downloadExcel" onClick={exportToExcel} className="bg-blue-500 hover:bg-blue-600 hover:cursor-pointer text-white font-bold py-2 px-4 rounded">Download Excel</button>
						</div>
					)}
				</div>

				<hr className="my-4" />
				<div className="overflow-x-auto">
					{error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
					{tableData.length > 0 && (
						<table className="border-collapse w-full" ref={tableRef}>
						<tbody>
							{tableData.map((row, rowIndex) => {
								return (
									<tr key={rowIndex}>
										{row.map((cell, cellIndex) => {
											const CellTag = rowIndex === 0 ? 'th' : 'td';
											return (
												<CellTag
												key={cellIndex}
												style={{
													border: '1px solid #ddd',
													padding: '8px',
													textAlign: 'left',
													backgroundColor: rowIndex === 0 ? '#f2f2f2' : 'transparent',
												}}
												>
												{cell !== undefined && cell !== null ? cell : ''}
												</CellTag>
											);
										})}
									</tr>
								);
							})}
						</tbody>
						</table>
					)}
				</div>

				<div className="mb-2" ref={htmlRef}></div>
			</div>
		</>
	);
}