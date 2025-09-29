// frontend/src/pages/OAuthRedirect.tsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OAuthRedirect() {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // optional: remove token from URL so it isn't visible
      navigate("/dashboard", { replace: true });
    } else {
      // no token -> go to auth
      navigate("/auth");
    }
  }, [navigate, search]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in…</p>
    </div>
  );
}
