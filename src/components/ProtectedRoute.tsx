
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, session } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Wait a short moment to ensure auth state is synchronized
      await new Promise(resolve => setTimeout(resolve, 100));
      setIsChecking(false);
    };
    checkAuth();
  }, []);

  // Show nothing while checking auth status
  if (isChecking) {
    return null;
  }

  if (!user && !session) {
    // Only redirect if we're definitely not authenticated
    console.log("No user found, redirecting to home");
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  console.log("User authenticated, rendering protected content");
  return <>{children}</>;
};
