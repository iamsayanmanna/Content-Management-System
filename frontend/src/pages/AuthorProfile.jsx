
import { useEffect, useRef, useState } from "react";
import "./AuthorProfile.css";
import {
  checkAuth,
  updateAuthorProfile,
  changeAuthorPassword,
  uploadAuthorProfileImage,
} from "../services/authService";

const API_BASE_URL = "http://localhost/Content-Management-System/backend";

function AuthorProfile({ onBack }) {
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [bio, setBio] = useState("");
const [website, setWebsite] = useState("");
const [instagram, setInstagram] = useState("");
const [linkedin, setLinkedin] = useState("");
const [github, setGithub] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageSuccess, setImageSuccess] = useState("");
  const fileInputRef = useRef(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

        setBio(data.bio || "");
setWebsite(data.website || "");
setInstagram(data.instagram || "");
setLinkedin(data.linkedin || "");
setGithub(data.github || "");
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

  const getProfileImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

    return `${API_BASE_URL}/${imagePath.replace(/^\/+/, "")}`;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageError("");
    setImageSuccess("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setImageError("Only JPG, PNG and WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    setImageUploading(true);

    try {
      const result = await uploadAuthorProfileImage(file);

      setAuthor((current) => ({
        ...current,
        profile_image: result.profile_image,
      }));

      setImageSuccess("Profile photo updated successfully.");
    } catch (err) {
      setImageError(err.message || "Unable to upload profile photo.");
    } finally {
      setImageUploading(false);
      event.target.value = "";
    }
  };

  
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
    await updateAuthorProfile(
      username.trim(),
      email.trim(),
      bio.trim(),
      website.trim(),
      instagram.trim(),
      linkedin.trim(),
      github.trim()
    );

    setAuthor((current) => ({
      ...current,
      username: username.trim(),
      email: email.trim(),
      bio: bio.trim(),
      website: website.trim(),
      instagram: instagram.trim(),
      linkedin: linkedin.trim(),
      github: github.trim(),
    }));

    setSuccess("Profile updated successfully.");

    // Automatically hide success message after 3 seconds
    setTimeout(() => {
      setSuccess("");
    }, 3000);

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

      setPasswordSuccess(
        result.message || "Password changed successfully."
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(err.message || "Unable to change password.");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="author-profile-page">
        <p className="profile-message">Loading profile...</p>
      </main>
    );
  }

  if (!author) return null;

  const avatarLetter = (author.username || "A")
    .charAt(0)
    .toUpperCase();

  const profileImageUrl = getProfileImageUrl(author.profile_image);

  return (
    <main className="author-profile-page">
      <header className="profile-topbar">
        <a
          className="profile-brand"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            onBack?.();
          }}
        >
          <span className="profile-brand-mark">P</span>
          <span>PenSpace</span>
        </a>

        <div className="profile-header-actions">
          <div className="profile-header-avatar">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" />
            ) : (
              avatarLetter
            )}
          </div>

          <span className="profile-workspace-label">
            Author Workspace
          </span>

          <button
            type="button"
            className="profile-nav-button active"
            onClick={() => setActiveTab("profile")}
          >
            My Profile
          </button>

          <button
            type="button"
            className="profile-nav-button"
            onClick={onBack}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="profile-container">
        <button
          className="profile-back-link"
          type="button"
          onClick={onBack}
        >
          <span>←</span> Back to Dashboard
        </button>

        <section className="profile-heading">
          <p className="profile-eyebrow">AUTHOR WORKSPACE</p>
          <h1>My Profile</h1>
          <p>View and update your PenSpace account information.</p>
          <span className="profile-heading-line" />
        </section>

        <section className="profile-layout">
          <aside className="profile-sidebar-card">
            <div className="profile-cover-area">
              <div className="profile-large-avatar">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Author profile" />
                ) : (
                  avatarLetter
                )}
              </div>

              <button
                className="profile-camera-button"
                type="button"
                aria-label="Upload profile photo"
                title="Change profile photo"
                onClick={() => fileInputRef.current?.click()}
                disabled={imageUploading}
              >
                {imageUploading ? (
                  <span>...</span>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 4H10L8 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4z" />
                    <circle cx="12" cy="13" r="3" />
                  </svg>
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                hidden
              />
            </div>

            <div className="profile-sidebar-info">

              <span className="profile-author-id">
  Author ID: {author.author_id || "Not assigned"}
</span>

  <h2>{author.username}</h2>
  <p>{author.email}</p>

  {author.bio && (
    <p className="profile-sidebar-bio">
      {author.bio}
    </p>
  )}

  <div className="profile-sidebar-socials">
    {author.website && (
      <a href={author.website} target="_blank" rel="noreferrer">
        Website
      </a>
    )}

    {author.instagram && (
      <a href={author.instagram} target="_blank" rel="noreferrer">
        Instagram
      </a>
    )}

    {author.linkedin && (
      <a href={author.linkedin} target="_blank" rel="noreferrer">
        LinkedIn
      </a>
    )}

    {author.github && (
      <a href={author.github} target="_blank" rel="noreferrer">
        GitHub
      </a>
    )}
  </div>



  {imageError && (
    <p className="profile-feedback error">{imageError}</p>
  )}

  {imageSuccess && (
    <p className="profile-feedback success">{imageSuccess}</p>
  )}
</div>
          </aside>

          <section className="profile-settings-card">
            <div className="profile-tabs">
              <button
                type="button"
                className={`profile-tab ${
                  activeTab === "profile" ? "selected" : ""
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="23"
                  height="23"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="7" r="4" />
                  <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                </svg>
                Profile Information
              </button>

              <button
                type="button"
                className={`profile-tab ${
                  activeTab === "password" ? "selected" : ""
                }`}
                onClick={() => setActiveTab("password")}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="23"
                  height="23"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="4" y="10" width="16" height="12" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  <path d="M12 14v4" />
                </svg>
                Change Password
              </button>
            </div>

            {activeTab === "profile" && (
              <div className="profile-tab-content">
                <div className="profile-form-heading">
                  <h2>Edit Profile</h2>
                  <p>Update your username and email address.</p>
                </div>

                
<form
  className="profile-modern-form"
  onSubmit={handleProfileUpdate}
>
  {/* USERNAME */}
  <div className="profile-form-row">
    <label htmlFor="profile-username">Username</label>
    <input
      id="profile-username"
      type="text"
      value={username}
      onChange={(event) => setUsername(event.target.value)}
      maxLength={50}
      required
    />
  </div>

  {/* EMAIL */}
  <div className="profile-form-row">
    <label htmlFor="profile-email">Email address</label>
    <input
      id="profile-email"
      type="email"
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      maxLength={150}
      required
    />
  </div>

  {/* BIO */}
  <div className="profile-form-row">
    <label htmlFor="profile-bio">About Me / Bio</label>
    <textarea
      id="profile-bio"
      value={bio}
      onChange={(event) => setBio(event.target.value)}
      placeholder="Write something about yourself..."
      maxLength={1000}
      rows={4}
    />
    <small>{bio.length}/1000 characters</small>
  </div>

  {/* SOCIAL MEDIA */}
  <div className="profile-form-heading">
    <h2>Social Media Links</h2>
    <p>Connect your social profiles and personal website.</p>
  </div>

  <div className="profile-form-row">
    <label htmlFor="profile-website">Personal Website</label>
    <input
      id="profile-website"
      type="url"
      value={website}
      onChange={(event) => setWebsite(event.target.value)}
      placeholder="https://yourwebsite.com"
    />
  </div>

  <div className="profile-form-row">
    <label htmlFor="profile-instagram">Instagram</label>
    <input
      id="profile-instagram"
      type="url"
      value={instagram}
      onChange={(event) => setInstagram(event.target.value)}
      placeholder="https://instagram.com/username"
    />
  </div>

  <div className="profile-form-row">
    <label htmlFor="profile-linkedin">LinkedIn</label>
    <input
      id="profile-linkedin"
      type="url"
      value={linkedin}
      onChange={(event) => setLinkedin(event.target.value)}
      placeholder="https://linkedin.com/in/username"
    />
  </div>

  <div className="profile-form-row">
    <label htmlFor="profile-github">GitHub</label>
    <input
      id="profile-github"
      type="url"
      value={github}
      onChange={(event) => setGithub(event.target.value)}
      placeholder="https://github.com/username"
    />
  </div>

  {error && (
    <p className="profile-feedback error" role="alert">
      {error}
    </p>
  )}

  {success && (
    <p className="profile-feedback success" role="status">
      {success}
    </p>
  )}

  <button
    className="profile-submit-button"
    type="submit"
    disabled={saving}
  >
    {saving ? "Saving..." : "Save Changes"}
  </button>
</form>

              </div>
            )}

            {activeTab === "password" && (
              <div className="profile-tab-content">
                <div className="profile-form-heading">
                  <h2>Change Password</h2>
                  <p>
                    Update your password to keep your account secure.
                  </p>
                </div>

                <form
                  className="profile-modern-form"
                  onSubmit={handlePasswordChange}
                >
                  <div className="profile-form-row">
                    <label htmlFor="current-password">
                      Current Password
                    </label>
                    <div className="profile-password-input">
                      <input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(event) =>
                          setCurrentPassword(event.target.value)
                        }
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="profile-form-row">
                    <label htmlFor="new-password">New Password</label>
                    <div className="profile-password-input">
                      <input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(event) =>
                          setNewPassword(event.target.value)
                        }
                        minLength={8}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword(!showNewPassword)
                        }
                      >
                        {showNewPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="profile-form-row">
                    <label htmlFor="confirm-password">
                      Confirm New Password
                    </label>
                    <div className="profile-password-input">
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                        minLength={8}
                        autoComplete="new-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  {passwordError && (
                    <p className="profile-feedback error" role="alert">
                      {passwordError}
                    </p>
                  )}

                  {passwordSuccess && (
                    <p className="profile-feedback success" role="status">
                      {passwordSuccess}
                    </p>
                  )}

                  <button
                    className="profile-submit-button"
                    type="submit"
                    disabled={passwordSaving}
                  >
                    {passwordSaving ? "Updating..." : "Change Password"}
                  </button>
                </form>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

export default AuthorProfile;
