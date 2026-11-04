
import { useState, useEffect } from "react";
import "./AuthorDashboard.css";
import CreatePost from "./CreatePost";
import AuthorProfile from "./AuthorProfile";
import { getMyPosts, deletePost } from "../services/postService";
import { checkAuth, logoutAuthor } from "../services/authService";

const Icon = ({ name, size = 20 }) => {
  const paths = {
    posts: <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
    published: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 12 3 3 7-7"/></>,
    draft: <><path d="m14 6 4-4 4 4-4 4"/><path d="m18 10-9 9-5 1 1-5 9-9"/><path d="m14 6 4 4"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    edit: <><path d="m15 5 4 4M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15l0 5Z"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrowLeft: <><path d="M19 12H5m7 7-7-7 7-7"/></>,
    arrowRight: <><path d="M5 12h14m-7-7 7 7-7 7"/></>,
    chevron: <path d="m7 10 5 5 5-5"/>,
    close: <><path d="m18 6-12 12M6 6l12 12"/></>,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
};

function AuthorDashboard() {
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [posts, setPosts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPost, setEditingPost] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState("");
  const [notification, setNotification] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
  const savedTemplate = sessionStorage.getItem("penspace_selected_template");

  if (savedTemplate) {
    try {
      const template = JSON.parse(savedTemplate);

      setSelectedTemplate(template);
      setShowCreatePost(true);

      sessionStorage.removeItem("penspace_selected_template");
    } catch (error) {
      console.error("Failed to load selected template:", error);
      sessionStorage.removeItem("penspace_selected_template");
    }
  }
}, []);

  const postsPerPage = 5;

  const publishedCount = posts.filter(
    (post) => (post.status || "published") === "published"
  ).length;

  const draftCount = posts.filter(
    (post) => post.status === "draft"
  ).length;

  const filteredPosts = posts.filter((post) => {
    const matchesStatus =
      statusFilter === "all" ||
      (post.status || "published") === statusFilter;

    const matchesSearch = (post.title || "")
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
    return <div className="dashboard-loading">Checking login session...</div>;
  }

  if (showProfile) {
    return <AuthorProfile onBack={() => setShowProfile(false)} />;
  }

  if (postsLoading) {
    return <div className="dashboard-loading">Loading your posts...</div>;
  }

  if (postsError) {
    return (
      <div className="dashboard-error">
        <p>{postsError}</p>
        <button type="button" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (showCreatePost || editingPost) {
    return (
      <CreatePost
  initialPost={editingPost}
  selectedTemplate={selectedTemplate}
        onCancel={() => {
  setShowCreatePost(false);
  setEditingPost(null);
  setSelectedTemplate(null);
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

  async function handleLogout() {
    try {
      await logoutAuthor();
      window.location.href = "/";
    } catch (error) {
      alert(error.message || "Logout failed. Please try again.");
    }
  }

  async function handleDelete(post) {
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
  }

  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-GB");
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <a className="dashboard-brand" href="/">
          <span className="dashboard-brand-mark">P</span>
          <span>PenSpace<span className="brand-period">.</span></span>
        </a>

        <div className="dashboard-user">
          <span className="dashboard-avatar">A</span>
          <span className="dashboard-workspace-label">Author Workspace</span>

          <button
            type="button"
            className="dashboard-nav-button"
            onClick={() => setShowProfile(true)}
          >
            My Profile
          </button>

          <button
            type="button"
            className="dashboard-nav-button"
            onClick={handleLogout}
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
              <Icon name="close" size={17} />
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
            <Icon name="plus" size={19} />
            Create post
          </button>
        </div>

        <section className="dashboard-stats">
          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-green">
              <Icon name="posts" size={25} />
            </div>
            <div>
              <p>Total posts</p>
              <strong>{posts.length}</strong>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-green">
              <Icon name="published" size={25} />
            </div>
            <div>
              <p>Published</p>
              <strong>{publishedCount}</strong>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="dashboard-stat-icon stat-icon-gold">
              <Icon name="draft" size={25} />
            </div>
            <div>
              <p>Drafts</p>
              <strong>{draftCount}</strong>
            </div>
          </article>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div className="dashboard-panel-title">
              <h2>Your posts</h2>
              <p>Manage your published stories and drafts.</p>
            </div>

            <div className="dashboard-toolbar">
              <label className="dashboard-search">
                <Icon name="search" size={19} />
                <input
                  type="search"
                  placeholder="Search your posts..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  aria-label="Search posts by title"
                />
              </label>

              <label className="dashboard-select-wrap">
                <span className="sr-only">Sort posts</span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  aria-label="Sort posts"
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="title">Title A–Z</option>
                </select>
                <Icon name="chevron" size={16} />
              </label>

              <label className="dashboard-select-wrap">
                <span className="sr-only">Filter posts</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter posts by status"
                >
                  <option value="all">All posts</option>
                  <option value="draft">Drafts</option>
                  <option value="published">Published</option>
                </select>
                <Icon name="chevron" size={16} />
              </label>
            </div>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="dashboard-empty">
              <div className="dashboard-empty-icon">
                <Icon name="posts" size={27} />
              </div>

              <h3>
                {searchQuery
                  ? "No matching stories found."
                  : statusFilter === "draft"
                    ? "No drafts found."
                    : statusFilter === "published"
                      ? "No published posts found."
                      : "Your next story starts here."}
              </h3>

              <p>
                {searchQuery
                  ? "Try another search term."
                  : statusFilter === "all"
                    ? "Your posts will appear here when you start creating them."
                    : `There are no ${statusFilter} posts in this filter. Try another filter or create a new post.`}
              </p>

              <button
                className="dashboard-create-button"
                type="button"
                onClick={() => setShowCreatePost(true)}
              >
                <Icon name="plus" size={18} />
                Create your first post
              </button>
            </div>
          ) : (
            <>
              <ul className="dashboard-post-list">
                {paginatedPosts.map((post) => (
                  <li key={post.id} className="dashboard-post-item">
                    <div className="dashboard-post-info">
                      <h3>{post.title}</h3>

                      {post.excerpt && <p>{post.excerpt}</p>}

                      <div className="dashboard-post-dates">
                        <span>
                          <Icon name="calendar" size={14} />
                          Created {formatDate(post.created_at)}
                        </span>

                        {post.updated_at &&
                          post.updated_at !== post.created_at && (
                            <span>
                              <Icon name="calendar" size={14} />
                              Updated {formatDate(post.updated_at)}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="dashboard-post-status-wrap">
                      <span
                        className={`post-status post-status-${post.status || "published"}`}
                      >
                        <span className="status-dot" />
                        {post.status === "draft" ? "Draft" : "Published"}
                      </span>
                    </div>

                    <div className="dashboard-post-actions">
                      <button
                        type="button"
                        className="dashboard-edit-button"
                        onClick={() => setEditingPost(post)}
                      >
                        <Icon name="edit" size={16} />
                        Edit
                      </button>

                      <button
                        type="button"
                        className="dashboard-delete-button"
                        onClick={() => handleDelete(post)}
                      >
                        <Icon name="trash" size={16} />
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {totalPages > 1 && (
                <div className="dashboard-pagination">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) => Math.max(page - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <Icon name="arrowLeft" size={16} />
                    Previous
                  </button>

                  <span>
                    Page <strong>{currentPage}</strong> of {totalPages}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((page) =>
                        Math.min(page + 1, totalPages)
                      )
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <Icon name="arrowRight" size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
}

export default AuthorDashboard;
