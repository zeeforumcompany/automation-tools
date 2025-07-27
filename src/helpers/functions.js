import axios from "axios";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Copy input value to clipboard
const copyToClipboard = async (inputValue) => {
	try {
		await navigator.clipboard.writeText(inputValue);
		return 'Text copied to clipboard!';
	} catch (err) {
		console.error('Failed to copy:', err);
		return 'Failed to copy text';
	}
};

const handleChange = (e, setValue) => {
	const { name, value } = e.target;
	setValue(prevValues => ({
		...prevValues,
		[name]: value,
	}));
};

const handleCheckbox = (e, setValue) => {
	const { name } = e.target;
	setValue(prevValues => ({
		...prevValues,
		[name]: !prevValues[name],
	}));
};

const isDefined = (value) => {
	return value !== undefined && value !== null && value !== '';
}

// Convert Postman CURL to Javascript Objects
const convertCurlToApiRequest = (curlString) => {
	if (!isDefined(curlString)) {
		alert('Please enter a CURL Request');
		return false;
	}

	// Clean CURL Request
	curlString = curlString.replaceAll('\n', '').replaceAll('curl --location', '').trim();

	if (curlString.indexOf('--request') !== -1) {
		curlString = curlString.replaceAll('--request', '').trim();
	} else {
		curlString = `POST ${curlString}`;
	}

	// Trim whitespace & split using backslash
	curlString = curlString.trim();
	var curlArray = curlString.split('\\');

	// split the first array index of curlArray string by space to fetch the method and url
	var curlArray2 = curlArray[0].split(' ');

	// get the url
	var url = curlArray2[1].substring(1, curlArray2[1].length - 1);

	// get the method
	var method = curlArray2[0];

	// get the headers, data and more
	var headers = {};
	var data = {};

	for (var i = 1; i < curlArray.length; i++) {
		if (curlArray[i].indexOf('--header') > -1) {
			var headerString = removeStringAndSingleQuote(curlArray[i], '--header ');
			var header = headerString.split(': ');
			headers[header[0]] = header[1].trim();
		} else if (curlArray[i].indexOf('--form') > -1) { // get the form data
			var dataString = removeStringAndSingleQuote(curlArray[i], '--form ');
			var dataArray = dataString.split('=');
			data[dataArray[0]] = dataArray[1].replaceAll('"', '').trim();
		} else if (curlArray[i].indexOf('--data-urlencode') > -1) { // get the data urlencode
			var dataString = removeStringAndSingleQuote(curlArray[i], '--data-urlencode ');
			var dataArray = dataString.split('=');
			data[dataArray[0]] = dataArray[1].replaceAll('"', '').trim();
		} else if (curlArray[i].indexOf('--data') > -1) { // get the data
			var dataString = removeStringAndSingleQuote(curlArray[i], '--data ');
			data = dataString;
		}
	}

	return {url, method, headers, data};
}

const removeStringAndSingleQuote = (string, removeString = '') =>  {
	return string.replaceAll(removeString, '').replaceAll('\'', '');
}

// Replace Dynamic Data
const replaceDynamicData = (data, obj, type = 'data') => {
	if (typeof data === 'string') {
		// Create a regular expression to match dynamic variables
		const regex = /{{([^}]+)}}/g;

		// Use replace with a callback function to dynamically replace variables
		var resultString = data.replace(regex, (match, variable) => {
			// Use regular expression to extract the parts
			var match1 = variable.match(/([a-zA-Z]+)\[(\d+)\]/);
			var match2 = variable.match(/([a-zA-Z]+)\.(.+)/);
			var match3 = variable.match(/([a-zA-Z]+)\[(\d+)\]\.(.+)/);

			// Check if the match was successful
			if (match3) {
				// Extracted values
				var firstPart = match3[1]; // variable name
				var secondPart = match3[2]; // index
				var thirdPart = match3[3];  // object key

				// Display the results
				return obj.hasOwnProperty(firstPart) ? JSON.stringify(obj[firstPart][secondPart][thirdPart]) : null;
			} else if (match2 || match1) {
				var match = match1 || match2;

				// Extracted values
				var firstPart = match[1]; // variable name
				var secondPart = match[2]; // index / object

				// Display the results
				return obj.hasOwnProperty(firstPart) ? JSON.stringify(obj[firstPart])[secondPart] : null;
			} else {
				// Check if the variable exists in the replacements object
				return obj.hasOwnProperty(variable) ? obj[variable] : null;
			}
		});
	
		if (type === 'data') {
			return JSON.parse(resultString);
		}

		return resultString;
	} else {
		for (var key in obj) {
			if (data[key]) {
				data[key] = obj[key];
			}
		}
	}

	return data;
}

