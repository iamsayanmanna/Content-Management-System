
import { useState } from "react";
import "./CreatePost.css";
import { createPost, updatePost } from "../services/postService";
import RichTextEditor from "./RichTextEditor";
import { uploadCoverImage } from "../services/postService";
import { marked } from "marked";
import DOMPurify from "dompurify";


function CreatePost({ onCancel, onPublish, initialPost = null }) {
  const [title, setTitle] = useState(initialPost?.title ?? "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt ?? "");
  const [content, setContent] = useState(initialPost?.content ?? "");
  const [coverImage, setCoverImage] = useState(null);
  
const [status, setStatus] = useState(initialPost?.status ?? "published");
const [category, setCategory] = useState(initialPost?.category ?? "");
const [tags, setTags] = useState(
  Array.isArray(initialPost?.tags)
    ? initialPost.tags.join(", ")
    : ""
);
const [showPreview, setShowPreview] = useState(false);

  


async function handleSubmit(event, selectedStatus = "published") {
  event?.preventDefault();

  if (!title.trim() || !excerpt.trim() || !content.trim()) {
    alert("Please fill in all fields.");
    return;
  }

  if (title.trim().length > 200) {
    alert("Title cannot exceed 200 characters.");
    return;
  }

  if (excerpt.trim().length > 500) {
    alert("Short description cannot exceed 500 characters.");
    return;
  }

  if (content.trim().length < 10) {
    alert("Story content must be at least 10 characters long.");
    return;
  }

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
  category: category,
  tags: tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean),
};


    let result;

    if (initialPost) {
      result = await updatePost(initialPost.id, postData);
    } else {
      result = await createPost(postData);
    }

    alert(
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
  } catch (error) {
    alert(error.message || "Failed to save post or upload cover image.");
  }
}





  return (
    <main className="create-post-page">
      <header className="create-post-header">
        <a className="create-post-brand" href="/">
          Pen<span>Space</span>.
        </a>

        <button
          className="create-post-cancel"
          type="button"
          onClick={onCancel}
        >
          ← Back to dashboard
        </button>
      </header>

      <section className="create-post-content">
        <p className="create-post-eyebrow">AUTHOR WORKSPACE</p>
        <h1>Create a new story.</h1>
        <p className="create-post-description">
          Share your ideas with the PenSpace community.
        </p>

        <form className="create-post-form" onSubmit={handleSubmit}>
          <div className="create-post-field">
            <label htmlFor="post-title">Post title</label>
            <input
              id="post-title"
              type="text"
              placeholder="Give your story a meaningful title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
              required
            />
          </div>

          <div className="create-post-field">
            <label htmlFor="post-excerpt">Short description</label>
            <textarea
              id="post-excerpt"
              placeholder="Briefly introduce your story..."
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              rows={3}
              maxLength={500}
              required
            />
          </div>


          
<div className="create-post-field">
  <label htmlFor="post-category">Category</label>
  <select
    id="post-category"
    value={category}
    onChange={(event) => setCategory(event.target.value)}
  >
    <option value="">Select a category</option>
    <option value="Technology">Technology</option>
    <option value="Education">Education</option>
    <option value="Lifestyle">Lifestyle</option>
    <option value="Health">Health</option>
    <option value="Business">Business</option>
    <option value="Travel">Travel</option>
    <option value="Personal Growth">Personal Growth</option>
  </select>
</div>



<div className="create-post-field">
  <label htmlFor="post-tags">Tags</label>
  <input
    id="post-tags"
    type="text"
    placeholder="e.g. React, JavaScript, Web Development"
    value={tags}
    onChange={(event) => setTags(event.target.value)}
  />
  <small>Separate multiple tags with commas.</small>
</div>


        
<div className="create-post-field">
  <label htmlFor="cover-image">Cover image</label>

  <input
    id="cover-image"
    type="file"
    accept="image/*"
    onChange={(event) => {
      const file = event.target.files?.[0] || null;
      setCoverImage(file);
    }}
  />

  {coverImage && (
    <div className="cover-image-preview">
      <img
        src={URL.createObjectURL(coverImage)}
        alt="Selected cover preview"
        style={{
          width: "100%",
          maxWidth: "400px",
          height: "auto",
          marginTop: "12px",
          borderRadius: "8px",
        }}
      />
      <p>{coverImage.name}</p>
    </div>
  )}
</div>


          <div className="create-post-field">
            <label htmlFor="post-content">Story content</label>
            <RichTextEditor
  value={content}
  onChange={setContent}
/>
          </div>



<div className="create-post-field">
  <button
    type="button"
    className="create-post-secondary"
    onClick={() => setShowPreview(!showPreview)}
  >
    {showPreview ? "Hide Preview" : "Preview Post"}
  </button>

  {showPreview && (
    <div className="post-preview">
      <h2>{title || "Untitled Post"}</h2>

      {coverImage && (
        <img
          src={URL.createObjectURL(coverImage)}
          alt="Cover preview"
          style={{ width: "100%", maxWidth: "600px", height: "auto" }}
        />
      )}

      <p>{excerpt}</p>

      <div
        className="post-preview-content"
        dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(
    marked.parse(content || "", { async: false })
  ),
}}
      />
    </div>
  )}
</div>



         
<div className="create-post-actions">
  <button
    className="create-post-secondary"
    type="button"
    onClick={onCancel}
  >
    Cancel
  </button>

 
<button
  className="create-post-secondary"
  type="button"
  onClick={() => handleSubmit(null, "draft")}
>
  Save as Draft
</button>


 
<button
  className="create-post-submit"
  type="submit"
>
  Publish post <span aria-hidden="true">→</span>
</button>

</div>


          
        </form>
      </section>
    </main>
  );
}

export default CreatePost;
