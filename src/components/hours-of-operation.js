'use client'

import Link from "next/link";
import { handleChange, copyToClipboard, handleCheckbox, isDefined } from "@/helpers/functions";
import { useState } from "react";

export default function HoursOfOperation() {
	const [disabled, setDisabled] = useState(false);
	const [form, setForm] = useState({
		textData: `Hours of Operation Profile #1		
Profile Name:	Customer Support	
Time Zone:	Pacific Standard Time	
Closed Branches		
Weather		No
Emergency		Yes
Meeting		No
Other		Yes
Day	Open	Close
Sunday	9	5
Monday	7	7
Tuesday	7	7
Wednesday	7	7
Thursday	7	7
Friday	7	7
Saturday	9	6
Holiday	Open	Close
All Federal Holidays		 Yes
		
		
		
		
Skills Assigned		
IB-NO AGENT		
ATM Debit Card Support / Branch Calls / Business Express / Commercial Center		
Consumer Credit Cards / Consumer OB Eng / Existing Customers Eng		
Fiserv Calls / Online Accounts Eng / Resource Queue / Cyber Event		
		
		
Hours of Operation Profile #3		
Profile Name:	Special Assets	
Time Zone:	Pacific Standard Time	
Closed Branches		
Weather		No
Emergency		Yes
Meeting		Yes
Other		Yes
Day	Open	Close
Sunday		
Monday	8	5
Tuesday	8	5
Wednesday	8	5
Thursday	8	5
Friday	8	5
Saturday		
Holiday	Open	Close
All Federal Holidays		 Yes
		
		
		
		
Skills Assigned		
IB-NO AGENT		
No skills set up.  All inbound/outbound calls go to a direct line.		
		
		
		
		
Hours of Operation Profile #5		
Profile Name:	Loan Operations	
Time Zone:	Pacific Standard Time	
Closed Branches		
Weather		No
Emergency		Yes
Meeting		Yes
Other		Yes
Day	Open	Close
Sunday		
Monday	8	5
Tuesday	8	5
Wednesday	8	5
Thursday	8	5
Friday	8	5
Saturday		
Holiday	Open	Close
All Federal Holidays		 Yes
		
		
		
		
Skills Assigned		
IB-NO AGENT		
No skills set up.		
		
		
		
		
Hours of Operation Profile #7		
Profile Name:	Treasury Management	
Time Zone:	Pacific Standard Time	
Closed Branches		
Weather		No
Emergency		Yes
Meeting		Yes
Other		Yes
Day	Open	Close
Sunday		
Monday	8	5
Tuesday	8am	5pm
Wednesday	8 am	5 pm
Thursday	8	17
Friday	8	5
Saturday	24h	
Holiday	Open	Close
All Federal Holidays		 Yes
		
		
		
		
Skills Assigned		
IB-NO AGENT		
Cash Management(rename to Commercial Center)		
		
		
		
More Needed		
Hours of Operation Profile #9		
Profile Name:		
Time Zone:		
Closed Branches		
Weather		Yes
Emergency		Yes
Meeting		Yes
Other		Yes
Day	Open	Close
Sunday		
Monday		
Tuesday		
Wednesday		
Thursday		
Friday		
Saturday		
Holiday	Open	Close
		
		
		
		
		
Skills Assigned		
IB-NO AGENT
`,
		hoursJSON: ``,
	});

	const transformDataToJSON = () => {
		let json = processTextarea();
		setForm(prevForm => ({ ...prevForm, hoursJSON: JSON.stringify(json, null, 2) }));
	}

	const processTextarea = () => {
		const lines = form.textData.split('\n');

		let jsonArray = [];
		let textData = "";
		for (const line of lines) {
			if ((line.startsWith('Hours of Operation Profile #') || line.startsWith('Hours of Operation') || line.startsWith('Hours of')) && textData !== "") {
				let jsonObject = convertToJSON(textData);
				let jsonHourOfOperation = { "hourOfOperation": jsonObject };
				jsonArray.push(jsonHourOfOperation);

				textData = "";
			}

			textData += line + '\n';
		}

		if (textData !== "") {
			let jsonObject = convertToJSON(textData);
			let jsonHourOfOperation = { "hourOfOperation": jsonObject };
			if (isDefined(jsonObject.profileName) && jsonObject.profileName !== "") {
				jsonArray.push(jsonHourOfOperation);
			}
		}

		// Now jsonArray contains the array of JSON objects
		// console.log(jsonArray);
		return jsonArray;
	}

	const convertToJSON = (textData) => {
		let lines = textData.split('\n');
		let jsonData = {
			"profileName": "",
			"description": "",
			"notes": "",
			"days": [],
			// "holidays": [],
			"overrideBranch": "None",
			"overrideExpirationDate": ""
			// "skills": []
		};

		let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		let currentDay = null;

		lines.forEach(line => {
			if (line.startsWith('Profile Name:')) {
				jsonData.profileName = line.split(':')[1].trim();
			} else if (days.includes(line.split('\t')[0])) {
				currentDay = line.split('\t')[0];
				let isClosedAllDay = false;
				let openTime = line.split('\t')[1];
				let closeTime = line.split('\t')[2];

				let trimOpenTime = openTime.trim().toLowerCase();
				trimOpenTime = trimOpenTime.replace(' ', '');
				
				if (openTime.toLowerCase() === "closed" || closeTime.toLowerCase() === "closed") {
					isClosedAllDay = true;
					openTime = "";
					closeTime = "";
				} else if (
					trimOpenTime === "24hrs" || 
					trimOpenTime === "24hours" || 
					trimOpenTime === "24h" ||  
					closeTime.toLowerCase() === "n/a"
				) {
					openTime = "00:00:00";
					closeTime = "23:59:59";
				} else {
					openTime = convertToFormattedTime(openTime);
					closeTime = convertToFormattedTime(closeTime);
				}
				
				jsonData.days.push({
					"day": currentDay,
					"openTime": openTime,
					"closeTime": closeTime,
					"hasAdditionalHours": false,
					"additionalOpenTime": "",
					"additionalCloseTime": "",
					"isClosedAllDay": isClosedAllDay
				});
			}
		});

		return jsonData;
	}

	const convertToFormattedTime = (time) => {
		var [hours, minutes] = time.split(':');

		hours = hours.replace('am', '');
		if (minutes && minutes !== undefined && minutes.toLowerCase().includes('am')) {
			minutes = minutes.replace('am', '');
		}
		
		if (hours.toLowerCase().includes('pm') || (minutes && minutes !== undefined && minutes.toLowerCase().includes('pm'))) {
			hours = hours.replace('pm', '');

			if (minutes && minutes !== undefined && minutes.toLowerCase().includes('pm')) {
				minutes = minutes.replace('pm', '');
			}
			
			// Convert to 24-hour format
			if (hours <= 12) {
				hours = parseInt(hours) + 12;
			}
		}

		// Add leading zeros if needed
		hours = hours.toString().trim().padStart(2, '0');

		if (minutes !== null && minutes !== undefined && minutes !== "")
		{
			minutes = minutes.padStart(2, '0');
		} else {
			minutes = "00"
		}

		// Create the formatted time string
		var formattedTime = hours + ':' + minutes + ':00';

		return formattedTime;
	}

	const convertTo12HourFormat = (time24) => {
		// Extract hours and minutes
		var [hours, minutes] = time24.split(':');

		// Convert to 12-hour format
		var period = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12 || 12; // Handle midnight (0) and noon (12)

		// Format the result
		var time12 = hours + ':' + minutes + ' ' + period;

		return time12;
	}

  return (
    <div className="w-4xl mx-auto px-4 mt-2">
		<div className="flex flex-row justify-between items-center">
			<Link href="/" className="text-blue-600 font-bold hover:text-blue-500">‹ Back</Link>

			<a href="https://developer.niceincontact.com/API/AdminAPI#/General/post-hours-of-operation" target="_blank" className="text-blue-600 font-bold hover:text-blue-500 hover:underline">Hours of Operation</a>
		</div>

      <div className="py-4">
        <h1 className="text-4xl font-bold border-b-1 border-b-gray-200 mb-4">Hours of Operations (Text to JSON)</h1>

        <div className="mb-2">
          <label htmlFor="textData" className="font-bold">Hours of Operation (Text)</label>
          <textarea name="textData" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.textData}></textarea>
        </div>

        <button onClick={transformDataToJSON} className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600 mt-2 disabled:bg-blue-400 disabled:cursor-not-allowed font-bold" disabled={disabled}>Generate JSON</button>
        <button onClick={() => copyToClipboard(form.hoursJSON)} className="cursor-pointer bg-gray-500 text-white py-2 px-4 rounded-sm hover:bg-gray-600 mt-4 ml-2">Copy JSON</button>

        <hr className="my-4" />
        <div className="mb-2">
          <label htmlFor="hoursJSON" className="font-bold">Hours of Operation (JSON)</label>
          <textarea name="hoursJSON" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.hoursJSON}></textarea>
        </div>
      </div>
    </div>
  );
}
