'use client'

import Link from "next/link";
import { ConnectClient, GetContactAttributesCommand, SearchContactsCommand, UpdateContactAttributesCommand } from "@aws-sdk/client-connect";
import moment from "moment";
import { handleChange, isDefined, delay, printFailedAndSuccessResponseData, printFailedAndSuccessResponseCount } from "@/helpers/functions";
import { useRef, useState } from "react";
import DataHandler from "./shared/data-handler";
import Input from "./shared/input";
import SelectBox from "./shared/select-box";

export default function AmazonConnectContact() {
	const htmlRef = useRef(null);
	const childRef = useRef(null);
	const [disabled, setDisabled] = useState(false);
	const defaultForm = {
		InstanceId: '',
		ContactId: '',
		AccessKey: '',
		SecretKey: '',
		SessionToken: ``,
		AwsRegion: 'us-east-1',
		StartTime: moment().subtract(1, 'months').format('yyyy-MM-DD'),
		EndTime: moment().format('yyyy-MM-DD'),
		Channels: 'VOICE',
		SearchAttributes: 'IsPaymentSuccess=1',
		ClearAttributes: 'CaseInfo',
		delay: 5,	// in seconds
		TimeRangeType: "INITIATION_TIMESTAMP",
		SearchContactAttributeCriteriaMatchType: "MATCH_ALL"
	};

	const [form, setForm] = useState(defaultForm);
	const STORAGE_KEY = 'amazon-connect-contact';

	const awsStates = [
		{"value": "us-east-1", "label": "US East (N. Virginia)"},
		{"value": "us-east-2", "label": "US East (Ohio)"},
		{"value": "us-west-1", "label": "US West (N. California)"},
		{"value": "us-west-2", "label": "US West (Oregon)"},
		{"value": "af-south-1", "label": "Africa (Cape Town)"},
		{"value": "ap-south-2", "label": "Asia Pacific (Hyderabad)"},
		{"value": "ap-east-1", "label": "Asia Pacific (Hong Kong)"},
		{"value": "ap-southeast-3", "label": "Asia Pacific (Jakarta)"},
		{"value": "ap-southeast-5", "label": "Asia Pacific (Malaysia)"},
		{"value": "ap-southeast-4", "label": "Asia Pacific (Melbourne)"},
		{"value": "ap-south-1", "label": "Asia Pacific (Mumbai)"},
		{"value": "ap-northeast-3", "label": "Asia Pacific (Osaka)"},
		{"value": "ap-northeast-2", "label": "Asia Pacific (Seoul)"},
		{"value": "ap-southeast-1", "label": "Asia Pacific (Singapore)"},
		{"value": "ap-southeast-2", "label": "Asia Pacific (Sydney)"},
		{"value": "ap-east-2", "label": "Asia Pacific (Taipei)"},
		{"value": "ap-southeast-7", "label": "Asia Pacific (Thailand)"},
		{"value": "ap-northeast-1", "label": "Asia Pacific (Tokyo)"},
		{"value": "ca-central-1", "label": "Canada (Central)"},
		{"value": "ca-west-1", "label": "Canada West (Calgary)"},
		{"value": "eu-central-1", "label": "Europe (Frankfurt)"},
		{"value": "eu-west-1", "label": "Europe (Ireland)"},
		{"value": "eu-west-2", "label": "Europe (London)"},
		{"value": "eu-south-1", "label": "Europe (Milan)"},
		{"value": "eu-west-3", "label": "Europe (Paris)"},
		{"value": "eu-south-2", "label": "Europe (Spain)"},
		{"value": "eu-north-1", "label": "Europe (Stockholm)"},
		{"value": "eu-central-2", "label": "Europe (Zurich)"},
		{"value": "il-central-1", "label": "Israel (Tel Aviv)"},
		{"value": "mx-central-1", "label": "Mexico (Central)"},
		{"value": "me-south-1", "label": "Middle East (Bahrain)"},
		{"value": "me-central-1", "label": "Middle East (UAE)"},
		{"value": "sa-east-1", "label": "South America (São Paulo)"},
		{"value": "us-gov-east-1", "label": "AWS GovCloud (US-East)"},
		{"value": "us-gov-west-1", "label": "AWS GovCloud (US-West)"},
	];

	awsStates.map(state => {
		state.label = state.label + " - " + state.value;
		return state;
	});

	const timeRangeType = [
		"INITIATION_TIMESTAMP",
		"SCHEDULED_TIMESTAMP",
		"CONNECTED_TO_AGENT_TIMESTAMP",
		"DISCONNECT_TIMESTAMP",
	];

	const channels = [
		"VOICE",
		"CHAT",
		"TASK",
		"EMAIL",
	];

	const matchTypes = [
		"MATCH_ALL",
		"MATCH_ANY",
	];

	const getContactAttributes = async (client, contactId) => {
		const input = {
			InstanceId: form.InstanceId,
			InitialContactId: contactId,
		};

		const command = new GetContactAttributesCommand(input);
		const response = await client.send(command);
		return response;
	};

	const updateContactAttributes = async (client, contactId, attributes) => {
		const removeAttrs = form.ClearAttributes.split(',').reduce((acc, attr) => {
			let arr = attr.trim().split('=');
			acc[arr[0].trim()] = arr[1] ? arr[1].trim() : "";
			return acc;
		}, {});

		const input = {
			InstanceId: form.InstanceId,
			InitialContactId: contactId,
			Attributes: {
				...attributes,
				...removeAttrs,
			},
		};

		const command = new UpdateContactAttributesCommand(input);
		const response = await client.send(command);
		return response;
	};

	const searchContacts = async (e, nextToken = '') => {
		try {
			setDisabled(true);
			if (childRef) {
				childRef.current.saveData();
			}

			let counter = {
				failed: 0,
				success: 0
			};
			htmlRef.current.innerHTML = "";
			const delayMilliseconds = form.delay * 1000;
			let config = {
				region: form.AwsRegion,
				credentials: {
					accessKeyId: form.AccessKey,
					secretAccessKey: form.SecretKey,
				},
			};

			if (isDefined(form.SessionToken)) {
				config.credentials.sessionToken = form.SessionToken;
			}

			const client = new ConnectClient(config);
			const input = {
				InstanceId: form.InstanceId,
				SearchCriteria: {
					Channels: form.Channels.split(',').map(channel => channel.trim().toUpperCase()),
				},
			};

			let EndTime = form.EndTime;
			if (isDefined(form.StartTime) && !isDefined(EndTime)) {
				EndTime = moment(form.StartTime).add(1, 'months').format('yyyy-MM-DD');
				setForm(prevForm => ({
					...prevForm,
					EndTime: EndTime,
				}));
			}

			if (isDefined(form.StartTime) && isDefined(EndTime)) {
				input.TimeRange = {
					Type: form.TimeRangeType,
					StartTime: new Date(form.StartTime + " 00:00:00"),
					EndTime: new Date(EndTime + " 23:59:59"),
				};
			}

			if (isDefined(form.SearchAttributes)) {
				let searchAttributes = form.SearchAttributes.split('&').map(attr => {
					const [key, value] = attr.split('=');
					return { Key: key, Values: [value] };
				});

				input.SearchCriteria.SearchableContactAttributes = {};
				input.SearchCriteria.SearchableContactAttributes.Criteria = searchAttributes;
				input.SearchCriteria.SearchableContactAttributes.MatchType = form.SearchAttributeCriteriaMatchType;
			}

			if (isDefined(nextToken)) {
				input.NextToken = nextToken;
			}
			
			const command = new SearchContactsCommand(input);
			const response = await client.send(command);
			
			if (response.$metadata.httpStatusCode >= 100 && response.$metadata.httpStatusCode < 300) {
				counter.success++;
				printFailedAndSuccessResponseData(htmlRef, {
					title: `<span>Amazon Connect - Search Contacts: ${response.Contacts.length}</span><span>${response.$metadata.httpStatusCode}</span>`,
					body: response,
				}, "success");
			} else {
				counter.failed++;
				printFailedAndSuccessResponseData(htmlRef, {
					title: `<span>Amazon Connect - Failed Search Contacts</span><span>${response.$metadata.httpStatusCode}</span>`,
					body: response,
				}, "error");
			}

			if (response.Contacts && response.Contacts.length > 0) {
				for (const contact of response.Contacts) {
					await delay(delayMilliseconds);

					const attributes = await getContactAttributes(client, contact.Id);
					if (attributes.$metadata.httpStatusCode >= 100 && attributes.$metadata.httpStatusCode < 300) {
						counter.success++;
						printFailedAndSuccessResponseData(htmlRef, {
							title: `<span>Get Attributes for Contact ID: ${contact.Id}</span><span>${attributes.$metadata.httpStatusCode}</span>`,
							body: attributes,
						});
					} else {
						counter.failed++;
						printFailedAndSuccessResponseData(htmlRef, {
							title: `<span>Get Attributes for Contact ID: ${contact.Id}</span><span>${attributes.$metadata.httpStatusCode}</span>`,
							body: attributes,
						}, "error");
					}

					// Example of updating contact attributes
					const updateResponse = await updateContactAttributes(client, contact.Id, attributes.Attributes);
					if (updateResponse.$metadata.httpStatusCode >= 100 && updateResponse.$metadata.httpStatusCode < 300) {
						counter.success++;
						printFailedAndSuccessResponseData(htmlRef, {
							title: `<span>Update Attributes for Contact ID: ${contact.Id}</span><span>${updateResponse.$metadata.httpStatusCode}</span>`,
							body: updateResponse,
						});
					} else {
						counter.failed++;
						printFailedAndSuccessResponseData(htmlRef, {
							title: `<span>Update Attributes for Contact ID: ${contact.Id}</span><span>${updateResponse.$metadata.httpStatusCode}</span>`,
							body: updateResponse,
						}, "error");
					}
				}
			}

			if (isDefined(response.NextToken)) {
				await delay(delayMilliseconds);
				await searchContacts(e, response.NextToken);
			} else {
				printFailedAndSuccessResponseCount(htmlRef, counter.failed, counter.success);
			}
		} catch (error) {
			console.error("Error searching contacts:", error);
			printFailedAndSuccessResponseData(htmlRef, {
				title: `<span>Amazon Connect - Search Contacts</span><span>Error</span>`,
				body: error,
			}, "error");
		} finally {
			setDisabled(false);
		}
	}

  return (
    <>
		<div className="flex flex-row justify-between items-center">
			<Link href="/" className="text-blue-600 font-bold hover:text-blue-500">‹ Back</Link>

			<a href="https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/connect/command/SearchContactsCommand/" target="_blank" className="text-blue-600 font-bold hover:text-blue-500 hover:underline">Search Contacts</a>
		</div>

      <div className="py-4">
        <h1 className="text-4xl font-bold border-b-1 border-b-gray-200 mb-4">Amazon Connect</h1>

		<div className="mt-2">
			<p><b>Note:</b> This tool is used to search contacts on amazon connect for specific dates and update their contacts attributes to empty/given values. If there are more records, it will automatically paginate through the results. You can also set the delay between each API request to avoid throttling issues.</p>

			<p>When you press <b>"Update Attributes"</b>, it automatically save all your form data in your <b>browser local storage</b>. We don't send any data to our servers. This tool is solely for automation purpose.</p>
		</div>
		<hr className="my-4" />

		<div className="grid grid-cols-2 gap-4 mb-2">
			<Input name="AccessKey" value={form.AccessKey} onChange={(e) => handleChange(e, setForm)} placeholder="Access Key ID" />

			<Input name="SecretKey" value={form.SecretKey} onChange={(e) => handleChange(e, setForm)} placeholder="Secret Access Key" />
		</div>

		<Input name="SessionToken" value={form.SessionToken} onChange={(e) => handleChange(e, setForm)} placeholder="Session Token" />

		<div className="grid grid-cols-2 gap-4 mb-2">
			<SelectBox name={"AwsRegion"} value={form.AwsRegion} onChange={(e) => handleChange(e, setForm)} options={awsStates} label={"AWS Region"} />

			<Input name="InstanceId" value={form.InstanceId} onChange={(e) => handleChange(e, setForm)} placeholder="Amazon Connect - Instance ID" />
		</div>

		<div className="mb-2 border-b border-b-gray-300">
			<h3 className="text-lg font-bold">Search Contacts - Request</h3>
		</div>

		<div className="grid grid-cols-3 gap-4 mb-2">
			<SelectBox name={"Channels"} value={form.Channels} onChange={(e) => handleChange(e, setForm)} options={channels} label={"Channels"} />

			<SelectBox name={"SearchContactAttributeCriteriaMatchType"} value={form.SearchContactAttributeCriteriaMatchType} onChange={(e) => handleChange(e, setForm)} options={matchTypes} label={"Search Contact Match Type"} />

			<Input type="number" name="delay" value={form.delay} onChange={(e) => handleChange(e, setForm)} placeholder="API Request (Delay - In Seconds)" />
		</div>

		<div className="grid grid-cols-3 gap-4 mb-2">
			<SelectBox name={"TimeRangeType"} value={form.TimeRangeType} onChange={(e) => handleChange(e, setForm)} options={timeRangeType} label={"Time Range Type"} />

			<Input type="date" name="StartTime" value={form.StartTime} onChange={(e) => handleChange(e, setForm)} placeholder="Start Time" />

			<Input type="date" name="EndTime" value={form.EndTime} onChange={(e) => handleChange(e, setForm)} placeholder="End Time" />
		</div>

		<div className="grid grid-cols-2 gap-4 mb-2">
			<Input name="SearchAttributes" value={form.SearchAttributes} onChange={(e) => handleChange(e, setForm)} placeholder="Search Attributes" />

			<Input name="ClearAttributes" value={form.ClearAttributes} onChange={(e) => handleChange(e, setForm)} placeholder="Set/Clear Attributes" />
		</div>

		<div className="mb-2">
			<button onClick={searchContacts} className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-sm hover:bg-blue-600 mt-2 disabled:bg-blue-400 disabled:cursor-not-allowed font-bold" disabled={disabled}>Update Attributes</button>
			<DataHandler StorageKey={STORAGE_KEY} DefaultData={defaultForm} form={form} setForm={setForm} ref={childRef} />
		</div>

        <hr className="my-4" />
        <div className="mb-2" ref={htmlRef}></div>
      </div>
    </>
  );
}
