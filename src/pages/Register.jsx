import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import api from "../services/api";
import { COACH, PLAYER, SCOUT } from "../utils/roles";
import { validatePassword, validateEmail } from "../utils/validation";
import { getErrorMessage } from "../utils/errors";
import { useToast } from "../context/ToastContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: PLAYER,
  });
  const [loading, setLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [emailError, setEmailError] = useState(null);
  const [fullNameError, setFullNameError] = useState(null);
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    role: false,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    const errors = validatePassword(formData.password);
    setPasswordErrors(errors);
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    const err = validateEmail(formData.email);
    setEmailError(err);
  };

  const handleFullNameBlur = () => {
    setTouched((prev) => ({ ...prev, fullName: true }));
    if (!formData.fullName) {
      setFullNameError("Full name is required");
    } else {
      setFullNameError(null);
    }
  };

  const handleRoleBlur = () => {
    setTouched((prev) => ({ ...prev, role: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    setTouched({ fullName: true, email: true, password: true, role: true });

    const emailValidationError = validateEmail(formData.email);
    const passwordValidationErrors = validatePassword(formData.password);
    const fullNameValidationError = !formData.fullName ? "Full name is required" : null;

    setEmailError(emailValidationError);
    setPasswordErrors(passwordValidationErrors);
    setFullNameError(fullNameValidationError);

    if (emailValidationError || passwordValidationErrors.length > 0 || fullNameValidationError) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/register", formData);
      login(response.data.token, response.data.user);
      addToast("Account created! Welcome to KickPass", "success");
      navigate("/dashboard");
    } catch (err) {
      addToast(getErrorMessage(err, "Registration failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white">
            <span className="text-[#16a34a]">Kick</span>Pass
          </h1>
          <p className="mt-2 text-sm text-gray-400">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            autoComplete="name"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleFullNameBlur}
            placeholder="Your full name"
            required
            error={touched.fullName ? fullNameError : null}
          />

          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleEmailBlur}
            placeholder="you@example.com"
            required
            error={touched.email ? emailError : null}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handlePasswordBlur}
            placeholder="Choose a password"
            required
            errors={touched.password ? passwordErrors : []}
          />

          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium text-gray-200">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              onBlur={handleRoleBlur}
              required
              className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white outline-none focus:border-[#16a34a]"
            >
              <option value={PLAYER}>Player</option>
              <option value={COACH}>Coach</option>
              <option value={SCOUT}>Scout</option>
            </select>
          </div>

          <Button type="submit" variant="primary" loading={loading} disabled={loading}>
            Create Account
          </Button>

          <p className="text-sm text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-[#16a34a] hover:text-green-400">
              Login
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default Register;
