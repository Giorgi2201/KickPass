import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="px-6 py-4">
        <Link to="/" className="text-xl font-bold text-white">
          <span className="text-[#16a34a]">Kick</span>Pass
        </Link>
      </header>

      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4">
        <h1 className="text-8xl font-bold text-[#16a34a]">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-white">Page Not Found</h2>
        <p className="mt-2 text-gray-400">
          The page you're looking for doesn't exist.
        </p>

        <div className="mt-6 flex gap-3">
          <Button variant="primary" onClick={() => navigate("/dashboard")}>
            Go Home
          </Button>
          <Button variant="secondary" onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </div>
      </main>
    </div>
  );
}

export default NotFound;
