import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-gray-800 bg-gray-950">
      <nav className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-white">
          <span className="text-[#16a34a]">Kick</span>Pass
        </Link>

        {!user ? (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-gray-200 hover:text-white">
              Login
            </Link>
            <Link to="/register" className="text-sm text-gray-200 hover:text-white">
              Register
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-white">{user.fullName}</span>
            <Badge label={user.role} color="green" />
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
