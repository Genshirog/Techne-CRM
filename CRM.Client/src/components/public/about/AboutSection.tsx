// src/components/public/about/AboutSection.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Data ──────────────────────────────────────────────────────────────────────

const services = [
  { icon: "❄️", title: "Air Conditioning Services",  description: "Cleaning, maintenance, and repair" },
  { icon: "🔍", title: "Hardware Diagnostics",        description: "Professional troubleshooting and assessment" },
  { icon: "⚙️", title: "Installations & Upgrades",   description: "Expert setup of new equipment and system improvements" },
  { icon: "📹", title: "Security Systems",            description: "CCTV installation and maintenance" },
  { icon: "📦", title: "Equipment Supply",            description: "Quality parts and hardware solutions" },
  { icon: "🛡️", title: "Preventive Maintenance",     description: "Regular servicing to keep your equipment running smoothly" },
];

const commitments = [
  { badge: "24/7", title: "Always Available",    description: "We're open Monday to Saturday, from 9 AM to 6 PM because we understand that technical issues don't follow a schedule." },
  { badge: "₱",   title: "Transparent Pricing", description: "Every service includes a clear quotation before we begin work. Our diagnostic fee is ₱500, which is waived when you proceed with repairs." },
  { badge: "✓",   title: "Quality Guaranteed",  description: "We work with trusted suppliers and use quality parts backed by warranties. If something isn't right, we make it right." },
  { badge: "👥",  title: "Professional Team",   description: "Our experienced technicians are trained to handle everything from routine maintenance to complex repairs, ensuring your equipment is in capable hands." },
];

const features = [
  { title: "Engineering Expertise",  description: "Technical knowledge backed by mechanical engineering principles" },
  { title: "Proven Track Record",    description: "Serving satisfied customers since 2023" },
  { title: "Regular Clients",        description: "Trusted for ongoing maintenance contracts" },
  { title: "Convenient Location",    description: "Easily accessible in Toril" },
  { title: "Personal Service",       description: "Direct communication with our team throughout the repair process" },
];

