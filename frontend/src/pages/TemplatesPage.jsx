import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./TemplatesPage.css";

const templates = [
  {
    id: 1,
    name: "Minimal Writer",
    category: "Blog",
    style: "Minimal",
    description: "A clean and focused layout for writers.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900",
  },
  {
    id: 2,
    name: "The Journal",
    category: "Magazine",
    style: "Editorial",
    description: "A classic magazine-style template for long reads.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900",
  },
  {
    id: 3,
    name: "Midnight Notes",
    category: "Blog",
    style: "Dark",
    description: "A bold, dark theme for creative storytellers.",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900",
  },
  {
    id: 4,
    name: "Nature Tales",
    category: "Blog",
    style: "Nature",
    description: "A calm, nature-inspired template for blogs.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900",
  },
  {
    id: 5,
    name: "Creative Space",
    category: "Portfolio",
    style: "Creative",
    description: "A modern and creative layout for diverse content.",
    image:
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900",
  },
  {
    id: 6,
    name: "The Newsletter",
    category: "Newsletter",
    style: "Clean",
    description: "A clean template for newsletters and updates.",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=900",
  },
];

const categories = [
  "All Templates",
  "Blog",
  "Magazine",
  "Portfolio",
  "Newsletter",
  "Creative",
];

function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All Templates");
  const [sortBy, setSortBy] = useState("Popular");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [modalType, setModalType] = useState("");
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [notifySubmitted, setNotifySubmitted] = useState(false);

  const filteredTemplates = useMemo(() => {
    let result = [...templates];

    if (activeCategory !== "All Templates") {
      result = result.filter(
        (template) => template.category === activeCategory
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      result = result.filter(
        (template) =>
          template.name.toLowerCase().includes(query) ||
          template.category.toLowerCase().includes(query) ||
          template.style.toLowerCase().includes(query)
      );
    }

    if (sortBy === "A to Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Z to A") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  const openModal = (template, type) => {
    setSelectedTemplate(template);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedTemplate(null);
    setModalType("");
  };

    const handleUseTemplate = () => {
    if (!selectedTemplate) return;

    sessionStorage.setItem(
      "penspace_selected_template",
      JSON.stringify(selectedTemplate)
    );

    window.location.href = "/?useTemplate=1";
  };

  const handleNotify = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setNotifySubmitted(true);
  };

  return (
    <main className="templates-page">
      {/* NAVBAR */}
      <header className="templates-navbar">
        <Link to="/" className="templates-logo">
          <span className="templates-logo-mark">P</span>
          <span>PenSpace</span>
        </Link>

        <nav className="templates-nav-links">
          <Link to="/">Home</Link>
          <Link to="/features">Features</Link>
          <Link to="/templates" className="active">
            Templates
          </Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/resources">Resources⌄</Link>
        </nav>

        <div className="templates-nav-actions">
          <button
            className="templates-search-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Toggle search"
          >
            ⌕
          </button>

          <Link to="/" className="templates-login">
            Author Login ↗
          </Link>

          <Link to="/" className="templates-nav-cta">
            Get Started <span>＋</span>
          </Link>
        </div>
      </header>

      {/* SEARCH BAR */}
      {searchOpen && (
        <div className="templates-search-panel">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button onClick={() => setSearchOpen(false)}>Close</button>
        </div>
      )}

      {/* HERO */}
      <section className="templates-hero">
        <div className="templates-hero-content">
          <span className="templates-badge">
            <i></i> TEMPLATES
          </span>

          <h1>
            Beautiful templates
            <br />
            <span>for every story.</span>
          </h1>

          <p>
            Choose from a collection of thoughtfully designed templates
            and start publishing in minutes.
          </p>

          <div className="templates-hero-buttons">
            <a href="#template-gallery" className="templates-primary-btn">
              Use a Template <span>→</span>
            </a>

            <a href="#template-gallery" className="templates-secondary-btn">
              <span className="templates-play-icon">▶</span>
              See Examples
            </a>
          </div>
        </div>

        <div className="templates-hero-visual">
          <div className="templates-hero-backdrop"></div>

          <div className="hero-template hero-template-left">
            <small>The Journal</small>
            <h3>Stories & Ideas</h3>
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600"
              alt="Journal template preview"
            />
          </div>

          <div className="hero-template hero-template-center">
            <div className="hero-template-top">
              <strong>Minimal Writer</strong>
              <span>Home　 About　 Posts</span>
            </div>

            <h2>A Space for Thoughtful Stories</h2>

            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700"
              alt="Minimal Writer template"
            />
          </div>

          <div className="hero-template hero-template-right">
            <small>Midnight Notes</small>
            <h3>Stories After Dark</h3>
            <span>Write your next story.</span>
          </div>

          <span className="templates-decoration">〽</span>
        </div>
      </section>

      {/* TEMPLATE GALLERY */}
      <section className="templates-gallery" id="template-gallery">
        <div className="templates-toolbar">
          <div className="templates-categories">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  activeCategory === category ? "category-active" : ""
                }
                onClick={() => setActiveCategory(category)}
              >
                {category === "All Templates" && <span>▦</span>}
                {category === "Blog" && <span>▤</span>}
                {category === "Magazine" && <span>◫</span>}
                {category === "Portfolio" && <span>✉</span>}
                {category === "Newsletter" && <span>◇</span>}
                {category === "Creative" && <span>✎</span>}
                {category}
              </button>
            ))}
          </div>

          <div className="templates-sort">
            <label htmlFor="template-sort">Sort by:</label>

            <select
              id="template-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Popular">Popular</option>
              <option value="A to Z">A to Z</option>
              <option value="Z to A">Z to A</option>
            </select>
          </div>
        </div>

        <div className="templates-grid">
          {filteredTemplates.length > 0 ? (
            filteredTemplates.map((template) => (
              <article className="template-card" key={template.id}>
                <div className="template-card-image">
                  <img src={template.image} alt={template.name} />
                </div>

                <h3>{template.name}</h3>

                <p>{template.description}</p>

                <div className="template-tags">
                  <span>{template.category}</span>
                  <span>{template.style}</span>
                </div>

                <div className="template-card-actions">
                  <button
                    className="template-preview-btn"
                    onClick={() => openModal(template, "preview")}
                  >
                    ◉ Preview
                  </button>

                  <button
                    className="template-use-btn"
                    onClick={() => openModal(template, "use")}
                  >
                    Use Template <span>→</span>
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="templates-empty">
              <h3>No templates found</h3>
              <p>Try another category or search term.</p>
              <button
                onClick={() => {
                  setActiveCategory("All Templates");
                  setSearchQuery("");
                }}
              >
                Show All Templates
              </button>
            </div>
          )}
        </div>
      </section>

      {/* NOTIFICATION CTA */}
      <section className="templates-notify">
        <div className="templates-notify-icon">▱</div>

        <div className="templates-notify-content">
          <h2>Can’t find the right fit?</h2>
          <p>
            More templates are coming soon. Stay tuned for new designs.
          </p>
        </div>

        <button
          className="templates-notify-btn"
          onClick={() => {
            setNotifyOpen(true);
            setNotifySubmitted(false);
          }}
        >
          ♧ Get Notified
        </button>
      </section>

      {/* FOOTER */}
      <footer className="templates-footer">
        <Link to="/" className="templates-logo">
          <span className="templates-logo-mark">P</span>
          <span>PenSpace</span>
        </Link>

        <p>© 2026 PenSpace. Made for creators.</p>
      </footer>

      {/* TEMPLATE PREVIEW / USE MODAL */}
      {selectedTemplate && (
        <div className="templates-modal-overlay" onClick={closeModal}>
          <div
            className="templates-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="templates-modal-close"
              onClick={closeModal}
              aria-label="Close"
            >
              ×
            </button>

            <img
              src={selectedTemplate.image}
              alt={selectedTemplate.name}
            />

            <span className="templates-modal-tag">
              {selectedTemplate.category} · {selectedTemplate.style}
            </span>

            <h2>{selectedTemplate.name}</h2>
            <p>{selectedTemplate.description}</p>

            {modalType === "preview" ? (
              <div className="templates-modal-note">
                Template preview
              </div>
            ) : (
              <div className="templates-modal-note">
                You've selected this template. Sign in to continue.
              </div>
            )}

            {modalType === "use" ? (
  <button
    className="templates-primary-btn"
    onClick={handleUseTemplate}
  >
    Continue to PenSpace →
  </button>
) : (
  <button
    className="templates-primary-btn"
    onClick={closeModal}
  >
    Back to Templates
  </button>
)}
          </div>
        </div>
      )}

      {/* NOTIFICATION MODAL */}
      {notifyOpen && (
        <div
          className="templates-modal-overlay"
          onClick={() => setNotifyOpen(false)}
        >
          <div
            className="templates-notify-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="templates-modal-close"
              onClick={() => setNotifyOpen(false)}
              aria-label="Close"
            >
              ×
            </button>

            {notifySubmitted ? (
              <>
                <h2>Thank you!</h2>
                <p>
                  Your email has been entered. Notification signup will be
                  connected to the backend in a later step.
                </p>
                <button
                  className="templates-primary-btn"
                  onClick={() => setNotifyOpen(false)}
                >
                  Close
                </button>
              </>
            ) : (
              <>
                <h2>Stay in the loop.</h2>
                <p>
                  Enter your email to express interest in upcoming templates.
                </p>

                <form onSubmit={handleNotify}>
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <button type="submit" className="templates-primary-btn">
                    Notify Me →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default TemplatesPage;