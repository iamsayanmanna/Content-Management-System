import { useState } from "react";
import "./AuthorRegister.css";
import { registerAuthor } from "../services/authService";
import registerStilllife from "../assets/penspace-register-stilllife.png.jpeg";

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
  };

  const paths = {
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="m3 3 18 18" /><path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4-.8" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    back: <><path d="m15 18-6-6 6-6" /><path d="M9 12h12" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
};

function AuthorRegister({ onBack, onRegisterSuccess }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^[A-Za-z0-9_]{3,50}$/.test(username.trim())) {
      setError("Use 3–50 letters, numbers, or underscores for your username.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      await registerAuthor(username.trim(), email.trim(), password);
      onRegisterSuccess();
    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <section className="register-brand-panel" aria-label="PenSpace introduction">
        <div className="register-brand">
          <a
            href="/"
            className="register-brand-logo"
            aria-label="PenSpace home"
            onClick={(event) => {
              event.preventDefault();
              onBack?.();
            }}
          >
            <span className="register-brand-mark">P</span>
            <span>Pen<span>Space</span></span>
          </a>

          <span className="register-brand-rule" />

          <p className="register-brand-tagline">
            A considered space
            <br />
            for the written word.
          </p>
        </div>

        <div className="register-stilllife" aria-hidden="true">
          <img
  src={registerStilllife}
  alt=""
/>
        </div>

        <div className="register-handwriting" aria-hidden="true">
          <span>Write</span>
          <span>Create</span>
          <span>Publish</span>
          <span>Grow</span>
        </div>

        <div className="register-brand-bottom">
          <span />
          <p>
            Stories today.
            <br />
            A brighter tomorrow.
          </p>
        </div>
      </section>

      <section className="register-form-panel">
        <div className="register-card">
          <button
            className="register-back"
            type="button"
            onClick={onBack}
          >
            <Icon name="back" size={17} />
            <span>Back</span>
          </button>

          <p className="register-eyebrow">PenSpace author account</p>

          <h1>
            Create your
            <br />
            account
          </h1>

          <p className="register-description">
            Join PenSpace and start sharing your ideas.
          </p>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-field">
              <label htmlFor="register-username">Username</label>
              <div className="register-input-wrap">
                <Icon name="user" />
                <input
                  id="register-username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  minLength={3}
                  maxLength={50}
                  pattern="[A-Za-z0-9_]+"
                  title="Use 3–50 letters, numbers, or underscores."
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="register-email">Email</label>
              <div className="register-input-wrap">
                <Icon name="mail" />
                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="register-password">Password</label>
              <div className="register-input-wrap">
                <Icon name="lock" />
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
                <button
                  className="register-password-toggle"
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <Icon name={showPassword ? "eyeOff" : "eye"} size={19} />
                </button>
              </div>
            </div>

            <div className="register-field">
              <label htmlFor="confirm-password">Confirm password</label>
              <div className="register-input-wrap">
                <Icon name="lock" />
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={8}
                  autoComplete="new-password"
                  required
                />
                <button
                  className="register-password-toggle"
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <Icon
                    name={showConfirmPassword ? "eyeOff" : "eye"}
                    size={19}
                  />
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="register-error">
                {error}
              </p>
            )}

            <button
              className="register-submit"
              type="submit"
              disabled={loading}
            >
              <span>{loading ? "Creating account..." : "Create account"}</span>
              {!loading && <Icon name="arrow" size={22} />}
            </button>
          </form>

          <p className="register-card-note">
            A considered space for the written word.
          </p>
        </div>
      </section>
    </main>
  );
}

export default AuthorRegister;