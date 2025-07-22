'use client'

import Link from "next/link";
import { handleChange, copyToClipboard } from "@/helpers/functions";
import { useState } from "react";

export default function Home() {
	const [disabled, setDisabled] = useState(false);
	const [form, setForm] = useState({
		tags: `[
	{"tagName": "test"},
	{"tagName": "test1"},
	{"tagName": "test2"}
]`,
		apiTags: `{
	"tags": [
		{
			"tagId": "1314",
			"tagName": "test",
			"isActive": "True",
			"notes": ""
		},
		{
			"tagId": "1315",
			"tagName": "Personal Insurance",
			"isActive": "True",
			"notes": ""
		}
	]
}`,
		newTags: ''
	});

	const findTag = (tagText, apiTags) => {
		var isFound = false;
		for (var j = 0; j < apiTags.length; j++) {
			var apiTag = apiTags[j];
			if (tagText.toLowerCase() == apiTag.tagName.toLowerCase()) {
				isFound = true;
				break;
			}
		}

		return isFound;
	};

	// Return Unique Array
	const uniqueArray = (arr) => {
		return arr.filter((value, index) => {
			const _value = JSON.stringify(value);
			return index === arr.findIndex(obj => {
				return JSON.stringify(obj).toLowerCase() === _value.toLowerCase();
			});
		});
	}

	const findNewTags = () => {
		// New Tags
		let tags = {};
		let newTags = [];
		let apiTags = [];
		let isTagJson = false;
		let isApiTagJson = false;

		// Check if tags is json
		try {
			tags = JSON.parse(form.tags);
			isTagJson = true;
		} catch (e) {
			isTagJson = false;
		}

		// Check if apiTags is json
		try {
			let apiResponse = JSON.parse(form.apiTags);

			if (apiResponse && apiResponse !== undefined) {
				apiTags = apiResponse.tags;
				isApiTagJson = true;
			}
		} catch (e) {
			isApiTagJson = false;
		}

		if (isApiTagJson) {
			if (isTagJson) {
				for (let i = 0; i < tags.length; i++) {
					let tag = tags[i];
					let isFound = findTag(tag.tagName, apiTags);
					if (!isFound) {
						newTags.push(tag);
					}
				}
			} else if (tagsText && tagsText !== undefined && tagsText !== "") {	// tags or in text
				// Split textarea value by new line
				let textArray = tagsText.split('\n');

				for (let i = 0; i < textArray.length; i++) {
					let tag = textArray[i];
					let isFound = findTag(tag, apiTags);
					if (!isFound) {
						newTags.push({tagName: tag});
					}
				}
			}
		}
		
		let jsonString = "";
		if (newTags.length > 0) {
			newTags = uniqueArray(newTags);
			// Convert json array to json string
			jsonString = JSON.stringify(newTags);
		}

		// Set json string to json text area
		setForm(prevForm => ({
			...prevForm,
			newTags: jsonString
		}));
	}

  return (
    <div className="w-4xl mx-auto px-4">
      <Link href="/" className="text-blue-600 font-bold hover:text-blue-500">‹ Back</Link>

      <div className="py-4">
        <h1 className="text-4xl font-bold border-b-1 border-b-gray-200 mb-4">Find New Tags</h1>

        <div className="mb-2">
          <label htmlFor="tags" className="font-bold">Tags</label>
          <textarea name="tags" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.tags}></textarea>
        </div>

        <div className="mb-2">
          <label htmlFor="apiTags" className="font-bold">API Tags</label>
          <textarea name="apiTags" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.apiTags}></textarea>
        </div>

        <button onClick={findNewTags} className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600 mt-2 disabled:bg-blue-400 disabled:cursor-not-allowed font-bold" disabled={disabled}>Compare Tags</button>
        <button onClick={() => copyToClipboard(form.newTags)} className="cursor-pointer bg-gray-500 text-white py-2 px-4 rounded-sm hover:bg-gray-600 mt-4 ml-2">Copy New Tags</button>

        <hr className="my-4" />
        <div className="mb-2">
          <label htmlFor="newTags" className="font-bold">New Tags</label>
          <textarea name="newTags" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.newTags}></textarea>
        </div>
      </div>
    </div>
  );
}
