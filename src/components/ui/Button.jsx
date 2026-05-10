function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  ariaLabel,
}) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition disabled:cursor-not-allowed disabled:opacity-60";

  const variantClasses = {
    primary: "bg-[#16a34a] text-white hover:bg-green-600",
    secondary: "border border-gray-500 text-gray-200 hover:bg-gray-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}
      {children}
    </button>
  );
}

export default Button;
