function AvatarPlaceholder({ name, size = 96 }) {
  const initial = name ? name.charAt(0).toUpperCase() : "";

  if (!initial) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 96 96"
        fill="none"
        style={{ borderRadius: "50%" }}
      >
        <circle cx="48" cy="48" r="48" fill="#374151" />
        <circle cx="48" cy="48" r="38" fill="#4B5563" stroke="#374151" strokeWidth="2" />
        <path
          d="M48 25L55 40H41L48 25Z"
          fill="#6B7280"
          stroke="#374151"
          strokeWidth="1.5"
        />
        <path
          d="M48 71L41 56H55L48 71Z"
          fill="#6B7280"
          stroke="#374151"
          strokeWidth="1.5"
        />
        <path
          d="M25 48L40 55L40 41L25 48Z"
          fill="#6B7280"
          stroke="#374151"
          strokeWidth="1.5"
        />
        <path
          d="M71 48L56 41L56 55L71 48Z"
          fill="#6B7280"
          stroke="#374151"
          strokeWidth="1.5"
        />
        <path
          d="M32 32L42 42L32 42L32 32Z"
          fill="#6B7280"
          stroke="#374151"
          strokeWidth="1.5"
        />
        <path
          d="M64 32L64 42L54 42L64 32Z"
          fill="#6B7280"
          stroke="#374151"
          strokeWidth="1.5"
        />
        <path
          d="M32 64L32 54L42 54L32 64Z"
          fill="#6B7280"
          stroke="#374151"
          strokeWidth="1.5"
        />
        <path
          d="M64 64L54 54L64 54L64 64Z"
          fill="#6B7280"
          stroke="#374151"
          strokeWidth="1.5"
        />
        <circle cx="48" cy="48" r="15" fill="#4B5563" stroke="#374151" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        backgroundColor: "#374151",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          color: "white",
          fontSize: `${size / 2.5}px`,
          fontWeight: "bold",
        }}
      >
        {initial}
      </span>
    </div>
  );
}

export default AvatarPlaceholder;
