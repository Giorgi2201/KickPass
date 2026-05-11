import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { COACH, PLAYER, SCOUT } from "../../utils/roles";
import Badge from "../ui/Badge";
import Button from "../ui/Button";
import Modal from "../ui/Modal";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navLinks = {
    [PLAYER]: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "My Profile", path: "/profile" },
    ],
    [COACH]: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Match Center", path: "/coach" },
      { label: "My Club", path: "/club" },
    ],
    [SCOUT]: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Find Players", path: "/scout" },
    ],
  };

  const isActive = (path) => location.pathname === path;

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
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-4 py-4"
      >
        <Link
          to="/dashboard"
          aria-label="Go to dashboard"
          className="shrink-0 text-xl font-bold text-white"
        >
          <span className="text-[#16a34a]">Kick</span>Pass
        </Link>

        {user && navLinks[user.role] && (
          <div className="hidden items-center gap-6 sm:flex">
            {navLinks[user.role].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={
                  isActive(link.path)
                    ? "text-sm font-medium text-[#16a34a]"
                    : "text-sm text-gray-300 transition-colors hover:text-white"
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

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
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <span className="text-sm text-white">{user.fullName}</span>
            <Badge label={user.role} color="green" />
            <Button variant="secondary" onClick={handleLogoutClick} aria-label="Log out of KickPass">
              Logout
            </Button>
          </div>
        )}
      </nav>

      {user && navLinks[user.role] && (
        <div className="flex items-center gap-4 border-t border-gray-800 px-4 pb-3 pt-3 sm:hidden">
          {navLinks[user.role].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={
                isActive(link.path)
                  ? "text-sm font-medium text-[#16a34a]"
                  : "text-sm text-gray-300 transition-colors hover:text-white"
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

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
