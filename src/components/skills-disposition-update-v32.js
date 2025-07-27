'use client'

import Link from "next/link";
import { handleChange, isDefined, convertCurlToApiRequest, sendRequest, replaceDynamicData, prependFailedAndSuccessRequestData } from "@/helpers/functions";
import { useRef, useState } from "react";

export default function SkillsDispositionUpdateV32() {
	const requestRef = useRef(null);
	const sendRequestRef = useRef(null);
	const [disabled, setDisabled] = useState(false);
	const [form, setForm] = useState({
		curl: `curl --location --request GET 'https://BASE_URL/incontactapi/services/v32.0/skills/{{skillId}}' \
--header 'Authorization: Bearer REPLACE_WITH_TOKEN'`,
		skills: `[
	{
		"skillId": 8374711
	},
	{
		"skillId": 10562664
	}
]`,
		dispositions: `[
	{
		"dispositionId": 6985,
		"dispositionName": "AU: Asset",
		"priority": 1,
		"isPreviewDisposition": false
	},
	{
		"dispositionId": 6994,
		"dispositionName": "AU: Contact Info",
		"priority": 2,
		"isPreviewDisposition": false
	}
]`,
		disposition_settings: "123:true:0" // Default disposition settings
	});

	const updateDispositionsOnSkills = async () => {
		try
		{
			setDisabled(true);

			sendRequestRef.current.innerHTML = "Sending requests...";
			requestRef.current.innerHTML = "";

			let globalFailedRequestsData = [];
			let globalSuccessRequestsData = [];
			let dispositions = null;
			let skills = null;

			let dispositionSettingsArr = form.disposition_settings.toString().split(':');

			// Disposition Settings
			dispositionSettingsArr[0] = isDefined(dispositionSettingsArr[0]) ? dispositionSettingsArr[0] : null;
			dispositionSettingsArr[1] = dispositionSettingsArr[1] != undefined && (dispositionSettingsArr[1] == "false" || dispositionSettingsArr[1] == false)  ? false : true;
			dispositionSettingsArr[2] = isDefined(dispositionSettingsArr[2]) ? dispositionSettingsArr[2] : 0;

			let request = convertCurlToApiRequest(form.curl);

			if (!isDefined(form.dispositions)) {
				dispositions = [];
			} else {
				dispositions = JSON.parse(form.dispositions);
			}

			if (isDefined(form.skills)) {
				skills = JSON.parse(form.skills);

				for (let i = 0; i < skills.length; i++) {
					let newRequestInfo = {};
					
					newRequestInfo = JSON.parse(JSON.stringify(request));
					newRequestInfo.url = replaceDynamicData(newRequestInfo.url, skills[i], 'string');

					let response = null;
					response = await sendRequest(newRequestInfo, requestRef.current, globalSuccessRequestsData, globalFailedRequestsData, skills[i]);
					if (isDefined(response.status) && response.status >= 200 && response.status <= 299) {
						let skillUpdateRequest = {};
						skillUpdateRequest.skill = response.data;

						delete skillUpdateRequest.skill.skillId;
						if (!isDefined(skillUpdateRequest.skill.emailFromAddress)) {
							delete skillUpdateRequest.skill.emailFromAddress;
						}

						if (!isDefined(skillUpdateRequest.skill.callSuppressionScriptId)) {
							delete skillUpdateRequest.skill.callSuppressionScriptId;
						}

						if (!isDefined(skillUpdateRequest.skill.screenPopTriggerEvent)) {
							delete skillUpdateRequest.skill.screenPopTriggerEvent;
						} else if (skillUpdateRequest.skill.screenPopTriggerEvent.toString().toUpperCase() == "LINKED") {
							skillUpdateRequest.skill.screenPopTriggerEvent = 1;
						} else if (skillUpdateRequest.skill.screenPopTriggerEvent.toString().toUpperCase() == "CONNECT") {
							skillUpdateRequest.skill.screenPopTriggerEvent = 2;
						} else if (skillUpdateRequest.skill.screenPopTriggerEvent.toString().toUpperCase() == "ACTIVE") {
							skillUpdateRequest.skill.screenPopTriggerEvent = 3;
						}

						if (skillUpdateRequest.skill.outboundTelecomRouteId === 0 || skillUpdateRequest.skill.outboundTelecomRouteId == 0) {
							delete skillUpdateRequest.skill.outboundTelecomRouteId;
						}

						if (skillUpdateRequest.skill.acwTypeId === 1) {
							skillUpdateRequest.skill.acwTypeId = 2;
						}

						if (!isDefined(skillUpdateRequest.skill.stateIdACW)) {
							skillUpdateRequest.skill.stateIdACW = dispositionSettingsArr[0];
						}

						if (!isDefined(skillUpdateRequest.skill.requireDisposition) || skillUpdateRequest.skill.requireDisposition !== dispositionSettingsArr[1]) {
							skillUpdateRequest.skill.requireDisposition = dispositionSettingsArr[1];
						}

						if (!isDefined(skillUpdateRequest.skill.maxSecondsACW) || skillUpdateRequest.skill.maxSecondsACW !== dispositionSettingsArr[2]) {
							skillUpdateRequest.skill.maxSecondsACW = dispositionSettingsArr[2];
						}

						skillUpdateRequest.skill.dispositions = dispositions;
						
						newRequestInfo.data = skillUpdateRequest;
						newRequestInfo.method = "PUT";
						response = await sendRequest(newRequestInfo, requestRef.current, globalSuccessRequestsData, globalFailedRequestsData, skills[i]);
					}
				}

				prependFailedAndSuccessRequestData(requestRef.current, globalFailedRequestsData, globalSuccessRequestsData);
			}
		} catch (error) {
			console.error("Error updating dispositions on skills:", error);
		} finally {
			sendRequestRef.current.innerHTML = "";
			setDisabled(false);
		}
	}

  return (
    <>
		<div className="flex flex-row justify-between items-center">
			<Link href="/" className="text-blue-600 font-bold hover:text-blue-500">‹ Back</Link>

			<a href="https://developer.niceincontact.com/API/AdminAPI#/Skills/put-skills-id" target="_blank" className="text-blue-600 font-bold hover:text-blue-500 hover:underline">Skills Update</a>
		</div>

      <div className="py-4">
        <h1 className="text-4xl font-bold border-b-1 border-b-gray-200 mb-4">Skills Disposition Update (v32)</h1>

        <div className="mb-2">
          <label htmlFor="curl" className="font-bold">CURL</label>
          <textarea name="curl" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.curl}></textarea>
        </div>

		<div className="mb-2">
          <label htmlFor="skills" className="font-bold">Skills</label>
          <textarea name="skills" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.skills}></textarea>
        </div>

		<div className="mb-2">
          <label htmlFor="dispositions" className="font-bold">Dispositions</label>
          <textarea name="dispositions" rows="9" className="border border-gray-300 rounded-md p-2 w-full" onChange={(e) => handleChange(e, setForm)} value={form.dispositions}></textarea>
        </div>

		<div className="form form-fields font-custom">
			<label className="block font-bold mb-4">Enable Disposition</label>
			<p>Settings for Enable Disposition, e.g. <code className="bg-gray-200">Wrap_Up_Code_Id:Disposition_Required_Boolean:ACW_Wrap_Up_Time_Seconds</code>, By default we will required disposition:</p>
			<p>Disposition Required: 123:true:0</p>
			<p>ACW Time: 123:false:30</p>
			<input type="text" className="border border-gray-300 rounded-md p-2 w-full" name="disposition_settings" id="disposition_settings" cols="30" rows="10" value={form.disposition_settings} onChange={(e) => handleChange(e, setForm)} />
		</div>

		<div>
        	<button onClick={updateDispositionsOnSkills} className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600 mt-2 disabled:bg-blue-400 disabled:cursor-not-allowed font-bold" disabled={disabled}>Send</button>

			<span ref={sendRequestRef}></span>
		</div>

		<hr className="my-4" />
		<div className="mt-2">
			<p><b>Note:</b> This tool is used to send dispositions to multiple skills in bulk. You can use the CURL command to fetch the skill details and then update the dispositions for each skill by providing the skill IDs and dispositions in JSON format.</p>
		</div>

		<hr className="my-4" />
		<div className="mt-2" ref={requestRef}></div>
      </div>
    </>
  );
}