const processSteps = [
  { title: "Contact Us",              description: "Reach out online or visit our shop" },
  { title: "Diagnostic Assessment",   description: "₱500 fee (waived with repair)" },
  { title: "Clear Quotation",         description: "Transparent pricing before work begins" },
  { title: "50% Down Payment",        description: "Secure your job order" },
  { title: "Expert Repair",           description: "Quality work by trained technicians" },
  { title: "Notification & Pickup",   description: "We'll contact you when ready" },
  { title: "Final Payment & Invoice", description: "Complete transaction and receive your equipment" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function CardHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
      <span style={{ fontSize: "2rem" }}>{icon}</span>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{title}</h2>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e8e8e8",
  borderRadius: 16,
  padding: "3rem",
  marginBottom: "2rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const bodyText: React.CSSProperties = {
  fontSize: "1.1rem", lineHeight: 1.8, color: "#444",
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AboutSection() {
  const navigate = useNavigate();
  const [ctaHovered, setCtaHovered]       = useState(false);
  const [mapBtnHovered, setMapBtnHovered] = useState(false);

  return (
    <>
      <style>{`
        .svc-card { transition: all 0.3s ease; }
        .svc-card:hover {
          border-color: #00ff88 !important;
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,255,136,0.1);
        }
        .process-line::before {
          content: '';
          position: absolute;
          left: 30px; top: 30px; bottom: 30px; width: 2px;
          background: linear-gradient(180deg, #00ff88 0%, #e0e0e0 100%);
        }
        @media (max-width: 1024px) { .location-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) {
          .about-pad  { padding: 2rem !important; }
          .svc-grid   { grid-template-columns: 1fr !important; }
          .commit-grid { grid-template-columns: 1fr !important; }
          .process-line::before { left: 20px; }
          .step-num { width: 40px !important; height: 40px !important; font-size: 1.2rem !important; }
          .proc-step { gap: 1rem !important; }
          .cta-inner { padding: 2rem !important; }
          .cta-inner h2 { font-size: 1.8rem !important; }
        }
      `}</style>

      <section style={{ background: "#f8f9fa", padding: "5rem 0", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 2rem" }}>

          {/* Our Story */}
          <div className="about-pad" style={cardStyle}>
            <CardHeader icon="📖" title="Our Story" />
            <p style={{ ...bodyText, marginBottom: "1.5rem" }}>
              Founded in December 2023, our business was born from a passion for solving technical problems
              and a commitment to excellent service. What started as a small aircon cleaning service during
              the pandemic has grown into a full-service hardware repair and maintenance shop, serving the
              Toril community and beyond.
            </p>
            <p style={{ ...bodyText, margin: 0 }}>
              Our journey began with hands-on practice and dedication to mastering the craft. With a foundation
              in mechanical engineering, our CEO combined theoretical knowledge with practical experience,
              transforming technical concepts into real-world solutions. Through freelancing and continuous
              learning, we developed the expertise to handle a wide range of hardware challenges—from simple
              repairs to complex installations.
            </p>
          </div>

          {/* What We Do */}
          <div className="about-pad" style={cardStyle}>
            <CardHeader icon="🔧" title="What We Do" />
            <p style={{ ...bodyText, fontWeight: 600, color: "#1a1a1a", marginBottom: "2rem" }}>
              We specialize in comprehensive hardware repair and maintenance services:
            </p>
            <div className="svc-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}>
              {services.map(s => (
                <div key={s.title} className="svc-card" style={{
                  background: "#fff", padding: "2rem",
                  borderRadius: 12, border: "2px solid #e0e0e0",
                }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{s.icon}</div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.5rem" }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: "1rem", color: "#666", margin: 0 }}>{s.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Commitments */}
          <div className="about-pad" style={cardStyle}>
            <CardHeader icon="✨" title="Our Commitment to You" />
            <div className="commit-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem", marginTop: "2rem",
            }}>
              {commitments.map(c => (
                <div key={c.title}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                    <span style={{
                      background: "#00ff88", color: "#0a1f1a", fontWeight: 700,
                      padding: "0.5rem 1rem", borderRadius: 20, fontSize: "1rem",
                    }}>{c.badge}</span>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                      {c.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: "1rem", color: "#666", margin: 0 }}>{c.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="about-pad" style={{
            ...cardStyle,
            background: "linear-gradient(135deg, #f8f9fa 0%, #e8f5e9 100%)",
            border: "2px solid #00ff88",
          }}>
            <CardHeader icon="⭐" title="Why Choose Us?" />
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {features.map(f => (
                <div key={f.title} style={{
                  display: "flex", alignItems: "flex-start",
                  gap: "1rem", fontSize: "1.1rem", lineHeight: 1.6,
                }}>
                  <span style={{
                    background: "#00ff88", color: "#0a1f1a",
                    width: 28, height: 28, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, flexShrink: 0, marginTop: "0.2rem", fontSize: "0.9rem",
                  }}>✓</span>
                  <div>
                    <strong style={{ color: "#1a1a1a" }}>{f.title}</strong> – {f.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process */}
          <div className="about-pad" style={cardStyle}>
            <CardHeader icon="🔄" title="Our Process" />
            <div className="process-line" style={{
              display: "flex", flexDirection: "column",
              gap: "2rem", marginTop: "2rem", position: "relative",
            }}>
              {processSteps.map((step, i) => (
                <div key={step.title} className="proc-step" style={{
                  display: "flex", gap: "2rem",
                  alignItems: "flex-start", position: "relative",
                }}>
                  <div className="step-num" style={{
                    width: 60, height: 60, background: "#00ff88", color: "#0a1f1a",
                    borderRadius: "50%", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "1.5rem", fontWeight: 700,
                    flexShrink: 0, boxShadow: "0 4px 12px rgba(0,255,136,0.3)",
                    position: "relative", zIndex: 1,
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ paddingTop: "0.75rem" }}>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1a1a1a", marginBottom: "0.5rem" }}>
                      {step.title}
                    </h3>
                    <p style={{ fontSize: "1rem", color: "#666", margin: 0 }}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="about-pad" style={cardStyle}>
            <CardHeader icon="📍" title="Visit Our Service Center" />
            <p style={{ ...bodyText, fontWeight: 600, color: "#1a1a1a", marginBottom: "2rem" }}>
              Drop by our location for consultations, walk-in diagnostics, or to pick up completed repairs.
            </p>

            <div className="location-grid" style={{
              display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem",
            }}>
              {/* Map */}
              <div style={{
                position: "relative", height: 460, borderRadius: 12,
                overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4078.4335142038844!2d125.49317867510116!3d7.027566117100341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f90d345435ca29%3A0x956b6d7472a90432!2sTechne%20Fixer%20Computer%20and%20Laptop%20Repair%20Services%2F%20CCTV%20INSTALLATION!5e1!3m2!1sen!2sph!4v1764341286198!5m2!1sen!2sph"
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Techne-Fixer Location"
                />
                <a
                  href="https://maps.google.com/?q=Techne+Fixer+Computer+and+Laptop+Repair+Services+CCTV+INSTALLATION"
                  target="_blank" rel="noreferrer"
                  onMouseEnter={() => setMapBtnHovered(true)}
                  onMouseLeave={() => setMapBtnHovered(false)}
                  style={{
                    position: "absolute", bottom: "1rem", right: "1rem",
                    background: mapBtnHovered ? "#00ff88" : "#fff",
                    color: "#0a1f1a", padding: "0.75rem 1.25rem",
                    borderRadius: 8, fontWeight: 600, fontSize: "0.875rem",
                    display: "flex", alignItems: "center", gap: "0.5rem",
                    textDecoration: "none",
                    boxShadow: mapBtnHovered ? "0 6px 16px rgba(0,255,136,0.3)" : "0 4px 12px rgba(0,0,0,0.15)",
                    transform: mapBtnHovered ? "translateY(-2px)" : "translateY(0)",
                    transition: "all 0.3s ease",
                  }}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View larger map
                </a>
              </div>

              {/* Hours */}
              <div style={{ background: "#fff", border: "2px solid #e0e0e0", borderRadius: 12, padding: "2rem" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1a1a1a", margin: "0 0 0.5rem" }}>
                  Business Hours
                </h3>
                <p style={{ color: "#666", margin: "0 0 1.5rem", fontSize: "0.9rem" }}>
                  We're here when you need us.
                </p>

                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "1rem", background: "#f8f9fa", borderRadius: 8, marginBottom: "1.25rem",
                }}>
                  <span style={{ color: "#1a1a1a", fontWeight: 600, fontSize: "0.9rem" }}>Monday – Saturday</span>
                  <span style={{ color: "#00aa55", fontWeight: 700, fontSize: "0.9rem" }}>9 AM – 6 PM</span>
                </div>

                <div style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  fontSize: "0.8rem", color: "#666",
                  background: "#e8f5e9", border: "1px solid #00ff88",
                  borderRadius: 8, padding: "0.75rem", marginBottom: "1.5rem",
                }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Tap the map for directions
                </div>

                <div style={{ height: 1, background: "#e0e0e0", margin: "1.5rem 0" }} />

                {[
                  {
                    label: "Call us for appointments",
                    path: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                  },
                  {
                    label: "Email for inquiries",
                    path: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  },
                ].map(item => (
                  <div key={item.label} style={{
                    display: "flex", alignItems: "center",
                    gap: "0.75rem", marginBottom: "1rem",
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 8, flexShrink: 0,
                      background: "#e8f5e9", color: "#00aa55",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.path} />
                      </svg>
                    </div>
                    <span style={{ color: "#444", fontSize: "0.9rem" }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="cta-inner" style={{
            background: "linear-gradient(135deg, #0a1f1a 0%, #1a3d2e 100%)",
            color: "#fff", padding: "4rem", borderRadius: 16,
            textAlign: "center", marginTop: "1rem",
          }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem" }}>
              Ready to get started?
            </h2>
            <p style={{ fontSize: "1.2rem", color: "#e0e0e0", marginBottom: "0.5rem" }}>
              Contact us today for a free consultation or visit our shop in Toril.
            </p>
            <p style={{ fontSize: "1.1rem", color: "#00ff88", fontWeight: 600, marginBottom: "2rem" }}>
              Open Monday - Saturday: 9:00 AM - 6:00 PM
            </p>
            <button
              onClick={() => navigate("/contact")}
              onMouseEnter={() => setCtaHovered(true)}
              onMouseLeave={() => setCtaHovered(false)}
              style={{
                background: "#00ff88", color: "#0a1f1a",
                border: "none", padding: "1rem 3rem",
                fontSize: "1.2rem", fontWeight: 700, borderRadius: 30,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: ctaHovered ? "0 8px 24px rgba(0,255,136,0.4)" : "0 4px 16px rgba(0,255,136,0.3)",
                transform: ctaHovered ? "translateY(-2px)" : "translateY(0)",
                transition: "all 0.3s ease",
              }}
            >
              Contact Us
            </button>
          </div>

        </div>
      </section>
    </>
  );
}