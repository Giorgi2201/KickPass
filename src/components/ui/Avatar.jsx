import { useState } from "react";
import AvatarPlaceholder from "./AvatarPlaceholder";

function Avatar({ url, name, size = 96 }) {
  const [broken, setBroken] = useState(false);

  if (!url || broken) {
    return <AvatarPlaceholder name={name} size={size} />;
  }

  return (
    <img
      src={url}
      alt={name || "Avatar"}
      width={size}
      height={size}
      onError={() => setBroken(true)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "cover",
        borderRadius: "50%",
      }}
    />
  );
}

export default Avatar;
