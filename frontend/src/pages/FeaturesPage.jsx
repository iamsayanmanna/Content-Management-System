
import React from "react";
import { Link } from "react-router-dom";
import "./FeaturesPage.css";

const features = [
  {
    icon: "✎",
    title: "Distraction-Free Writing",
    description: "A clean, focused editor to help you write and create without limits.",
  },
  {
    icon: "▦",
    title: "Beautiful Themes",
    description: "Elegant, responsive themes that make your stories look stunning.",
  },
  {
    icon: "▱",
    title: "Content Organization",
    description: "Keep your posts, categories, and tags well-structured and easy to manage.",
  },
  {
    icon: "ϟ",
    title: "Publish with Confidence",
    description: "Draft, preview, and publish your stories in just a few clicks.",
  },
  {
    icon: "▥",
    title: "Grow Your Audience",
    description: "Built-in SEO, clean URLs, and sharing tools to reach more readers.",
  },
  {
    icon: "♧",
    title: "Built for Everyone",
    description: "Perfect for individual writers, creators, and content teams.",
  },
];

function FeaturesPage() {
  return (
    <div className="features-page">
      <header className="features-navbar">
        <Link to="/" className="features-logo">
          <span className="features-logo-mark">P</span>
          <span>PenSpace</span>
        </Link>

        <nav className="features-nav-links">
          <Link to="/">Home</Link>
          <Link to="/features" className="active">Features</Link>
          <Link to="/templates">Templates</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/resources">Resources <span>▼</span></Link>
        </nav>

        <div className="features-nav-actions">
          <Link
  to="/"
  state={{ openLogin: true }}
  className="features-login"
>
  Author Login ↗
</Link>
          <Link
  to="/"
  state={{ openRegister: true }}
  className="features-nav-cta"
>
  Get Started <span>+</span>
</Link>
        </div>
      </header>

      <main>
        <section className="features-hero">
          <div className="features-hero-content">
            <span className="features-badge">
              <i /> FEATURES
            </span>

            <h1>
              Everything you need
              <br />
              <span>to publish great stories.</span>
            </h1>

            <p>
              Powerful, simple, and beautifully designed tools for writers,
              creators, and teams.
            </p>

            <div className="features-hero-buttons">
              <Link
  to="/"
  state={{ openRegister: true }}
  className="features-primary-btn"
>
  Get Started Free <span>→</span>
</Link>

              <Link to="/templates" className="features-secondary-btn">
                <span>▦</span> Explore Templates
              </Link>
            </div>
          </div>

          <div className="features-hero-visual">
            <div className="editor-backdrop" />

            <div className="features-editor-window">
              <div className="features-editor-header">
                <div className="features-editor-brand">
                  <span>P</span> PenSpace
                </div>
                <button type="button">Publish</button>
              </div>

              <div className="features-editor-toolbar">
                <div className="features-editor-sidebar">
                  <span>⌂</span>
                  <span className="selected">▤</span>
                  <span>▧</span>
                  <span>▥</span>
                  <span>⚙</span>
                </div>

                <div className="features-editor-main">
                  <div className="features-editor-tools">
                    <span>Paragraph⌄</span>
                    <strong>B</strong>
                    <i>I</i>
                    <u>U</u>
                    <span>↗</span>
                    <span>···</span>
                  </div>

                  <div className="features-editor-writing">
                    <h2>A Better<br />Writing Experience</h2>
                    <span className="editor-cursor" />
                  </div>
                </div>
              </div>
            </div>

            <span className="editor-decoration">〃</span>
          </div>
        </section>

        <section className="platform-features" id="platform-features">
          <div className="platform-heading">
            <span>PLATFORM FEATURES</span>
            <h2>Powerful features for modern creators.</h2>
            <p>Write, customize, publish, and grow — all in one place.</p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="features-final-cta">
          <div>
            <h2>Ready to start writing?</h2>
            <p>
              Join PenSpace today and experience a better way to create,
              publish, and grow your ideas.
            </p>
          </div>
<Link
  to="/"
  state={{ openRegister: true }}
  className="features-primary-btn"
>
  Create Your Account <span>→</span>
</Link>
        </section>
      </main>

      <footer className="features-footer">
        <Link to="/" className="features-logo">
          <span>Pen</span>Space
        </Link>
        <p>© 2026 PenSpace. Made for creators.</p>
      </footer>
    </div>
  );
}

export default FeaturesPage;
