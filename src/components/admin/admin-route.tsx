import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const isAdmin = sessionStorage.getItem("crescita_admin") === "true";
  if (!isAdmin) return <Navigate to="/admin" replace />;
  return <>{children}</>;
};

export default AdminRoute;
