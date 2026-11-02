
import { useMemo, useState } from "react";
import "./CreatePost.css";
import {
  createPost,
  updatePost,
  uploadCoverImage,
} from "../services/postService";
import RichTextEditor from "./RichTextEditor";
import { marked } from "marked";
import DOMPurify from "dompurify";

const STEPS = [
  { id: "details", number: "01", title: "Basic Details", subtitle: "Title, description, category & tags" },
  { id: "cover", number: "02", title: "Cover Image", subtitle: "Add or change cover image" },
  { id: "content", number: "03", title: "Content", subtitle: "Write and format your story" },
];

const CATEGORIES = [
  "Technology",
  "Education",
  "Lifestyle",
  "Health",
  "Business",
  "Travel",
  "Personal Growth",
];

function CreatePost({ onCancel, onPublish, initialPost = null }) {
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [coverImage, setCoverImage] = useState(null);
  const [category, setCategory] = useState(initialPost?.category ?? "");
  const [tags, setTags] = useState(
    Array.isArray(initialPost?.tags)
      ? initialPost.tags.join(", ")
      : ""
  );

  const [activeStep, setActiveStep] = useState("details");
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedTags = useMemo(
    () => tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    [tags]
  );

  const localCoverUrl = useMemo(
    () => (coverImage ? URL.createObjectURL(coverImage) : null),
    [coverImage]
  );

  const currentCover = localCoverUrl || initialPost?.cover_image || "";

  async function handleSubmit(event, selectedStatus = "published") {
    event?.preventDefault();
    setError("");

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError("Please complete the title, description and story content.");
      setActiveStep(!title.trim() || !excerpt.trim() ? "details" : "content");
      return;
    }

    if (title.trim().length > 200) {
      setError("Title cannot exceed 200 characters.");
      setActiveStep("details");
      return;
    }

    if (excerpt.trim().length > 500) {
      setError("Short description cannot exceed 500 characters.");
      setActiveStep("details");
      return;
    }

    if (content.trim().length < 10) {
      setError("Story content must be at least 10 characters.");
      setActiveStep("content");
      return;
    }

    setSaving(true);

    try {
      let uploadedCoverImage = initialPost?.cover_image ?? null;

      if (coverImage) {
        uploadedCoverImage = await uploadCoverImage(coverImage);
      }

      const postData = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        status: selectedStatus,
        cover_image: uploadedCoverImage,
        category,
        tags: selectedTags,
      };

      const result = initialPost
        ? await updatePost(initialPost.id, postData)
        : await createPost(postData);

      window.alert(
        selectedStatus === "draft"
          ? "Draft saved successfully!"
          : initialPost
            ? "Post updated successfully!"
            : "Post published successfully!"
      );

      onPublish?.(
        { ...postData, ...result.post },
        selectedStatus
      );
    } catch (submitError) {
      setError(
        submitError.message || "Failed to save your story."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleCoverChange(event) {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please choose a JPG, PNG or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Cover image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setError("");
    setCoverImage(file);
  }

  return (
    <main className="create-post-page">

      {/* HEADER */}
      <header className="create-post-header">
        <a
          className="create-post-brand"
          href="/"
          onClick={(event) => {
            event.preventDefault();
            onCancel?.();
          }}
        >
          <span className="create-post-brand-mark">P</span>
          <span>PenSpace</span>
        </a>

        <div className="create-post-header-right">
          <span className="create-post-avatar">A</span>
          <span className="create-post-workspace-label">
            Author Workspace
          </span>
          <button
            type="button"
            className="editor-header-button"
            onClick={onCancel}
          >
            Back to dashboard
          </button>
        </div>
      </header>

      <div className="create-post-shell">

        {/* PAGE INTRO */}
        <div className="create-post-intro">
          <button
            className="create-post-back"
            type="button"
            onClick={onCancel}
          >
            ← Back to Dashboard
          </button>

          <p className="create-post-eyebrow">
            AUTHOR WORKSPACE
          </p>

          <h1>
            {initialPost ? "Edit your story." : "Create a new story."}
          </h1>

          <p className="create-post-description">
            {initialPost
              ? "Update the details of your post and save the changes."
              : "Bring your ideas to life and share your story."}
          </p>

          <span className="create-post-title-rule" />
        </div>

        <form
          className="create-post-workspace"
          onSubmit={(event) => handleSubmit(event, "published")}
        >

          {/* SIDEBAR */}
          <aside className="create-post-sidebar">
            <p className="editor-sidebar-label">
              YOUR STORY
            </p>

            {STEPS.map((step) => (
              <button
                type="button"
                key={step.id}
                className={`editor-step ${
                  activeStep === step.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveStep(step.id);
                  setError("");
                }}
              >
                <span className="editor-step-icon">
                  {step.id === "details"
                    ? "✎"
                    : step.id === "cover"
                      ? "▧"
                      : "▤"}
                </span>

                <span className="editor-step-copy">
                  <strong>{step.title}</strong>
                  <small>{step.subtitle}</small>
                </span>

                <span className="editor-step-number">
                  {step.number}
                </span>
              </button>
            ))}

            <div className="editor-sidebar-tip">
              <span className="editor-tip-mark">✦</span>
              <strong>A note for writers</strong>
              <p>
                Good stories deserve thoughtful details.
                Take your time and make it yours.
              </p>
            </div>
          </aside>

          {/* MAIN PANEL */}
          <section className="create-post-panel">

            {/* BASIC DETAILS */}
            {activeStep === "details" && (
              <div className="editor-section">

                <div className="editor-section-heading">
                  <div>
                    <p className="editor-section-kicker">
                      STEP 01 / 03
                    </p>
                    <h2>Basic Details</h2>
                    <p>Start with the essentials of your story.</p>
                  </div>
                </div>

                <div className="create-post-field">
                  <label htmlFor="post-title">
                    Post Title <em>*</em>
                  </label>

                  <input
                    id="post-title"
                    type="text"
                    placeholder="Give your story a meaningful title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={200}
                    required
                  />

                  <small className="field-counter">
                    {title.length}/200 characters
                  </small>
                </div>

                <div className="create-post-field">
                  <label htmlFor="post-excerpt">
                    Short Description
                  </label>

                  <textarea
                    id="post-excerpt"
                    placeholder="Briefly introduce your story..."
                    value={excerpt}
                    onChange={(event) => setExcerpt(event.target.value)}
                    rows={3}
                    maxLength={500}
                    required
                  />

                  <small className="field-counter">
                    {excerpt.length}/500 characters
                  </small>
                </div>

                <div className="editor-two-column">

                  <div className="create-post-field">
                    <label htmlFor="post-category">
                      Category
                    </label>

                    <select
                      id="post-category"
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                    >
                      <option value="">Select a category</option>

                      {CATEGORIES.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="create-post-field">
                    <label htmlFor="post-tags">Tags</label>

                    <input
                      id="post-tags"
                      type="text"
                      placeholder="React, JavaScript, Web Development"
                      value={tags}
                      onChange={(event) => setTags(event.target.value)}
                    />

                    {selectedTags.length > 0 && (
                      <div className="editor-tag-preview">
                        {selectedTags.map((tag, index) => (
                          <span key={`${tag}-${index}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <small>
                      Separate multiple tags with commas.
                    </small>
                  </div>

                </div>
              </div>
            )}

            {/* COVER IMAGE */}
            {activeStep === "cover" && (
              <div className="editor-section">

                <div className="editor-section-heading">
                  <div>
                    <p className="editor-section-kicker">
                      STEP 02 / 03
                    </p>
                    <h2>Cover Image</h2>
                    <p>
                      Add a cover image for your story.
                      A good cover makes your post more engaging.
                    </p>
                  </div>
                </div>

                <label
                  className="cover-upload-zone"
                  htmlFor="cover-image"
                >
                  <span className="cover-upload-icon">↑</span>

                  <strong>
                    Drag &amp; drop an image here, or click to choose
                  </strong>

                  <span>
                    Supports JPG, PNG, WebP · Max size: 5 MB
                  </span>

                  <span className="cover-choose-button">
                    Choose File
                  </span>

                  <input
                    id="cover-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleCoverChange}
                  />
                </label>

                {currentCover ? (
                  <div className="current-cover-block">
                    <div className="current-cover-heading">
                      <h3>
                        {coverImage
                          ? "Selected Cover Image"
                          : "Current Cover Image"}
                      </h3>

                      {coverImage && (
                        <button
                          type="button"
                          onClick={() => setCoverImage(null)}
                        >
                          Remove selection
                        </button>
                      )}
                    </div>

                    <img
                      className="current-cover-image"
                      src={currentCover}
                      alt="Story cover preview"
                    />

                    {coverImage && (
                      <p className="cover-file-name">
                        {coverImage.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="cover-empty-state">
                    <span>▧</span>
                    <strong>No cover image selected</strong>
                    <p>
                      You can continue without a cover image.
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* STORY CONTENT */}
            {activeStep === "content" && (
              <div className="editor-section editor-content-section">

                <div className="editor-section-heading">
                  <div>
                    <p className="editor-section-kicker">
                      STEP 03 / 03
                    </p>
                    <h2>Story Content</h2>
                    <p>
                      Write and format your story.
                      Let your ideas take shape.
                    </p>
                  </div>
                </div>

                <div className="create-post-field editor-body-field">
                  <label>Your Story <em>*</em></label>

                  <RichTextEditor
                    value={content}
                    onChange={setContent}
                  />
                </div>

                <div className="editor-word-count">
                  <span>
                    Words:{" "}
                    <strong>
                      {content
                        .replace(/<[^>]*>/g, " ")
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean).length}
                    </strong>
                  </span>

                  <span>
                    Characters:{" "}
                    <strong>
                      {content.replace(/<[^>]*>/g, "").length}
                    </strong>
                  </span>
                </div>

                <button
                  type="button"
                  className="editor-preview-button"
                  onClick={() => setShowPreview((value) => !value)}
                >
                  <span>◎</span>
                  {showPreview ? "Hide Post Preview" : "Preview Post"}
                </button>

                {showPreview && (
                  <article className="post-preview">

                    {currentCover && (
                      <img src={currentCover} alt="Story cover" />
                    )}

                    <p className="post-preview-category">
                      {category || "YOUR STORY"}
                    </p>

                    <h2>{title || "Untitled Post"}</h2>
                    <p className="post-preview-excerpt">{excerpt}</p>

                    <div
                      className="post-preview-content"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(
                          marked.parse(content || "", { async: false })
                        ),
                      }}
                    />
                  </article>
                )}

              </div>
            )}

            {error && (
              <p className="editor-error" role="alert">
                {error}
              </p>
            )}

            {/* FOOTER ACTIONS */}
            <div className="create-post-footer">

              <div className="editor-footer-left">
                {activeStep !== "details" && (
                  <button
                    type="button"
                    className="editor-button editor-button-quiet"
                    onClick={() =>
                      setActiveStep(
                        activeStep === "content" ? "cover" : "details"
                      )
                    }
                  >
                    ← Previous
                  </button>
                )}
              </div>

              <div className="create-post-actions">

                {activeStep !== "content" ? (
                  <button
                    type="button"
                    className="editor-button editor-button-primary"
                    onClick={() =>
                      setActiveStep(
                        activeStep === "details" ? "cover" : "content"
                      )
                    }
                  >
                    Continue →
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="editor-button editor-button-quiet"
                      onClick={onCancel}
                      disabled={saving}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="editor-button editor-button-outline"
                      onClick={() => handleSubmit(null, "draft")}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save as Draft"}
                    </button>

                    <button
                      type="submit"
                      className="editor-button editor-button-primary"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : initialPost
                          ? "Update Post"
                          : "Publish Post"} →
                    </button>
                  </>
                )}

              </div>
            </div>

          </section>
        </form>
      </div>
    </main>
  );
}

export default CreatePost;
