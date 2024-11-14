import React, { ReactElement } from "react";
import { useSelector } from "react-redux";

import AuthPage from "@modules/auth/view/AuthPage";
import { RootState } from "@store/store";

interface ProtectedRouteProps {
  children: ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return children;
  } else {
    return <AuthPage />;
  }
};

export default ProtectedRoute;
