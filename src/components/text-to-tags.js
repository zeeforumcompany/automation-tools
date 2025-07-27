'use client'

import Link from "next/link";
import { handleChange, copyToClipboard, handleCheckbox, isDefined } from "@/helpers/functions";
import { useState } from "react";

export default function TextToTags() {
	const [disabled, setDisabled] = useState(false);
	const [form, setForm] = useState({
		textData: `Tag1
Tag2
Tag3`,
		tagsJSON: ``,
	});

	const transformDataToJSON = () => {
		// Split text area value by new line
		var textArray = form.textData.split('\n');

		// Create empty array
		var json = [];

		// Loop through text array
		for (var i = 0; i < textArray.length; i++) {
			// Create empty object
			var obj = {};
			obj.tagName = textArray[i];

			// Push object to json array
			json.push(obj);
		}

		// Convert json array to json string
		var jsonString = JSON.stringify(json);

		// Set json string to json text area
		setForm(prev => ({ ...prev, tagsJSON: jsonString }));
	}

  return (
    <>
		<div className="flex flex-row justify-between items-center">
			<Link href="/" className="text-blue-600 font-bold hover:text-blue-500">‹ Back</Link>

			<a href="https://developer.niceincontact.com/API/AdminAPI#/General/CreatesTag" target="_blank" className="text-blue-600 font-bold hover:text-blue-500 hover:underline">Tags</a>
		</div>

      <div className="py-4">
        <h1 className="text-4xl font-bold border-b-1 border-b-gray-200 mb-4">Text to Tags (JSON)</h1>

        <div className="mb-2">
          <label htmlFor="textData" className="font-bold">Tags (Text)</label>
          <textarea name="textData" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.textData}></textarea>
        </div>

        <button onClick={transformDataToJSON} className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600 mt-2 disabled:bg-blue-400 disabled:cursor-not-allowed font-bold" disabled={disabled}>Generate JSON</button>
        <button onClick={() => copyToClipboard(form.tagsJSON)} className="cursor-pointer bg-gray-500 text-white py-2 px-4 rounded-sm hover:bg-gray-600 mt-4 ml-2">Copy JSON</button>

        <hr className="my-4" />
        <div className="mb-2">
          <label htmlFor="tagsJSON" className="font-bold">Tags (JSON)</label>
          <textarea name="tagsJSON" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.tagsJSON}></textarea>
        </div>

		<hr className="my-4" />
		<div className="mt-2">
			<b>Note:</b> This tool is used to convert text data into JSON format for Tags. The text data should be structured in a specific way, with each line representing a tag and its corresponding properties. After converting to JSON, you can continue to "Postman" to create tags using the generated JSON data.
		</div>
      </div>
    </>
  );
}
