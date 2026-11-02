
import { useState, useEffect } from "react";
import "./App.css";
import { Helmet } from "react-helmet-async";
import AuthorLogin from "./pages/AuthorLogin";
import AuthorRegister from "./pages/AuthorRegister";
import AuthorDashboard from "./pages/AuthorDashboard";
import { getPosts } from "./services/postService";
import DOMPurify from "dompurify";


function getCoverImageSrc(article) {
  const rawPath = article?.cover_image || article?.coverImage || article?.featured_image || "";
  const path = String(rawPath).trim();
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  // Cover images are stored by the backend as relative paths. Keep absolute
  // paths absolute and normalize relative uploads paths from the site root.
  return `/${path.replace(/^\.\//, "").replace(/^\/+/, "")}`;
}

function getPublishedDate(value) {
  if (!value) return "";
  const normalized = String(value).includes("T")
    ? String(value)
    : String(value).replace(" ", "T");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getReadingMinutes(article) {
  const text = `${article?.title || ""} ${article?.excerpt || ""} ${article?.content || ""}`
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .trim();
  const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function App() {

const [articles, setArticles] = useState([]);
const [searchQuery, setSearchQuery] = useState("");
const [currentPage, setCurrentPage] = useState(1);

// Public journal cards must never expose drafts or private posts.
const publishedArticles = articles.filter(
  (article) => String(article?.status || "").trim().toLowerCase() === "published"
);

const filteredArticles = publishedArticles.filter((article) => {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return true;

  return (
    (article.title || "").toLowerCase().includes(query) ||
    (article.excerpt || "").toLowerCase().includes(query) ||
    (article.category || "").toLowerCase().includes(query) ||
    (Array.isArray(article.tags) &&
      article.tags.some((tag) => String(tag).toLowerCase().includes(query)))
  );
});



const articlesPerPage = 6;

const totalPages = Math.ceil(
  filteredArticles.length / articlesPerPage
);

const startIndex = (currentPage - 1) * articlesPerPage;

const currentArticles = filteredArticles.slice(
  startIndex,
  startIndex + articlesPerPage
);





const [selectedArticle, setSelectedArticle] = useState(null);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get("article");

  if (!articleId) return;

  const matchingArticle = articles.find(
    (article) =>
      String(article.id) === articleId &&
      String(article?.status || "").trim().toLowerCase() === "published"
  );

  if (matchingArticle) {
    setSelectedArticle(matchingArticle);
  }
}, [articles]);

const relatedArticles = selectedArticle
  ? articles
      .filter((article) => article.id !== selectedArticle.id)
      .map((article) => {
        const currentWords = selectedArticle.title
          .toLowerCase()
          .split(/\W+/)
          .filter((word) => word.length > 3);

        const relatedWords = article.title
          .toLowerCase()
          .split(/\W+/)
          .filter((word) => word.length > 3);

        const score = currentWords.filter((word) =>
          relatedWords.includes(word)
        ).length;

        return { ...article, relevanceScore: score };
      })
      .filter((article) => article.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 3)
  : [];
 

useEffect(() => {
  getPosts()
    .then((posts) => {
      setArticles(posts);
    })
    .catch((error) => {
      console.error("Failed to load homepage articles:", error);
    });
}, []);

  





  const [showLogin, setShowLogin] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

if (showLogin) {
  return (
    <AuthorLogin
      onBack={() => setShowLogin(false)}
      onLoginSuccess={() => {
        setShowLogin(false);
        setShowDashboard(true);
      }}
    />
  );
}


if (showRegister) {
  return (
    <AuthorRegister
      onBack={() => setShowRegister(false)}
      onRegisterSuccess={() => {
        setShowRegister(false);
        setShowLogin(true);
      }}
    />
  );
}


if (showDashboard) {
  return <AuthorDashboard />;
}


if (selectedArticle) {
  return (
    <main className="article-reading-page">

      
<Helmet>
  <title>{selectedArticle.title} | PenSpace</title>
  <meta
    name="description"
    content={
      selectedArticle.excerpt ||
      `Read ${selectedArticle.title} on PenSpace.`
    }
  />
  <meta property="og:title" content={selectedArticle.title} />
  <meta
    property="og:description"
    content={
      selectedArticle.excerpt ||
      `Read ${selectedArticle.title} on PenSpace.`
    }
  />
  <meta property="og:type" content="article" />
</Helmet>


      <header className="topbar">
        <a className="brand" href="#home" onClick={(event) => {
          event.preventDefault();
          setSelectedArticle(null);
        }}>
          <span className="brand-mark">P</span>
          <span>Pen<span className="brand-light">Space</span></span>
        </a>

        <button
          className="secondary-button"
          type="button"
          onClick={() => setSelectedArticle(null)}
        >
          ← Back to articles
        </button>
      </header>

      <article className="article-reading-content">
        <p className="eyebrow">THE JOURNAL</p>
        
{selectedArticle.category && (
  <p className="article-category">
    {selectedArticle.category}
  </p>
)}



{Array.isArray(selectedArticle.tags) && selectedArticle.tags.length > 0 && (
  <div className="article-tags">
    {selectedArticle.tags.map((tag) => (
      <span className="article-tag" key={tag}>
        #{tag}
      </span>
    ))}
  </div>
)}





        <div className="article-meta">
  <span>By {selectedArticle.author_name || "PenSpace Author"}</span>
  <span>
    {selectedArticle.created_at
      ? new Date(
          selectedArticle.created_at.replace(" ", "T")
        ).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : ""}
  </span>
</div>
        <h1>{selectedArticle.title}</h1>
        <p className="article-reading-excerpt">
          {selectedArticle.excerpt}
        </p>

        
<div className="article-share">
  <span>Share this story</span>

  <button
    className="secondary-button"
    type="button"
    onClick={async () => {
  const shareUrl = `${window.location.origin}/?article=${selectedArticle.id}`;

  try {
    await navigator.clipboard.writeText(shareUrl);
    alert("Article link copied successfully!");
  } catch (error) {
    console.error("Failed to copy article link:", error);
    alert("Could not copy the link. Please try again.");
  }
}}
  >
    Copy link
  </button>
</div>


        <div
  className="article-reading-body"
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(selectedArticle.content || ""),
  }}
/>


{relatedArticles.length > 0 && (
  <section className="related-articles">
    <p className="eyebrow">KEEP EXPLORING</p>
    <h2>Related stories</h2>

    <div className="related-articles-grid">
      {relatedArticles.map((article) => (
        <article className="related-article-card" key={article.id}>
          <h3>{article.title}</h3>
          <p>{article.excerpt}</p>
          <button
            className="secondary-button"
            type="button"
            onClick={() => setSelectedArticle(article)}
          >
            Read story →
          </button>
        </article>
      ))}
    </div>
  </section>
)}






      </article>
    </main>
  );
}


    
return (
  <>
    <Helmet>
      <title>PenSpace | Stories Worth Spending Time With</title>
      <meta
        name="description"
        content="Discover thoughtful writing, fresh perspectives, and meaningful stories on PenSpace."
      />
      <meta
        property="og:title"
        content="PenSpace | Stories Worth Spending Time With"
      />
      <meta
        property="og:description"
        content="Discover thoughtful writing, fresh perspectives, and meaningful stories on PenSpace."
      />
      <meta property="og:type" content="website" />
    </Helmet>


    <div className="cms-app">
     
<header className="topbar">
  <a className="brand" href="#home" aria-label="PenSpace home">
    <span className="brand-mark">P</span>
    <span>
      Pen<span className="brand-light">Space</span>
    </span>
  </a>

  <nav className="top-nav" aria-label="Main navigation">
    <a className="nav-active" href="#home">Home</a>
    <a href="#features">Features</a>
    <a href="#templates">Templates</a>
    <a href="#pricing">Pricing</a>
    <a className="nav-resource" href="#resources">
      Resources <span aria-hidden="true">⌄</span>
    </a>
  </nav>

  <div className="author-auth-actions">
    <button
      className="header-search"
      type="button"
      aria-label="Search articles"
      onClick={() => {
        document.getElementById("articles")?.scrollIntoView({
          behavior: "smooth",
        });
        document.querySelector(".article-search input")?.focus();
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="21"
        height="21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="10.8" cy="10.8" r="6.8" />
        <path d="m16 16 4.2 4.2" />
      </svg>
    </button>

    <button
      className="author-link"
      type="button"
      onClick={() => setShowLogin(true)}
    >
      Author Login <span aria-hidden="true">↗</span>
    </button>

    <button
      className="header-cta"
      type="button"
      onClick={() => setShowRegister(true)}
    >
      Get Started <span aria-hidden="true">+</span>
    </button>
  </div>
</header>



      <main>

      







      
<section className="hero-section" id="home">
  
<div className="hero-content">
  <p className="eyebrow hero-eyebrow">
    <span className="status-dot" />
    A SPACE FOR IDEAS
  </p>

  <h1>
    Stories worth
    <br />
    <span>spending time with.</span>
  </h1>

  <p className="hero-description">
    PenSpace is a modern, elegant blogging platform and CMS — built for
    creators, writers, and teams who believe in the power of great content.
  </p>

  <div className="hero-actions">
    <button
      className="primary-button hero-primary-button"
      type="button"
      onClick={() => setShowRegister(true)}
    >
      Start Writing Free <span aria-hidden="true">→</span>
    </button>

    <button
      className="hero-secondary-button"
      type="button"
      onClick={() => {
        document.getElementById("articles")?.scrollIntoView({
          behavior: "smooth",
        });
      }}
    >
      <span className="hero-play-icon" aria-hidden="true">▶</span>
      See How It Works
    </button>
  </div>

  <div className="hero-features">
    <div className="hero-feature">
      <span className="hero-feature-icon" aria-hidden="true">✎</span>
      <span className="hero-feature-copy">
        <strong>Write</strong>
        <small>Distraction-free editor</small>
      </span>
    </div>

    <div className="hero-feature">
      <span className="hero-feature-icon" aria-hidden="true">▦</span>
      <span className="hero-feature-copy">
        <strong>Customize</strong>
        <small>Beautiful, flexible themes</small>
      </span>
    </div>

    <div className="hero-feature">
      <span className="hero-feature-icon" aria-hidden="true">♧</span>
      <span className="hero-feature-copy">
        <strong>Grow</strong>
        <small>Built for creators &amp; teams</small>
      </span>
    </div>
  </div>

  <div className="hero-note">
    <span className="note-line" />
    INDEPENDENT THOUGHT. MEANINGFUL STORIES.
  </div>
</div>


  
<div className="hero-visual" aria-label="PenSpace content editor preview">
  <div className="hero-visual-backdrop" />

  <div className="hero-editor-art">
    <div className="hero-editor-photo">
      <span>Thoughtful living</span>
    </div>

    <div className="hero-editor-window">
      <div className="editor-topbar">
        <div className="editor-window-dots">
          <span />
          <span />
          <span />
        </div>
        <span className="editor-label">PENSPACE EDITOR</span>
        <span className="editor-status">● READY</span>
      </div>

      <div className="hero-writing-workspace">
        <aside className="hero-writing-sidebar">
          <div className="hero-writing-brand">
            <span className="brand-mark">P</span>
            <strong>PenSpace</strong>
          </div>
          <div className="hero-writing-menu">
            <span>⌂ <small>Dashboard</small></span>
            <span className="selected">▤ <small>Posts</small></span>
            <span>▧ <small>Media</small></span>
            <span>▱ <small>Pages</small></span>
            <span>▢ <small>Comments</small></span>
            <span>⚙ <small>Settings</small></span>
          </div>
        </aside>

        <div className="hero-writing-main">
          <div className="hero-writing-toolbar">
            <span>Paragraph⌄</span>
            <strong>B</strong>
            <i>I</i>
            <span>☷</span>
            <span>↗</span>
            <button type="button" onClick={() => setShowRegister(true)}>
              Publish⌄
            </button>
          </div>

          <div className="hero-writing-body">
            <h3>The Beauty of<br />Slower Living</h3>
            <div className="hero-writing-cover">
              <span />
              <i />
            </div>
            <p>
              In a world that moves too fast, finding moments of stillness
              can be a quiet rebellion. This is a space to share thoughts,
              ideas, and stories that matter.
            </p>
            <div className="hero-writing-lines">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <aside className="hero-publish-panel">
          <strong>Publish settings</strong>
          <span>Status</span>
          <div className="publish-field">Draft⌄</div>
          <span>Category</span>
          <div className="publish-field">Lifestyle⌄</div>
          <span>Tags</span>
          <div className="publish-tag">mindfulness ×</div>
          <div className="publish-tag">slow living ×</div>
          <span>Featured image</span>
          <div className="publish-image" />
        </aside>
      </div>
    </div>
  </div>

  <div className="hero-feature-float hero-editor-float">
    <span className="hero-float-icon">ϟ</span>
    <span>
      <strong>Clean &amp; Powerful Editor</strong>
      <small>Write, format, and publish with ease.</small>
    </span>
  </div>

  <div className="hero-feature-float hero-growth-float">
    <span className="hero-float-icon">▥</span>
    <span>
      <strong>Grow Your Audience</strong>
      <small>Built-in SEO, analytics, and more.</small>
    </span>
  </div>

  <div className="hero-handwriting" aria-hidden="true">
    Write<br />Create<br />Publish<br />Grow
  </div>
</div>

</section>


        <section className="articles-section" id="articles">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE JOURNAL</p>
              <h2>Ideas to explore.</h2>
            </div>
            <span className="article-count">OUR EDITORIAL SPACE</span>
          </div>

          
<div className="article-search">
  <input
    type="search"
    placeholder="Search articles, categories or tags..."
    value={searchQuery}
    onChange={(event) => {
  setSearchQuery(event.target.value);
  setCurrentPage(1);
}}
    aria-label="Search articles"
  />
</div>


          

{publishedArticles.length === 0 ? (
  <div className="empty-state">
    <div className="empty-icon" aria-hidden="true">✳</div>
    <h3>Every great story starts somewhere.</h3>
    <p>No published articles yet. Published stories will appear here when an author publishes them.</p>
  </div>
) : filteredArticles.length === 0 ? (
  <div className="empty-state">
    <h3>No matching articles found.</h3>
    <p>Try another title, category, or tag.</p>
  </div>
) : (
  <div className="articles-grid">
    {currentArticles.map((article) => {
      const coverImage = getCoverImageSrc(article);
      const publishedDate = getPublishedDate(article.created_at || article.published_at);
      const readingMinutes = getReadingMinutes(article);
      const category = String(article.category || "").trim();

      return (
        <article
          className={`article-card${coverImage ? " has-cover-image" : " no-cover-image"}`}
          key={article.id}
        >
          <div className="article-card-copy">
            <div className="article-card-kicker">
              <span className="article-status-dot" aria-hidden="true" />
              <p className="eyebrow">PUBLISHED STORY</p>
            </div>

            {category && <span className="article-card-category">{category}</span>}

            <h3>{article.title}</h3>
            {article.excerpt && <p className="article-card-excerpt">{article.excerpt}</p>}

            <div className="article-card-footer">
              <button
                className="primary-button article-read-button"
                type="button"
                onClick={() => {
                  setSelectedArticle(article);
                  window.history.pushState({}, "", `?article=${article.id}`);
                }}
              >
                Read story <span aria-hidden="true">→</span>
              </button>

              <div className="article-card-meta">
                {publishedDate && <time dateTime={article.created_at || article.published_at}>{publishedDate}</time>}
                {publishedDate && <span aria-hidden="true">·</span>}
                <span>{readingMinutes} min read</span>
              </div>
            </div>
          </div>

          {coverImage && (
            <div className="article-card-media">
              <img
                src={coverImage}
                alt={`Cover image for ${article.title || "published story"}`}
                loading="lazy"
                onError={(event) => {
                  const card = event.currentTarget.closest(".article-card");
                  card?.classList.remove("has-cover-image");
                  card?.classList.add("no-cover-image");
                  event.currentTarget.parentElement?.remove();
                }}
              />
            </div>
          )}
        </article>
      );
    })}
  </div>
)}


{totalPages > 1 && (
  <div className="pagination">
    <button
      className="secondary-button"
      type="button"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((page) => page - 1)}
    >
      ← Previous
    </button>

    <span>
      Page {currentPage} of {totalPages}
    </span>

    <button
      className="secondary-button"
      type="button"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((page) => page + 1)}
    >
      Next →
    </button>
  </div>
)}


        </section>

        <section className="author-banner" id="author">
          <div>
            <p className="eyebrow">BEHIND THE STORIES</p>
            <h2>Your ideas. Your words. Your space.</h2>
            <p>
              A dedicated workspace for authors to create and manage
              their published writing.
            </p>
          </div>
          <button
  className="secondary-button"
  type="button"
  onClick={() => {
  setShowLogin(false);
  setShowDashboard(true);
}}
>
  Author workspace <span aria-hidden="true">→</span>
</button>
        </section>
      </main>

      <footer className="site-footer" id="about">
        <a className="brand footer-brand" href="#home">
          <span className="brand-mark">P</span>
          <span>Pen<span className="brand-light">Space</span></span>
        </a>
        <p>A considered space for the written word.</p>
        <span>CMS PROJECT · 2026</span>
      </footer>
        </div>
  </>
  )
}

export default App
