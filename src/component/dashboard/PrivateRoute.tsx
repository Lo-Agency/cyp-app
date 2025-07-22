import { ReactNode } from "react";
import { useUser } from "../../contexts/userContext";
import { Navigate } from "react-router-dom";

type privateRouteProps = {
  children: ReactNode;
};
const PrivateRoute = ({ children }: privateRouteProps) => {
  const { user, loading } = useUser();
  if (loading) return <div>در حال بارگذاری...</div>;

  return user ? children : <Navigate to="/" />;
};

export default PrivateRoute;