// Function to create and toggle the response section
const toggleResponseSection = (existingResponseSection, request, response, statusCode) => {
	var classes = "text-red-400";
	if (statusCode >= 200 && statusCode <= 299) {
		classes = "text-green-500";
	}

	// Add content to the div
	var contentToAppend = `
		<details class="request-details border-1 border-blue-400 px-4 py-3 mb-2">
			<summary class="request-summary ${classes}">
				<span class="request-info request-method">${request.method}</span>
				<span class="request-info request-url">${request.url}</span>
				<span class="request-info request-status">${statusCode}</span>
			</summary>
			<p class="response text-black my-2">${response}</p>
		</details>
	`;
	
	existingResponseSection.innerHTML += contentToAppend;
}

// Prepend Failed & Success Request Data
const prependFailedAndSuccessRequestData = (existingResponseSection, failedRequestData, successRequestData) => {
	var contentToAppend = `
		<details class="request-details border-1 border-blue-400 text-red-400 px-4 py-3 mb-2">
			<summary class="text-danger">
				Failed Requests: ${failedRequestData.length}
			</summary>
			<p class="response text-black my-2">${JSON.stringify(failedRequestData)}</p>
		</details>
		<details class="request-details border-1 border-blue-400 text-green-500 px-4 py-3 mb-2">
			<summary class="text-success">
				Success Requests: ${successRequestData.length}
			</summary>
			<p class="response text-black my-2">${JSON.stringify(successRequestData)}</p>
		</details>
	`;

	// Check if the response section is already appended to the body
	existingResponseSection.innerHTML = contentToAppend + existingResponseSection.innerHTML;
}

// Parse Response Data
const parseResponseData = (data) => {
	if (typeof data !== 'string') {
		return JSON.stringify(data, null, 4);
	}
	
	return data;
}

// Send request to API using axios
const sendRequest = async (request, existingResponseSection, globalSuccessRequestsData, globalFailedRequestsData, dataForRequestData = {}) => {
	if (typeof request.data === 'string') {
		request.data = JSON.parse(request.data);
	}

	var responseData = "";
	var statusCode = "";
	var requestInfo = JSON.parse(JSON.stringify(request));

	if (!isDefined(requestInfo.data)) {
		requestInfo.data = dataForRequestData;
	}

	const instance = axios.create();

	// Send Request
	return await instance({
		method: request.method,
		url: request.url,
		headers: request.headers,
		data: request.data
	}).then(function (response) {
		// handle success
		responseData = parseResponseData(response.data);
		statusCode = response.status;
		globalSuccessRequestsData.push(requestInfo.data);

		return {
			data: response.data,
			status: statusCode
		};
	}).catch(function (error) {
		// handle error
		responseData = parseResponseData(error);
		statusCode = -1;
		
		if (error.response) {
			statusCode = error.response.status;
		}

		globalFailedRequestsData.push(requestInfo.data);

		return {
			data: error,
			status: statusCode
		};
	}).then(function (res) {
		toggleResponseSection(existingResponseSection, requestInfo, responseData, statusCode);
		
		return res;
	});
}

// Function to Loop on Array of Objects
const sendRequestForObjects = async (existingResponseSection, jsonString, request) => {
	const globalFailedRequestsData = [];
	const globalSuccessRequestsData = [];

	// try {
		existingResponseSection.innerHTML = "";

		var jsonData = JSON.parse(jsonString);

		if (jsonData.length > 0) {
			for (let index in jsonData) {
				var newRequestData = JSON.parse(JSON.stringify(request));
				newRequestData.data = replaceDynamicData(newRequestData.data, jsonData[index]);
				newRequestData.url = replaceDynamicData(newRequestData.url, jsonData[index], 'string');

				// Send requests now
				await sendRequest(newRequestData, existingResponseSection, globalSuccessRequestsData, globalFailedRequestsData);
			}

			prependFailedAndSuccessRequestData(existingResponseSection, globalFailedRequestsData, globalSuccessRequestsData);
		}
	// } catch (e) {
	// 	alert('Error: ' + e.message);
	// }
}

export {
	delay,
	copyToClipboard,
	handleChange,
	handleCheckbox,
	isDefined,
	convertCurlToApiRequest,
	replaceDynamicData,
	removeStringAndSingleQuote,
	prependFailedAndSuccessRequestData,
	sendRequest,
	sendRequestForObjects,
};