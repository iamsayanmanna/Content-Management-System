
import { useState } from "react";
import "./AuthorLogin.css";
import { loginAuthor } from "../services/authService";

const Icon = ({ name, size = 20 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: "false",
  };

  const paths = {
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="m3 3 18 18" />
        <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4-.8" />
        <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    back: (
      <>
        <path d="m15 18-6-6 6-6" />
        <path d="M9 12h12" />
      </>
    ),
  };

  return <svg {...common}>{paths[name]}</svg>;
};

function AuthorLogin({ onBack, onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await loginAuthor(username.trim(), password);
      onLoginSuccess(result.author);
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-orb login-orb-one" aria-hidden="true" />
      <div className="login-orb login-orb-two" aria-hidden="true" />

      <section className="login-card" aria-labelledby="login-heading">
        <a
          className="login-brand"
          href="/"
          aria-label="PenSpace homepage"
          onClick={(event) => {
            event.preventDefault();
            onBack?.();
          }}
        >
          <span className="login-brand-mark">P</span>
          <span className="login-brand-word">
            Pen<span>Space</span>
          </span>
        </a>

        <div className="login-heading-block">
          <p className="login-eyebrow">
            <span className="login-eyebrow-line" />
            Author access
          </p>

          <h1 id="login-heading">Welcome back.</h1>

          <p className="login-description">
            Sign in to manage your stories and published posts.
          </p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="login-username">Username or email</label>

            <div className="login-input-wrap">
              <Icon name="user" size={19} />

              <input
                id="login-username"
                type="text"
                autoComplete="username"
                placeholder="Enter your username or email"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="login-password">Password</label>

            <div className="login-input-wrap">
              <Icon name="lock" size={19} />

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={loading}
                required
              />

              <button
                className="login-password-toggle"
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                disabled={loading}
              >
                <Icon name={showPassword ? "eyeOff" : "eye"} size={19} />
              </button>
            </div>
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="login-submit"
            type="submit"
            disabled={loading}
          >
            <span>{loading ? "Signing in..." : "Sign in"}</span>
            {!loading && <Icon name="arrow" size={21} />}
            {loading && <span className="login-spinner" aria-hidden="true" />}
          </button>
        </form>

        <p className="login-note">
          Author access only. Please use your authorized account.
        </p>

        <div className="login-card-divider" />

        <button
          className="login-home-link"
          type="button"
          onClick={onBack}
        >
          <Icon name="back" size={16} />
          <span>Back to homepage</span>
        </button>
      </section>

      <p className="login-page-caption">
        PENSPACE <span>·</span> A CONSIDERED SPACE FOR THE WRITTEN WORD
      </p>
    </main>
  );
}

export default AuthorLogin;
