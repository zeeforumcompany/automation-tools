'use client'

export default function Input({ type = "text", name, value, onChange, placeholder = "", className = "" }) {
  return (
	<div className="mb-2">
		<label htmlFor={name}>{placeholder}</label>
		<input
		  id={name}
		  type={type}
		  name={name}
		  value={value}
		  onChange={onChange}
		  placeholder={placeholder}
		  className={`border border-gray-300 rounded-md p-2 w-full ${className}`}
		/>
	</div>
  );
}