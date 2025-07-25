'use client'

import Link from "next/link";
import { handleChange, copyToClipboard, handleCheckbox, isDefined } from "@/helpers/functions";
import { useState } from "react";

export default function Dispositions() {
	const [disabled, setDisabled] = useState(false);
	const [form, setForm] = useState({
		showHideNotes: false,
		isPreview: false,
		dispositions: `Test1
Test2
Test3
Test4
Test5
Test6`,
		dispositionJSON: ``,
	});

	const dispositionTextToJSON = () => {
		try {
			setDisabled(true);

			// Split lines and remove empty lines
			let lines = form.dispositions.split('\n').filter(function(line) {
				return line.trim() !== '';
			});

			// Convert to JSON format
			let jsonData = [];
			let currentDispositions = [];

			for (let i = 0; i < lines.length; i++) {
				let line = lines[i].trim();

				let lineArr = line.toString().split(':');

				if (line !== "") {
					currentDispositions.push({
						"dispositionName": lineArr[0],
						"isPreviewDisposition": form.isPreview,
						"classificationId": isDefined(lineArr[1]) && parseInt(lineArr[1]) > 0 ? parseInt(lineArr[1]) : null
					});

					// Create a new array after every 50 objects
					if (currentDispositions.length === 50 || i === lines.length - 1) {
						jsonData.push({
							"dispositions": currentDispositions
						});
						currentDispositions = [];
					}
				}
			}

			// Convert to JSON string with indentation
			var jsonString = JSON.stringify(jsonData, null, 2);

			// Display the JSON string
			setForm(prevForm => ({ ...prevForm, dispositionJSON: jsonString }));
		} catch (error) {
			console.error("Error converting dispositions to JSON:", error);
		} finally {
			setDisabled(false);
		}
	}

  return (
    <div className="w-4xl mx-auto px-4 mt-2">
		<div className="flex flex-row justify-between items-center">
			<Link href="/" className="text-blue-600 font-bold hover:text-blue-500">‹ Back</Link>

			<a href="https://help.nice-incontact.com/content/acd/channels/additionalchannelfeatures/dispositions/systemdispositionvalues.htm?tocpath=ACD%7CACD%7CDispositions%7C_____2" target="_blank" className="text-blue-600 font-bold hover:text-blue-500 hover:underline">System Dispositions</a>
		</div>

      <div className="py-4">
        <h1 className="text-4xl font-bold border-b-1 border-b-gray-200 mb-4">Dispositions To JSON</h1>

		<div className="mb-2">
			<button className="bg-blue-600 font-bold hover:bg-blue-500 text-white hover:text-white cursor-pointer px-2 py-2 rounded-md" onClick={() => setForm(prevForm => ({ ...prevForm, showHideNotes: !prevForm.showHideNotes }))}>Notes: {form.showHideNotes ? 'Close' : 'Open'}</button>
			<div className={`mt-2 ${form.showHideNotes ? 'block' : 'hidden'}`}>
				<h3 className="p-0 font-bold text-xl my-2">Classification IDs</h3>
                <ul className="my-2 list-disc ml-8">
                    <li>1 - Positive w/Amount</li>
                    <li>2 - Positive no Amount</li>
                    <li>3 - Negative — DNC — Skill</li>
                    <li>4 - Negative — DNC — BU</li>
                    <li>5 - Negative</li>
                    <li>6 - Other</li>
                    <li>7 - Retry — Rescheduled Agent Specific</li>
                    <li>8 - Retry — Rescheduled Specified Date/Time — Any Agent</li>
                    <li>9 - Retry — Rescheduled Later Date/Time Unspecified</li>
                    <li>10 - Retry — Not Available</li>
                    <li>11 - Retry — Answering Machine</li>
                    <li>12 - Final — Answering Machine</li>
                    <li>13 - Fax Machine</li>
                </ul>

                <h4 className="m-0 p-0 font-bold my-2">Notes</h4>
                <p>To add classification, if there's no classification don't use colon or classification id, use following format e.g.:</p>
                <ul className="list-disc ml-8 my-2">
                    <li>Disposition_Name:Classification_ID</li>
                    <li>Test:1</li>
                    <li>Test Disposition</li>
                </ul>
			</div>
		</div>

        <div className="mb-2">
          <label htmlFor="dispositions" className="font-bold">Dispositions (Line by Line)</label>
          <textarea name="dispositions" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.dispositions}></textarea>
        </div>

        <div className="mb-2">
			<input type="checkbox" name="isPreview" id="isPreview" checked={form.isPreview} onChange={(e) => handleCheckbox(e, setForm)} />&nbsp;&nbsp;
          <label htmlFor="isPreview" className="font-bold">Is Preview?</label>
        </div>

        <button onClick={dispositionTextToJSON} className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600 mt-2 disabled:bg-blue-400 disabled:cursor-not-allowed font-bold" disabled={disabled}>Generate JSON</button>
        <button onClick={() => copyToClipboard(form.newTags)} className="cursor-pointer bg-gray-500 text-white py-2 px-4 rounded-sm hover:bg-gray-600 mt-4 ml-2">Copy JSON</button>

        <hr className="my-4" />
        <div className="mb-2">
          <label htmlFor="dispositionJSON" className="font-bold">Disposition (JSON)</label>
          <textarea name="dispositionJSON" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.dispositionJSON}></textarea>
        </div>
      </div>
    </div>
  );
}
