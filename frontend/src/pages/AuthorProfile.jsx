
import { useEffect, useState } from "react";
import "./AuthorProfile.css";
import { checkAuth } from "../services/authService";
import { updateAuthorProfile } from "../services/authService";
import { changeAuthorPassword } from "../services/authService";


function AuthorProfile({ onBack }) {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordSaving, setPasswordSaving] = useState(false);
const [passwordError, setPasswordError] = useState("");
const [passwordSuccess, setPasswordSuccess] = useState("");





const handleProfileUpdate = async (event) => {
  event.preventDefault();
  setError("");
  setSuccess("");

  if (!username.trim() || !email.trim()) {
    setError("Username and email are required.");
    return;
  }

  setSaving(true);

  try {
    await updateAuthorProfile(username.trim(), email.trim());

    setAuthor((current) => ({
      ...current,
      username: username.trim(),
      email: email.trim(),
    }));

    setSuccess("Profile updated successfully.");
  } catch (err) {
    setError(err.message || "Unable to update profile.");
  } finally {
    setSaving(false);
  }
};


const handlePasswordChange = async (event) => {
  event.preventDefault();
  setPasswordError("");
  setPasswordSuccess("");

  if (!currentPassword || !newPassword || !confirmPassword) {
    setPasswordError("Please fill in all password fields.");
    return;
  }

  if (newPassword.length < 8) {
    setPasswordError("New password must be at least 8 characters long.");
    return;
  }

  if (newPassword !== confirmPassword) {
    setPasswordError("New passwords do not match.");
    return;
  }

  setPasswordSaving(true);

  try {
    const result = await changeAuthorPassword(
      currentPassword,
      newPassword
    );

    setPasswordSuccess(result.message);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  } catch (err) {
    setPasswordError(
      err.message || "Unable to change password."
    );
  } finally {
    setPasswordSaving(false);
  }
};



  useEffect(() => {
    let active = true;

    checkAuth()
      .then((data) => {
        if (!active) return;

        if (!data) {
          window.location.href = "/";
          return;
        }

        setAuthor(data);
        setUsername(data.username || "");
        setEmail(data.email || "");
      })
      .catch(() => {
        if (active) {
          setError("Unable to load your profile. Please try again.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p className="profile-message">Loading profile...</p>;
  }

  

  if (!author) return null;

  return (
    <main className="author-profile-page">
      <header className="profile-header">
        <a className="profile-brand" href="/">
          Pen<span>Space</span>.
        </a>

        <button type="button" onClick={onBack}>
          ← Back to dashboard
        </button>
      </header>

      <section className="profile-card">
        <div className="profile-avatar" aria-hidden="true">
          {(author.username || "A").charAt(0).toUpperCase()}
        </div>

        <p className="profile-eyebrow">AUTHOR WORKSPACE</p>
        <h1>My Profile</h1>
        <p className="profile-description">
          View your PenSpace account information.
        </p>

        <div className="profile-detail">
          <span>Username</span>
          <strong>{author.username}</strong>
        </div>

        <div className="profile-detail">
          <span>Email address</span>
          <strong>{author.email}</strong>
        </div>

        <div className="profile-detail">
          <span>Author ID</span>
          <strong>{author.id}</strong>
        </div>



<form className="profile-edit-form" onSubmit={handleProfileUpdate}>
  <h2>Edit Profile</h2>

  <label htmlFor="profile-username">Username</label>
  <input
    id="profile-username"
    type="text"
    value={username}
    onChange={(event) => setUsername(event.target.value)}
    maxLength={50}
    required
  />

  <label htmlFor="profile-email">Email address</label>
  <input
    id="profile-email"
    type="email"
    value={email}
    onChange={(event) => setEmail(event.target.value)}
    maxLength={150}
    required
  />

  {error && <p role="alert">{error}</p>}
  {success && <p role="status">{success}</p>}

  <button type="submit" disabled={saving}>
    {saving ? "Saving..." : "Save Changes"}
  </button>
</form>


<form
  className="profile-edit-form password-change-form"
  onSubmit={handlePasswordChange}
>
  <h2>Change Password</h2>

  <label htmlFor="current-password">Current Password</label>
  <input
    id="current-password"
    type="password"
    value={currentPassword}
    onChange={(event) => setCurrentPassword(event.target.value)}
    autoComplete="current-password"
    required
  />

  <label htmlFor="new-password">New Password</label>
  <input
    id="new-password"
    type="password"
    value={newPassword}
    onChange={(event) => setNewPassword(event.target.value)}
    minLength={8}
    autoComplete="new-password"
    required
  />

  <label htmlFor="confirm-password">Confirm New Password</label>
  <input
    id="confirm-password"
    type="password"
    value={confirmPassword}
    onChange={(event) => setConfirmPassword(event.target.value)}
    minLength={8}
    autoComplete="new-password"
    required
  />

  {passwordError && (
    <p role="alert">{passwordError}</p>
  )}

  {passwordSuccess && (
    <p role="status">{passwordSuccess}</p>
  )}

  <button type="submit" disabled={passwordSaving}>
    {passwordSaving ? "Updating..." : "Change Password"}
  </button>
</form>








        <button
          className="profile-back-button"
          type="button"
          onClick={onBack}
        >
          Return to dashboard
        </button>
      </section>
    </main>
  );
}

export default AuthorProfile;
