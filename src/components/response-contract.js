'use client'

import Link from "next/link";
import { handleChange, copyToClipboard } from "@/helpers/functions";
import { useState } from "react";

/**
 * Gensys Response Contract Component
 * @returns JSX Element
 */
export default function GenesysResponseContract() {
	const [disabled, setDisabled] = useState(false);
	const [form, setForm] = useState({
		apiResponse: `{
"userId": 1,
"id": 1,
"title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
"body": "quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam ostrum rerum est autem sunt rem eveniet architecto"
}`,
		responseContract: ``,
	});

	const responseToOutputContract = (response, keyForArray = '') => {
		let contractJson = {};

		for (let key in response) {
			let is_setup = false;
			let is_array = Array.isArray(response[key]);

			if (is_array) {
				contractJson[key] = {
					type: 'array',
					items: {
						title: `${key} Item 1`,
						type: 'object',
						properties: responseToOutputContract(response[key], key),
						additionalProperties: true
					}
				};

				is_setup = true;
			}

			if (typeof response[key] === 'object' && !is_setup) {
				if (key >= 0) {
					return responseToOutputContract(response[key], keyForArray);
				}

				contractJson[key] = {
					type: 'object',
					properties: responseToOutputContract(response[key], key),
					additionalProperties: true
				};

				is_setup = true;
			}

			if (!is_setup) {
				contractJson[key] = {
					type: typeof response[key]
				};
			}
		}

		return contractJson;
	}

	const buildContract = () => {
		let jsonString = "";

		if (form.apiResponse && form.apiResponse !== undefined) {
			try {
				let json = JSON.parse(form.apiResponse);

				// Convert json array to json string
				jsonString = JSON.stringify(responseToOutputContract(json));
			} catch (e) {
				console.log(e); // Error: not valid JSON
			}
		}

		// Set json string to json text area
		setForm(prev => ({ ...prev, responseContract: jsonString }));
	}

  return (
    <>
		<div className="flex flex-row justify-between items-center">
			<Link href="/" className="text-blue-600 font-bold hover:text-blue-500">‹ Back</Link>

			<a href="https://help.mypurecloud.com/articles/add-contracts-custom-actions-integrations/" target="_blank" className="text-blue-600 font-bold hover:text-blue-500 hover:underline">Genesys API Contracts for Custom Action</a>
		</div>

      <div className="py-4">
        <h1 className="text-4xl font-bold border-b-1 border-b-gray-200 mb-4">Genesys - API Contracts</h1>

        <div className="mb-2">
          <label htmlFor="apiResponse" className="font-bold">API Response</label>
          <textarea name="apiResponse" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.apiResponse}></textarea>
        </div>

        <button onClick={buildContract} className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600 mt-2 disabled:bg-blue-400 disabled:cursor-not-allowed font-bold" disabled={disabled}>Build Contract</button>
        <button onClick={() => copyToClipboard(form.responseContract)} className="cursor-pointer bg-gray-500 text-white py-2 px-4 rounded-sm hover:bg-gray-600 mt-4 ml-2">Copy JSON</button>

        <hr className="my-4" />
        <div className="mb-2">
          <label htmlFor="responseContract" className="font-bold">Contract JSON</label>
          <textarea name="responseContract" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.responseContract}></textarea>
        </div>

		<hr className="my-4" />
		<div className="mt-2">
			<b>Note:</b> This tool is used to convert response data into Genesys API Contract.
		</div>
      </div>
    </>
  );
}
