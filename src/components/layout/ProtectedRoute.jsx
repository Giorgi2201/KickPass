import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../ui/Card";
import Button from "../ui/Button";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <Card className="w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold text-white">Access Denied</h1>
          <p className="mt-2 text-gray-300">You don't have permission to view this page.</p>
          <div className="mt-4">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </div>
          <div className="mt-3">
            <Link to="/dashboard" className="text-sm text-[#16a34a] hover:underline">
              Go to Dashboard
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
