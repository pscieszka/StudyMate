import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = sessionStorage.getItem("accessToken");

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
