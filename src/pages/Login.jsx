import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import api from "../services/api";
import { validateEmail } from "../utils/validation";
import { getErrorMessage } from "../utils/errors";
import { useToast } from "../context/ToastContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailBlur = () => {
    setTouched((prev) => ({ ...prev, email: true }));
    const err = validateEmail(formData.email);
    setEmailError(err);
  };

  const handlePasswordBlur = () => {
    setTouched((prev) => ({ ...prev, password: true }));
    if (!formData.password) {
      setPasswordError("Password is required");
    } else {
      setPasswordError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setTouched({ email: true, password: true });
    const emailValidationError = validateEmail(formData.email);
    const passwordValidationError = !formData.password ? "Password is required" : null;

    setEmailError(emailValidationError);
    setPasswordError(passwordValidationError);

    if (emailValidationError || passwordValidationError) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      addToast(getErrorMessage(err, "Invalid email or password"), "error");
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
          <p className="mt-2 text-sm text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handlePasswordBlur}
            placeholder="Enter password"
            required
            error={touched.password ? passwordError : null}
          />

          <Button type="submit" variant="primary" loading={loading} disabled={loading}>
            Login
          </Button>

          <p className="text-sm text-gray-300">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-[#16a34a] hover:text-green-400">
              Register
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}

export default Login;
