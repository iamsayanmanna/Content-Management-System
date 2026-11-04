
import React, { useState } from "react";
import "./ResourcesPage.css";
import resourcesHero from "../assets/resources-hero.png";

const categories = [
  { name: "All Resources", icon: "▦" },
  { name: "Guides", icon: "▤" },
  { name: "Tutorials", icon: "▷" },
  { name: "Writing Tips", icon: "♧" },
  { name: "SEO & Growth", icon: "▥" },
  { name: "Product Updates", icon: "⚑" },
];

const resources = [
  {
    id: 1,
    category: "Guides",
    title: "Getting Started with PenSpace",
    description:
      "A complete beginner's guide to create, customize, and publish your first story.",
    date: "Mar 28, 2026",
    read: "7 min read",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
  },
  {
    id: 2,
    category: "Writing Tips",
    title: "10 Writing Tips for Engaging Stories",
    description:
      "Simple, practical tips to make your writing more engaging and reader-friendly.",
    date: "Mar 24, 2026",
    read: "5 min read",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800",
  },
  {
    id: 3,
    category: "SEO & Growth",
    title: "Grow Your Readership with SEO",
    description:
      "Learn how to optimize your stories for search and reach more readers.",
    date: "Mar 20, 2026",
    read: "6 min read",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
  },
];

const moreResources = [
  {
    id: 4,
    category: "Tutorials",
    title: "PenSpace Editor: A Complete Walkthrough",
    description: "Master the editor and write like a pro.",
    meta: "Tutorial",
    read: "8 min",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400",
  },
  {
    id: 5,
    category: "Guides",
    title: "Customizing Your Blog with Templates",
    description: "Learn how to personalize and brand your blog.",
    meta: "Guide",
    read: "5 min",
    image:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
  },
  {
    id: 6,
    category: "Writing Tips",
    title: "Content Planning for Consistent Publishing",
    description: "Build a simple content plan and stay consistent.",
    meta: "Writing Tips",
    read: "6 min",
    image:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=400",
  },
];

function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("All Resources");
const [email, setEmail] = useState("");
const [subscribeMessage, setSubscribeMessage] = useState("");
const [isSubscribing, setIsSubscribing] = useState(false);
const [subscribeStatus, setSubscribeStatus] = useState("");

  const filteredResources =
    activeCategory === "All Resources"
      ? resources
      : resources.filter(
          (item) => item.category === activeCategory
        );

  const filteredMore =
    activeCategory === "All Resources"
      ? moreResources
      : moreResources.filter(
          (item) => item.category === activeCategory
        );

 

const handleSubscribe = async (e) => {
  e.preventDefault();

  if (!email.trim() || isSubscribing) return;

  setIsSubscribing(true);
  setSubscribeMessage("");

  try {
    const response = await fetch(
      "http://localhost/Content-Management-System/backend/api/newsletter.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Subscription failed.");
    }

    setSubscribeMessage(data.message);
    setSubscribeStatus("success");
    
    setEmail("");
  } catch (error) {
    setSubscribeMessage(
      error.message || "Unable to subscribe. Please try again."
    );
    setSubscribeStatus("error");
  } finally {
    setIsSubscribing(false);
  }
};


  return (
    <main className="resources-page">
      {/* Navbar */}
      <header className="resources-navbar">
        <a href="/" className="resources-brand">
          <span className="resources-brand-mark">P</span>
          <span>Pen<span>Space</span></span>
        </a>

        <nav className="resources-nav">
          <a href="/">Home</a>
          <a href="/features">Features</a>
          <a href="/templates">Templates</a>
          <a href="/pricing">Pricing</a>
          <a href="/resources" className="active">Resources⌄</a>
        </nav>

        <div className="resources-nav-actions">
          <a href="/?login=1" className="resources-login">
            Author Login ↗
          </a>
          <a href="/?register=1" className="resources-cta">
            Get Started <span>+</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="resources-hero">
        <div className="resources-hero-content">
          <span className="resources-label">
            <span></span> RESOURCES
          </span>

          <h1>
            Learn. Create. Publish.
            <span>Grow on PenSpace.</span>
          </h1>

          <p>
            Guides, tutorials, tips, and best practices to help you
            make the most of PenSpace.
          </p>

          <div className="resources-hero-buttons">
            <a href="#featured-resources" className="resources-primary-btn">
              Browse All Resources <span>→</span>
            </a>

            <a href="#more-resources" className="resources-secondary-btn">
              <span className="play-icon">▶</span>
              Watch Tutorials
            </a>
          </div>
        </div>

        <div className="resources-hero-image">
          <img src={resourcesHero} alt="PenSpace writing guides and books" />
        </div>
      </section>

      {/* Categories */}
      <section className="resources-categories">
        {categories.map((category) => (
          <button
            key={category.name}
            className={
              activeCategory === category.name ? "category-active" : ""
            }
            onClick={() => setActiveCategory(category.name)}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </section>

      {/* Featured Resources */}
      <section className="resources-section" id="featured-resources">
        <div className="resources-section-heading">
          <h2>Featured Resources</h2>
          <a href="#more-resources">View All <span>→</span></a>
        </div>

        <div className="featured-resources-grid">
          {filteredResources.map((item) => (
            <article className="featured-resource-card" key={item.id}>
              <div className="featured-resource-image">
                <img src={item.image} alt={item.title} />
                <span>{item.category.toUpperCase()}</span>
              </div>

              <div className="featured-resource-content">
                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <div className="resource-meta">
                  <span>▦ &nbsp;{item.date}</span>
                  <span>•</span>
                  <span>{item.read}</span>
                  <a href="#more-resources" aria-label={`Read ${item.title}`}>
                    →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <p className="resources-empty">
            No featured resources in this category yet.
          </p>
        )}
      </section>

      {/* More Resources + Newsletter */}
      <section className="more-resources-section" id="more-resources">
        <div className="more-resources-list">
          <h2>More Resources</h2>

          {filteredMore.map((item) => (
            <article className="more-resource-item" key={item.id}>
              <img src={item.image} alt={item.title} />

              <div className="more-resource-info">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>{item.meta} &nbsp; • &nbsp; {item.read}</span>
              </div>

              <a href="#featured-resources" aria-label={`Explore ${item.title}`}>
                →
              </a>
            </article>
          ))}

          {filteredMore.length === 0 && (
            <p className="resources-empty">
              No additional resources in this category yet.
            </p>
          )}
        </div>

        <div className="resources-newsletter">
          <div className="newsletter-icon">✉</div>

          <h2>
            Get the latest resources
            <span>in your inbox.</span>
          </h2>

          <p>
            Writing tips, new guides, product updates, and
            more — straight to your inbox.
          </p>

          <form onSubmit={handleSubscribe}>
            
            <div className="newsletter-input">
              <span>✉</span>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={isSubscribing}>
  {isSubscribing ? "Subscribing..." : "Subscribe"}
  <span>→</span>
</button>
          </form>

{subscribeMessage && (
  <p className="newsletter-message" role="status">
    {subscribeMessage}
  </p>
)}

        </div>
      </section>
    </main>
  );
}

export default ResourcesPage;
