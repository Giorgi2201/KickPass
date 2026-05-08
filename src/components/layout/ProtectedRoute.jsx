import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Card from "../ui/Card";

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <Card className="w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold text-white">Access Denied</h1>
        </Card>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
