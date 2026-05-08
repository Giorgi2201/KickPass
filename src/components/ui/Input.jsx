function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  min,
  max,
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-200">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-[#16a34a]"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default Input;
