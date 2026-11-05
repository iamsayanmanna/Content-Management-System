
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PricingPage.css";
import pricingLeafLeft from "../assets/pricing-leaf-left.png";
import pricingLeafRight from "../assets/pricing-leaf-right.png";

function PricingPage() {
  const navigate = useNavigate();
  const [billing, setBilling] = useState("monthly");
  const [activeFaq, setActiveFaq] = useState(0);

  const isYearly = billing === "yearly";

  const plans = [
    {
      name: "Free",
      description: "Get started with the essentials.",
      monthly: 0,
      yearly: 0,
      icon: "✎",
      features: [
        "Create up to 5 posts",
        "Access to basic templates",
        "Standard editor (Markdown & Rich Text)",
        "Community support",
      ],
      button: "Get Started Free",
      popular: false,
    },
    {
      name: "Pro",
      description: "More power and flexibility for serious creators.",
      monthly: 299,
      yearly: 2870,
      icon: "♕",
      features: [
        "Unlimited posts",
        "All premium templates",
        "Custom domain (e.g. yourblog.com)",
        "Advanced analytics",
        "Priority support",
      ],
      button: "Upgrade to Pro",
      popular: true,
    },
    {
      name: "Team",
      description: "Collaborate, manage, and publish together.",
      monthly: 799,
      yearly: 7670,
      icon: "♧",
      features: [
        "Everything in Pro",
        "Up to 5 team members",
        "Role & permission management",
        "Shared media library",
        "Team analytics & activity",
      ],
      button: "Start Team Plan",
      popular: false,
    },
  ];

  const benefits = [
    { icon: "ϟ", title: "No setup fees", subtitle: "Start in minutes" },
    { icon: "♧", title: "Cancel anytime", subtitle: "No long-term commitment" },
    { icon: "▤", title: "Secure payment", subtitle: "Powered by trusted providers" },
    { icon: "♧", title: "Priority support", subtitle: "Get help when you need it" },
  ];

  const faqs = [
    {
      question: "Can I switch plans later?",
      answer:
        "Yes! You can upgrade, downgrade, or cancel your plan anytime from your account settings.",
    },
    {
      question: "Do you offer a free trial for Pro?",
      answer:
        "You can start with our Free plan and explore PenSpace before choosing a paid plan.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "Payment methods will be displayed securely during checkout when payment integration is available.",
    },
    {
      question: "Is there a student discount?",
      answer:
        "Student discounts can be introduced in a future PenSpace update.",
    },
    {
      question: "Can I use my own domain?",
      answer:
        "Custom domain support is included in the Pro plan.",
    },
  ];

  return (
    <main className="pricing-page">

      
<header className="topbar">
  <Link className="brand" to="/">
    <span className="brand-mark">P</span>
    <span>
      Pen<span className="brand-light">Space</span>
    </span>
  </Link>

  <nav className="top-nav" aria-label="Main navigation">
    <Link to="/">Home</Link>
    <Link to="/features">Features</Link>
    <Link to="/templates">Templates</Link>
    <Link className="nav-active" to="/pricing">Pricing</Link>
    <Link className="nav-resource" to="/resources">
      Resources <span aria-hidden="true">▼</span>
    </Link>
  </nav>

  <div className="author-auth-actions">
    <Link
      className="author-link"
      to="/"
      state={{ openLogin: true }}
    >
      Author Login <span>↗</span>
    </Link>

    <Link
      className="header-cta"
      to="/"
      state={{ openRegister: true }}
    >
      Get Started <span>+</span>
    </Link>
  </div>
</header>


      <section className="pricing-hero">
        <img
  src={pricingLeafLeft}
  alt=""
  className="pricing-leaf pricing-leaf-left"
/>

<img
  src={pricingLeafRight}
  alt=""
  className="pricing-leaf pricing-leaf-right"
/>

        <div className="pricing-heading">
          <span className="pricing-label">
            <span></span> PRICING
          </span>

          <h1>
            Simple, transparent pricing
            <br />
            <span>for every creator.</span>
          </h1>

          <p>
            Choose the plan that fits your writing journey — from hobby blogs
            to professional publications.
          </p>

          <div className="billing-toggle">
            <button
              className={!isYearly ? "active" : ""}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>

            <button
              className={isYearly ? "active" : ""}
              onClick={() => setBilling("yearly")}
            >
              Yearly <span>Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      <section className="pricing-plans">
        {plans.map((plan) => (
          <article
            className={`pricing-card ${plan.popular ? "popular" : ""}`}
            key={plan.name}
          >
            {plan.popular && (
              <div className="popular-badge">★ Most Popular</div>
            )}

            <div className="plan-heading">
              <div className="plan-icon">{plan.icon}</div>
              <div>
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
              </div>
            </div>

            <div className="plan-price">
              <strong>
                ₹{isYearly ? plan.yearly : plan.monthly}
              </strong>
              <span>/ {isYearly ? "year" : "month"}</span>
            </div>

            <ul className="plan-features">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <span>✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`plan-button ${plan.popular ? "primary" : ""}`}
              onClick={() => {
  if (plan.name === "Free") {
    navigate("/", {
      state: { openRegister: true },
    });
  } else {
    alert("Paid plan checkout will be available soon.");
  }
}}
            >
              {plan.button}
              {plan.popular && <span>→</span>}
            </button>
          </article>
        ))}
      </section>

      <section className="pricing-benefits">
        {benefits.map((benefit) => (
          <div className="benefit-item" key={benefit.title}>
            <div className="benefit-icon">{benefit.icon}</div>
            <div>
              <strong>{benefit.title}</strong>
              <p>{benefit.subtitle}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="pricing-faq">
        <div className="faq-intro">
          <span>FAQs</span>
          <h2>
            Frequently
            <br />
            asked questions.
          </h2>
          <p>
            Have questions about pricing or features? We've got you covered.
          </p>
          <div className="faq-underline"></div>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              className={`faq-item ${activeFaq === index ? "open" : ""}`}
              key={faq.question}
            >
              <button
                onClick={() =>
                  setActiveFaq(activeFaq === index ? -1 : index)
                }
              >
                {faq.question}
                <span>{activeFaq === index ? "⌃" : "⌄"}</span>
              </button>

              {activeFaq === index && (
                <p>{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default PricingPage;
