import { useState } from "react";
import api from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/api/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
      });

      window.location.href = "/?registered=true";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Registration failed. This email may already be registered."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <style>{`
        .register-page, .register-page * {
          box-sizing: border-box;
        }

        .register-page {
          min-height: 100vh;
          padding: 36px 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          background:
            radial-gradient(ellipse at 8% 10%, rgba(59,130,246,.13), transparent 38%),
            radial-gradient(ellipse at 92% 90%, rgba(124,58,237,.10), transparent 38%),
            #f3f6fc;
          font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: #172554;
        }

        .register-layout {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          width: 100%;
          max-width: 960px;
          min-height: 590px;
          overflow: hidden;
          background: #fff;
          border: 1px solid #e5eaf3;
          border-radius: 26px;
          box-shadow: 0 28px 80px rgba(30, 41, 80, .12);
        }

        .register-intro {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          padding: 42px 36px;
          color: #fff;
          background: linear-gradient(145deg, #172554 0%, #243b80 55%, #4338a8 100%);
        }

        .register-intro::before {
          content: "";
          position: absolute;
          width: 280px;
          height: 280px;
          right: -130px;
          top: 100px;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 50%;
          box-shadow: 0 0 0 35px rgba(255,255,255,.035),
                      0 0 0 70px rgba(255,255,255,.025);
        }

        .register-brand {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -.4px;
        }

        .register-brand-mark {
          display: grid;
          place-items: center;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: rgba(255,255,255,.15);
          border: 1px solid rgba(255,255,255,.23);
          font-size: 22px;
          font-weight: 800;
        }

        .register-intro-content {
          position: relative;
          z-index: 1;
          margin: 48px 0;
        }

        .register-eyebrow {
          display: inline-block;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,.22);
          border-radius: 30px;
          background: rgba(255,255,255,.09);
          color: #e0e7ff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .register-intro h2 {
          margin: 22px 0 16px;
          color: white;
          font-size: clamp(30px, 3vw, 39px);
          line-height: 1.18;
          letter-spacing: -1.2px;
        }

        .register-intro p {
          max-width: 330px;
          margin: 0;
          color: #dbe5ff;
          font-size: 16px;
          line-height: 1.8;
        }

        .register-benefits {
          position: relative;
          z-index: 1;
          display: grid;
          gap: 15px;
          margin-top: 30px;
        }

        .register-benefit {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #edf2ff;
          font-size: 14px;
        }

        .register-benefit-icon {
          display: grid;
          place-items: center;
          flex: 0 0 30px;
          height: 30px;
          border-radius: 9px;
          background: rgba(255,255,255,.12);
          font-weight: 800;
        }

        .register-intro-footer {
          position: relative;
          z-index: 1;
          color: #c7d2fe;
          font-size: 12px;
        }

        .register-form-panel {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 46px 48px;
        }

        .register-mobile-brand {
          display: none;
        }

        .register-form-panel h1 {
          margin: 0 0 10px;
          color: #172554;
          font-size: 32px;
          line-height: 1.25;
          letter-spacing: -.8px;
        }

        .register-description {
          margin: 0 0 30px;
          color: #64748b;
          font-size: 16px;
          line-height: 1.7;
        }

        .register-field {
          margin-bottom: 21px;
        }

        .register-field label {
          display: block;
          margin-bottom: 9px;
          color: #334155;
          font-size: 15px;
          font-weight: 700;
        }

        .register-field input {
          display: block;
          width: 100%;
          height: 53px;
          padding: 0 15px;
          border: 1px solid #d6deeb;
          border-radius: 11px;
          outline: none;
          background: #f8faff;
          color: #0f172a;
          font-family: inherit;
          font-size: 16px;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }

        .register-field input::placeholder {
          color: #94a3b8;
        }

        .register-field input:focus {
          border-color: #536dfe;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(83,109,254,.11);
        }

        .register-password-wrap {
          position: relative;
        }

        .register-password-wrap input {
          padding-right: 76px;
        }

        .register-show-password {
          position: absolute;
          top: 50%;
          right: 12px;
          transform: translateY(-50%);
          border: 0;
          background: transparent;
          color: #4f46e5;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
        }

        .register-hint {
          margin: 8px 0 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .register-error {
          margin: 0 0 18px;
          padding: 13px 14px;
          border: 1px solid #fecaca;
          border-radius: 10px;
          background: #fef2f2;
          color: #b91c1c;
          font-size: 14px;
          line-height: 1.6;
        }

        .register-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          min-height: 54px;
          margin-top: 4px;
          border: 0;
          border-radius: 12px;
          background: linear-gradient(110deg, #315cf5, #6441e8);
          box-shadow: 0 9px 20px rgba(79,70,229,.20);
          color: white;
          font-family: inherit;
          font-size: 16px;
          font-weight: 750;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }

        .register-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 25px rgba(79,70,229,.27);
        }

        .register-submit:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .register-signin {
          margin: 25px 0 0;
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }

        .register-signin a {
          color: #4f46e5;
          font-weight: 750;
          text-decoration: none;
        }

        .register-signin a:hover {
          text-decoration: underline;
        }

        .register-secure-note {
          margin-top: 25px;
          padding-top: 18px;
          border-top: 1px solid #edf0f6;
          color: #94a3b8;
          font-size: 12px;
          text-align: center;
        }

        @media (max-width: 760px) {
          .register-page {
            padding: 20px 14px;
          }

          .register-layout {
            display: block;
            max-width: 480px;
            min-height: auto;
            border-radius: 22px;
          }

          .register-intro {
            display: none;
          }

          .register-form-panel {
            padding: 34px 26px;
          }

          .register-mobile-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 28px;
            color: #172554;
            font-size: 18px;
            font-weight: 800;
          }

          .register-mobile-brand span {
            display: grid;
            place-items: center;
            width: 40px;
            height: 40px;
            border-radius: 12px;
            background: linear-gradient(135deg, #315cf5, #6441e8);
            color: #fff;
          }

          .register-form-panel h1 {
            font-size: 29px;
          }
        }
      `}</style>

      <div className="register-layout">
        <aside className="register-intro">
          <div className="register-brand">
            <div className="register-brand-mark">W</div>
            <span>Wallet<span style={{ color: "#a5b4fc" }}>Flow</span></span>
          </div>

          <div className="register-intro-content">
            <span className="register-eyebrow">Your money, organized</span>
            <h2>Smarter money management starts here.</h2>
            <p>
              Create your account to manage your virtual wallet,
              track transactions, and keep everything organized in one place.
            </p>

            <div className="register-benefits">
              <div className="register-benefit">
                <span className="register-benefit-icon">✓</span>
                Simple wallet management
              </div>
              <div className="register-benefit">
                <span className="register-benefit-icon">↗</span>
                Fast wallet-to-wallet transfers
              </div>
              <div className="register-benefit">
                <span className="register-benefit-icon">▤</span>
                Clear transaction history
              </div>
            </div>
          </div>

          <div className="register-intro-footer">
            A simple, secure way to manage your virtual wallet.
          </div>
        </aside>

        <section className="register-form-panel">
          <div className="register-mobile-brand">
            <span>W</span> WalletFlow
          </div>

          <h1>Create your account</h1>
          <p className="register-description">
            Get started with your digital wallet in just a few steps.
          </p>

          <form onSubmit={handleRegister}>
            <div className="register-field">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                type="text"
                placeholder="e.g. Nikhil Arsham"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-password">Create password</label>
              <div className="register-password-wrap">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  className="register-show-password"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className="register-hint">
                Use at least 8 characters for your password.
              </p>
            </div>

            {error && <div className="register-error">{error}</div>}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="register-signin">
            Already have an account? <a href="/">Sign in</a>
          </p>

          <div className="register-secure-note">
            Protected account access · Virtual wallet demonstration
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;
