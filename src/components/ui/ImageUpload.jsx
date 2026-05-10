import { useRef, useState } from "react";
import Button from "./Button";
import { useToast } from "../../context/ToastContext";
import { getErrorMessage } from "../../utils/errors";

function ImageUpload({ currentUrl, onUpload, label }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [imageBroken, setImageBroken] = useState(false);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      addToast("Please select an image file", "error");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      addToast("File must be under 5MB", "error");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
      );

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();
      setImageBroken(false);
      onUpload(result.secure_url);
      addToast("Photo uploaded successfully", "success");
    } catch (err) {
      addToast(getErrorMessage(err, "Upload failed, please try again"), "error");
    } finally {
      setLoading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">{label}</label>
      <div className="flex items-center gap-4">
        {currentUrl && !imageBroken && (
          <img
            src={currentUrl}
            alt={`${label} preview`}
            className="h-24 w-24 rounded-lg object-cover border border-gray-700"
            onError={() => setImageBroken(true)}
          />
        )}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleButtonClick}
            loading={loading}
          >
            {currentUrl && !imageBroken ? "Change Photo" : "Upload Photo"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
