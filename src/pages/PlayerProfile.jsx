import { useEffect, useMemo, useState } from "react";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import ImageUpload from "../components/ui/ImageUpload";
import Avatar from "../components/ui/Avatar";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import { getErrorMessage } from "../utils/errors";

function isValidVideoUrl(url) {
  if (!url) return false;
  return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/.test(url);
}

const initialForm = {
  position: "Goalkeeper",
  dominantFoot: "Right",
  age: "",
  city: "",
  country: "",
  bio: "",
  highlightUrl: "",
  avatarUrl: "",
};

function PlayerProfile() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState(initialForm);
  const [profileExists, setProfileExists] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const loadProfile = async () => {
    setLoading(true);
    setGeneralError("");
    try {
      const response = await api.get("/players/profile/me");
      const profile = response.data;
      setProfileData(profile);
      setFormData({
        position: profile.position || initialForm.position,
        dominantFoot: profile.dominantFoot || initialForm.dominantFoot,
        age: profile.age?.toString() || initialForm.age,
        city: profile.city || initialForm.city,
        country: profile.country || initialForm.country,
        bio: profile.bio || initialForm.bio,
        highlightUrl: profile.highlightUrl || initialForm.highlightUrl,
        avatarUrl: profile.avatarUrl || initialForm.avatarUrl,
      });
      setProfileExists(true);
    } catch (error) {
      if (error.response?.status === 404) {
        setProfileExists(false);
      } else {
        setGeneralError(getErrorMessage(error, "Failed to load profile."));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    setGeneralError("");
  };

  const mapApiErrors = (error) => {
    if (error.response?.data?.errors && typeof error.response.data.errors === "object") {
      const mapped = {};
      Object.entries(error.response.data.errors).forEach(([key, value]) => {
        mapped[key.charAt(0).toLowerCase() + key.slice(1)] = Array.isArray(value)
          ? value[0]
          : value;
      });
      setFieldErrors(mapped);
      return;
    }
    setGeneralError(getErrorMessage(error, "Failed to save profile."));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setGeneralError("");
    setFieldErrors({});

    try {
      const payload = {
        ...formData,
        age: Number(formData.age),
      };
      if (!profileExists) {
        await api.post("/players/profile", payload);
        addToast("Profile created!", "success");
        await loadProfile();
      } else {
        const response = await api.put("/players/profile", payload);
        setProfileData(response.data);
        addToast("Profile updated!", "success");
      }
    } catch (error) {
      mapApiErrors(error);
    } finally {
      setSubmitting(false);
    }
  };

  const bioRemaining = useMemo(() => 300 - (formData.bio?.length || 0), [formData.bio]);

  if (loading) {
    return (
      <Card>
        <p className="text-gray-300">Loading profile...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold text-white">My Profile</h1>
          {profileExists && <Badge label="Profile Active" color="green" />}
        </div>

        {!profileExists && (
          <p className="mb-4 text-sm text-gray-300">
            Set up your profile so scouts can find you
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="position" className="text-sm font-medium text-gray-200">
              Position
            </label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-[#16a34a]"
              required
            >
              <option value="Goalkeeper">Goalkeeper</option>
              <option value="Defender">Defender</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Forward">Forward</option>
            </select>
            {fieldErrors.position && <p className="text-sm text-red-400">{fieldErrors.position}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="dominantFoot" className="text-sm font-medium text-gray-200">
              Dominant Foot
            </label>
            <select
              id="dominantFoot"
              name="dominantFoot"
              value={formData.dominantFoot}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-[#16a34a]"
              required
            >
              <option value="Left">Left</option>
              <option value="Right">Right</option>
              <option value="Both">Both</option>
            </select>
            {fieldErrors.dominantFoot && (
              <p className="text-sm text-red-400">{fieldErrors.dominantFoot}</p>
            )}
          </div>

          <Input
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
            error={fieldErrors.age}
            min={10}
            max={60}
          />

          <Input
            label="City"
            name="city"
            autoComplete="address-level2"
            value={formData.city}
            onChange={handleChange}
            required
            error={fieldErrors.city}
          />

          <Input
            label="Country"
            name="country"
            autoComplete="country-name"
            value={formData.country}
            onChange={handleChange}
            required
            error={fieldErrors.country}
          />

          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium text-gray-200">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              maxLength={300}
              rows={4}
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-[#16a34a]"
            />
            <p className="text-xs text-gray-400">{bioRemaining} characters remaining</p>
            {fieldErrors.bio && <p className="text-sm text-red-400">{fieldErrors.bio}</p>}
          </div>

          <Input
            label="Highlight URL"
            name="highlightUrl"
            value={formData.highlightUrl}
            onChange={handleChange}
            placeholder="YouTube or Vimeo link"
            error={fieldErrors.highlightUrl}
          />

          <ImageUpload
            label="Profile Photo"
            currentUrl={formData.avatarUrl}
            onUpload={(url) =>
              setFormData((prev) => ({ ...prev, avatarUrl: url }))
            }
          />

          <Button type="submit" variant="primary" loading={submitting}>
            {profileExists ? "Update Profile" : "Create Profile"}
          </Button>
        </form>

        {generalError && <p className="mt-4 text-sm text-red-400">{generalError}</p>}
      </Card>

      {profileExists && (
        <Card>
          <h2 className="mb-4 text-xl font-semibold text-white">Profile Preview</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <Avatar url={profileData?.avatarUrl} name={user?.fullName || "Player"} size={96} />
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-white">{user?.fullName || "Player"}</h3>
              <Badge label={formData.position} color="green" />
              <p className="text-sm text-gray-300">
                {formData.city}, {formData.country}
              </p>
              {formData.bio && <p className="text-sm text-gray-300">{formData.bio}</p>}
              {isValidVideoUrl(formData.highlightUrl) ? (
                <a
                  href={formData.highlightUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-[#16a34a] underline"
                >
                  ▶ Watch highlight video
                </a>
              ) : (
                <p className="text-sm text-gray-500">No highlight video added</p>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default PlayerProfile;
