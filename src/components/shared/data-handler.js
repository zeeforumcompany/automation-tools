'use client'

const { useEffect, useRef, useImperativeHandle } = require("react");

export default function DataHandler(props) {
	const { StorageKey, DefaultData, form, setForm, ref } = props;
	const alertRef = useRef(null);

	useEffect(() => {
		const data = getDataFromStorage(StorageKey);
		if (data) {
			setForm(data);
		}
	}, [StorageKey]);

	useImperativeHandle(ref, () => ({
		saveData,
	}));

	const saveDataInStorage = (key, data) => {
		localStorage.setItem(key, JSON.stringify(data));
	};

	const getDataFromStorage = (key) => {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	};

	const clearDataInStorage = (key) => {
		localStorage.removeItem(key);
	};

	const saveData = () => {
		try {
			saveDataInStorage(StorageKey, form);
			alertRef.current.innerHTML = `<div class="text-green-600">Data saved successfully!</div>`;
		} catch (error) {
			alertRef.current.innerHTML = `<div class="text-red-600">Error saving data: ${error.message}</div>`;
		}
	};

	const setDefaultData = () => {
		try {
			clearDataInStorage(StorageKey);
			setForm(DefaultData);
			alertRef.current.innerHTML = `<div class="text-green-600">Data set to default successfully!</div>`;
		} catch (error) {
			alertRef.current.innerHTML = `<div class="text-red-600">Error setting data to default: ${error.message}</div>`;
		}
	};

	return (
		<>
			<button onClick={saveData} className="cursor-pointer bg-green-800 text-white py-2 px-4 rounded-sm hover:bg-green-700 mt-2 disabled:bg-green-700 disabled:opacity-30 disabled:cursor-not-allowed font-bold ml-2">Save Data</button>
			<button onClick={setDefaultData} className="cursor-pointer bg-red-800 text-white py-2 px-4 rounded-sm hover:bg-red-700 mt-2 disabled:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed font-bold ml-2">Set Default Data</button>

			<div ref={alertRef}></div>
		</>
	);
};