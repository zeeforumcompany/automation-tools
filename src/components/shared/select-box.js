'use client'

export default function SelectBox({ name, value, onChange, options, label = "", className = "" }) {
  return (
	<div className="mb-2">
		<label htmlFor={name}>{label}</label>
		<select
		  id={name}
		  name={name}
		  value={value}
		  onChange={onChange}
		  className={`border border-gray-300 rounded-md p-2 w-full ${className}`}
		>
		  {options.map((option) => (
			<option key={option.value || option} value={option.value || option}>
			  {option.label || option.value || option}
			</option>
		  ))}
		</select>
	</div>
  );
}