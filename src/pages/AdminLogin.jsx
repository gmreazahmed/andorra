import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const AdminLogin = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    if (!ADMIN_PASSWORD) {
      setError("Admin password is not configured.");
      setLoading(false);
      return;
    }

    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("admin_logged_in", "true");
      navigate("/admin", { replace: true });
      return;
    }

    setError("Invalid password. Please try again.");
    setPassword("");
    setLoading(false);
  };

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleLogin}>
        <div className="admin-login-brand">
          <div className="admin-login-icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2.8 19 6v5.2c0 4.6-3 8.1-7 10-4-1.9-7-5.4-7-10V6l7-3.2Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="m9 12 2 2 4-4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="admin-login-label">SECURE ADMINISTRATION</span>
        </div>

        <h1>Admin Login</h1>

        <p className="admin-login-description">
          Sign in to access the administration panel. Please enter your
          administrator password.
        </p>

        <div className="admin-login-field">
          <label htmlFor="admin-password">Admin Password</label>

          <div className="admin-password-wrapper">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              autoComplete="current-password"
              required
              autoFocus
              disabled={loading}
            />

            <button
              type="button"
              className="admin-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 3 21 21M10.6 10.6a2 2 0 0 0 2.8 2.8"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                  <path
                    d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5.2 0 8.5 4.4 9.5 6.1a1.7 1.7 0 0 1 0 1.8 13.2 13.2 0 0 1-3.1 3.5M6.2 6.2A13.2 13.2 0 0 0 2.5 11.1a1.7 1.7 0 0 0 0 1.8C3.5 14.6 6.8 19 12 19c1.1 0 2.1-.2 3-.6"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.5 12s3.3-7 9.5-7 9.5 7 9.5 7-3.3 7-9.5 7-9.5-7-9.5-7Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="admin-error" role="alert">
            <svg viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M12 8v5m0 3h.01"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="admin-login-submit"
          disabled={loading || !password.trim()}
        >
          {loading ? (
            <>
              <span className="admin-login-spinner" />
              Verifying...
            </>
          ) : (
            <>
              Sign In
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14m-6-6 6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>

        <div className="admin-login-security">
          <svg viewBox="0 0 24 24" fill="none">
            <rect
              x="5"
              y="10"
              width="14"
              height="11"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M8 10V7a4 4 0 0 1 8 0v3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span>Protected Administrative Access</span>
        </div>
      </form>

      <footer className="admin-login-footer">
        <span>Andorra eVisa Administration</span>
        <span>Authorized Personnel Only</span>
      </footer>
    </main>
  );
};

export default AdminLogin;
