function Badge({ label, color = "gray" }) {
  const colorClasses = {
    green: "bg-green-900/40 text-green-300",
    blue: "bg-blue-900/40 text-blue-300",
    yellow: "bg-yellow-900/40 text-yellow-300",
    red: "bg-red-900/40 text-red-300",
    gray: "bg-gray-800 text-gray-300",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${colorClasses[color]}`}
    >
      {label}
    </span>
  );
}

export default Badge;
