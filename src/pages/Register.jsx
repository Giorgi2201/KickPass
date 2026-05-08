import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import api from "../services/api";
import { COACH, PLAYER, SCOUT } from "../utils/roles";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: PLAYER,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
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
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Your full name"
            required
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Choose a password"
            required
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

          {error && <p className="text-sm text-red-400">{error}</p>}

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
