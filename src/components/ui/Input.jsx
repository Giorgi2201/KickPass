function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  errors,
  required = false,
  min,
  max,
  id,
  autoComplete,
}) {
  const inputId = id || name;
  const errorId = `${inputId}-error`;
  const hasError = error || (errors && errors.length > 0);

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-200">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        autoComplete={autoComplete}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-[#16a34a]"
      />
      {error && <p id={errorId} className="text-sm text-red-400">{error}</p>}
      {errors && errors.length > 0 && (
        <ul id={errorId} className="list-inside list-disc text-sm text-red-400">
          {errors.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Input;
