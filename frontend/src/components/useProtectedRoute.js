import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useEffect } from "react";

// This hook will redirect the user to the dashboard if they are already logged in

const useProtectedRoute = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]); // This useEffect will run every time the currentUser changes
};

export default useProtectedRoute;
