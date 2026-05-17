import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectTo?: string;
}

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = "/",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return null; // or a spinner

  if (!user) return <Navigate to="/" replace />;

  if (!allowedRoles.includes(user.role))
    return <Navigate to={getRoleHome(user.role)} replace />;

  return <Outlet />;
}

function getRoleHome(role: string) {
  switch (role) {
    case "SuperAdmin":
    case "Admin":      return "/admin/dashboard";
    case "Technician": return "/technician/dashboard";
    case "Customer":   return "/customer/dashboard";
    default:           return "/";
  }
}