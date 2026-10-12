import { useState } from "react";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          box-sizing: border-box;
          background: linear-gradient(135deg, #e8efff, #f3edff, #eaf5ff);
          font-family: Arial, sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 440px;
          box-sizing: border-box;
          padding: 38px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          box-shadow: 0 18px 55px rgba(30, 41, 90, 0.12);
        }

        .login-logo {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
          border-radius: 16px;
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          color: white;
          font-size: 28px;
          font-weight: bold;
        }

        .login-card h1 {
          margin: 0 0 10px;
          color: #172554;
          font-size: 30px;
          line-height: 1.3;
        }

        .login-subtitle {
          margin: 0 0 30px;
          color: #64748b;
          font-size: 16px;
          line-height: 1.6;
        }

        .login-field {
          margin-bottom: 22px;
        }

        .login-field label {
          display: block;
          margin-bottom: 9px;
          color: #334155;
          font-size: 16px;
          font-weight: 700;
        }

        .login-field input {
          width: 100%;
          min-height: 54px;
          box-sizing: border-box;
          padding: 14px 15px;
          border: 1px solid #cbd5e1;
          border-radius: 11px;
          outline: none;
          background: #f8fafc;
          color: #0f172a;
          font-size: 17px;
        }

        .login-field input:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
          background: white;
        }

        .password-wrapper {
          position: relative;
        }

        .password-wrapper input {
          padding-right: 88px;
        }

        .password-toggle {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          border: none;
          background: transparent;
          color: #4f46e5;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          padding: 8px 4px;
        }

        .login-error {
          margin: 0 0 18px;
          padding: 12px 14px;
          border-radius: 9px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 15px;
          line-height: 1.5;
        }

        .login-submit {
          width: 100%;
          min-height: 55px;
          border: none;
          border-radius: 11px;
          background: linear-gradient(135deg, #2563eb, #6d28d9);
          color: white;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
        }

        .login-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .login-footer {
          margin-top: 24px;
          color: #64748b;
          font-size: 15px;
          line-height: 1.7;
          text-align: center;
        }

        .login-footer a {
          color: #4f46e5;
          font-weight: 700;
          text-decoration: none;
        }

        .login-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 26px 22px;
          }

          .login-card h1 {
            font-size: 27px;
          }
        }
      `}</style>

      <div className="login-card">
        <div className="login-logo">W</div>

        <h1>Welcome Back</h1>
        <p className="login-subtitle">
          Sign in to access your Digital Wallet.
        </p>

        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && <div className="login-error">{error}</div>}

          <button
            type="submit"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <a href="/register">Create Account</a>
        </p>

        <p className="login-footer" style={{ marginTop: 10 }}>
          Secure access to your digital wallet
        </p>
      </div>
    </div>
  );
}

export default Login;
