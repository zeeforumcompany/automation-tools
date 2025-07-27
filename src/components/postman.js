'use client'

import Image from "next/image";
import Link from "next/link";
import { convertCurlToApiRequest, handleChange, sendRequestForObjects } from "@/helpers/functions";
import { useRef, useState } from "react";

export default function Postman() {
  const [disabled, setDisabled] = useState(false);
  const [form, setForm] = useState({
    curl: `curl --location --request POST 'https://jsonplaceholder.typicode.com/posts?name={{name}}&query={{query}}' \
--header 'Content-Type: application/json' \
--data '{
    "title": "{{name}}",
    "body": "{{query}}",
    "userId": 1
}'`,
    variables: `[{
"name":"Test",
"query":"Testing"
}, {
"name":"Test2",
"query":"Testing2"
}]`,
  });

  const htmlRef = useRef(null);
  const sendApiRequests = async () => {
    try {
      setDisabled(true);
      var request = convertCurlToApiRequest(form.curl);
      await sendRequestForObjects(htmlRef.current, form.variables, request);
    } catch (error) {
      console.error("Error sending API requests:", error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <>
      <Link href="/" className="text-blue-600 font-bold hover:text-blue-500">‹ Back</Link>

      <div className="py-4">
        <h1 className="text-4xl font-bold border-b-1 border-b-gray-200 mb-4">Postman</h1>

        <div className="mb-2">
          <label htmlFor="curl" className="font-bold">CURL</label>
          <textarea name="curl" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.curl}></textarea>
        </div>

        <div className="mb-2">
          <label htmlFor="variables" className="font-bold">Variables</label>
          <textarea name="variables" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.variables}></textarea>
        </div>

        <button onClick={sendApiRequests} className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600 mt-2 disabled:bg-blue-400 disabled:cursor-not-allowed font-bold" disabled={disabled}>Send</button>
        {/* <button onClick={() => copyToClipboard(form.curl)} className="cursor-pointer bg-gray-500 text-white py-1 px-4 rounded-sm hover:bg-gray-600 mt-4 ml-2">Copy</button> */}

        <hr className="my-4" />
        <div ref={htmlRef}>
        </div>
      </div>
    </>
  );
}
