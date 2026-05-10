import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    logout();
    navigate("/login");
    setIsLogoutModalOpen(false);
  };

  const handleCancelLogout = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <header className="border-b border-gray-800 bg-gray-950">
      <nav aria-label="Main navigation" className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/dashboard" aria-label="Go to dashboard" className="text-xl font-bold text-white">
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
            <Button variant="secondary" onClick={handleLogoutClick} aria-label="Log out of KickPass">
              Logout
            </Button>
          </div>
        )}
      </nav>

      <Modal
        isOpen={isLogoutModalOpen}
        title="Log Out"
        message="Are you sure you want to log out of KickPass?"
        confirmLabel="Log Out"
        confirmVariant="danger"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </header>
  );
}

export default Navbar;
