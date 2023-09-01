import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/FakeAuthContext";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigator = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated) navigator("/");
    },
    [isAuthenticated, navigator]
  );

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
