
import { useState, useEffect } from "react";
import "./AuthorDashboard.css";
import CreatePost from "./CreatePost";
import AuthorProfile from "./AuthorProfile";
import { getMyPosts, deletePost } from "../services/postService";

import { checkAuth, logoutAuthor } from "../services/authService";

function AuthorDashboard() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [posts, setPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
const postsPerPage = 5;
  const filteredPosts = posts.filter((post) => {
  const matchesStatus =
    statusFilter === "all" ||
    (post.status || "published") === statusFilter;

  const matchesSearch =
    (post.title || "")
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

  return matchesStatus && matchesSearch;
});


  const sortedPosts = [...filteredPosts].sort((a, b) => {
  if (sortOrder === "title") {
    return (a.title || "").localeCompare(b.title || "");
  }

  const dateA = new Date(a.created_at || 0).getTime();
  const dateB = new Date(b.created_at || 0).getTime();

  return sortOrder === "oldest"
    ? dateA - dateB
    : dateB - dateA;
});

  const totalPages = Math.ceil(sortedPosts.length / postsPerPage);

const startIndex = (currentPage - 1) * postsPerPage;

const paginatedPosts = sortedPosts.slice(
  startIndex,
  startIndex + postsPerPage
);

useEffect(() => {
  setCurrentPage(1);
}, [statusFilter, searchQuery, sortOrder]);

  const [editingPost, setEditingPost] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");
  const [notification, setNotification] = useState({
  type: "",
  message: "",
});

  
useEffect(() => {
  checkAuth()
    .then((author) => {
      if (!author) {
        window.location.href = "/";
        return;
      }

      setAuthChecking(false);
    })
    .catch((error) => {
      console.error("Authentication check failed:", error);
      window.location.href = "/";
    });
}, []);


  

useEffect(() => {
  if (authChecking) return;

  setPostsLoading(true);
  setPostsError("");

  getMyPosts()
    .then((data) => {
      setPosts(data);
    })
    .catch((error) => {
      console.error("Failed to load dashboard posts:", error);
      setPostsError("Unable to load your posts. Please try again.");
    })
    .finally(() => {
      setPostsLoading(false);
    });
}, [authChecking]);


  
if (authChecking) {
  return <p>Checking login session...</p>;
}


if (showProfile) {
  return (
    <AuthorProfile
      onBack={() => setShowProfile(false)}
    />
  );
}



if (postsLoading) {
  return <p>Loading your posts...</p>;
}

if (postsError) {
  return (
    <div className="dashboard-error">
      <p>{postsError}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );
}





  if (showCreatePost || editingPost) {
    return (
      <CreatePost
      initialPost={editingPost}
        onCancel={() => {
  setShowCreatePost(false);
  setEditingPost(null);
}}
       


onPublish={(post, selectedStatus) => {
  setPosts((currentPosts) => {
    const updatedPost = {
      ...post,
      status: selectedStatus,
    };

    const exists = currentPosts.some(
      (item) => item.id === updatedPost.id
    );

    if (exists) {
      return currentPosts.map((item) =>
        item.id === updatedPost.id
          ? { ...item, ...updatedPost }
          : item
      );
    }

    return [updatedPost, ...currentPosts];
  });

  setEditingPost(null);
  setShowCreatePost(false);
}}



      />
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <a className="dashboard-brand" href="/">
          Pen<span>Space</span>.
        </a>

        
<div className="dashboard-user">
  <span className="dashboard-avatar">A</span>
  <span>Author Workspace</span>

  <button
  type="button"
  onClick={() => setShowProfile(true)}
>
  My Profile
</button>

  <button
    type="button"
    onClick={async () => {
      try {
        await logoutAuthor();
        window.location.href = "/";
      } catch (error) {
        alert(error.message || "Logout failed. Please try again.");
      }
    }}
  >
    Logout
  </button>
</div>

      </header>

      <section className="dashboard-content">
        
{notification.message && (
  <div
    className={`dashboard-notification dashboard-notification-${notification.type}`}
    role={notification.type === "error" ? "alert" : "status"}
  >
    <span>{notification.message}</span>
    <button
      type="button"
      onClick={() =>
        setNotification({ type: "", message: "" })
      }
      aria-label="Dismiss notification"
    >
      ×
    </button>
  </div>
)}

        <div className="dashboard-heading">
          <div>
            <p className="dashboard-eyebrow">YOUR WORKSPACE</p>
            <h1>Author Dashboard</h1>
            <p className="dashboard-description">
              Create and manage your stories in one place.
            </p>
          </div>

          <button
            className="dashboard-create-button"
            type="button"
            onClick={() => setShowCreatePost(true)}
          >
            <span aria-hidden="true">+</span> Create post
          </button>
        </div>

        <section className="dashboard-panel">

          <div className="dashboard-search">
  <input
    type="search"
    placeholder="Search posts by title..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    aria-label="Search posts by title"
  />
</div>

<div className="dashboard-sort">
  <label htmlFor="post-sort">Sort by:</label>

  <select
    id="post-sort"
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
  >
    <option value="newest">Newest first</option>
    <option value="oldest">Oldest first</option>
    <option value="title">Title A–Z</option>
  </select>
</div>

          <div className="dashboard-panel-heading">
  <h2>Your posts</h2>

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    aria-label="Filter posts by status"
  >
    <option value="all">All posts</option>
    <option value="draft">Drafts</option>
    <option value="published">Published</option>
  </select>

  <span>
    {filteredPosts.length}{" "}
    {filteredPosts.length === 1 ? "post" : "posts"}
  </span>
</div>

          {filteredPosts.length === 0 ? (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon" aria-hidden="true">
                ✳
              </div>
              <h3>
  {statusFilter === "draft"
    ? "No drafts found."
    : statusFilter === "published"
      ? "No published posts found."
      : "Your next story starts here."}
</h3>

<p>
  {statusFilter === "all"
    ? "Your posts will appear here when you start creating them."
    : `There are no ${
        statusFilter === "draft" ? "drafts" : "published posts"
      } in this filter. Try another filter or create a new post.`}
</p>
              <button
                className="dashboard-empty-button"
                type="button"
                onClick={() => setShowCreatePost(true)}
              >
                Create your first post
              </button>
            </div>
          ) : (
            
<ul className="dashboard-post-list">
  {paginatedPosts.map((post) => (
    <li key={post.id} className="dashboard-post-item">
      
<div className="dashboard-post-info">
  <h3>{post.title}</h3>
  <p>{post.excerpt}</p>


  <div className="dashboard-post-dates">
  <p>
    Created:{" "}
    {post.created_at
      ? new Date(post.created_at).toLocaleDateString()
      : "Date unavailable"}
  </p>

  {post.updated_at && post.updated_at !== post.created_at && (
    <p>
      Updated: {new Date(post.updated_at).toLocaleDateString()}
    </p>
  )}
</div>

  <span className={`post-status post-status-${post.status || "published"}`}>
    {post.status === "draft" ? "Draft" : "Published"}
  </span>
</div>


      <div className="dashboard-post-actions">
        <button
          type="button"
          className="dashboard-edit-button"
          onClick={() => {
  setEditingPost(post);
  setShowCreatePost(true);
}}
        >
          Edit
        </button>

        <button
          type="button"
          className="dashboard-delete-button"
          
onClick={async () => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${post.title}"?`
  );

  if (!confirmed) return;


try {
  await deletePost(post.id);

  setPosts((currentPosts) =>
    currentPosts.filter((item) => item.id !== post.id)
  );

  setNotification({
    type: "success",
    message: "Post deleted successfully!",
  });
} catch (error) {
  setNotification({
    type: "error",
    message: error.message || "Failed to delete post.",
  });
}

}}

        >
          Delete
        </button>
      </div>
    </li>
  ))}
</ul>

          )}

                  {totalPages > 1 && (
          <div className="dashboard-pagination">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.max(page - 1, 1))
              }
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        </section>
      </section>
    </main>
  );
}

export default AuthorDashboard;
