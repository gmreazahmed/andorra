import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const AdminLogin = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    if (!ADMIN_PASSWORD) {
      setError("Admin password is not configured.");
      setLoading(false);
      return;
    }

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_logged_in", "true");
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid password. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <div className="admin-login-icon">A</div>

        <h2>Admin Login</h2>
        <p>Sign in to access the administration panel.</p>

        <label htmlFor="admin-password">Admin Password</label>

        <input
          id="admin-password"
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {error && (
          <div className="admin-error" role="alert">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
