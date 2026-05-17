// src/components/common/cards/ProjectCard.tsx
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Service {
  type: string;
  scopeOfWork: string[];
}

interface ProjectCardProps {
  category: string;
  name: string;
  description: string;
  services: Service[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, string> = {
  "Laptop": "💻",
  "Printer": "🖨️",
  "Washing Machine": "🧺",
  "Cellphone": "📱",
  "CCTV": "📹",
  "Solar Panel": "☀️",
  "Clinic Equipment": "🏥",
};

const getIcon = (category: string) => CATEGORY_ICONS[category] ?? "🔧";

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProjectCard({ category, name, description, services }: ProjectCardProps) {
  const [activeService, setActiveService] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "linear-gradient(135deg, #0a1f1a 0%, #0d2820 50%, #0f2d24 100%)",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: hovered
            ? "0 8px 24px rgba(0,0,0,0.4)"
            : "0 4px 12px rgba(0,0,0,0.3)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.3s ease",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Card body */}
        <div style={{
          padding: "2rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          flex: 1,
        }}
          className="project-card-body"
        >
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{
                width: 60, height: 60, flexShrink: 0,
                background: "linear-gradient(135deg, #00ff88 0%, #00cc70 100%)",
                borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem",
              }}>
                {getIcon(category)}
              </div>
              <div>
                <h3 style={{
                  fontSize: "1.5rem", fontWeight: 700,
                  color: "#fff", marginBottom: "0.25rem",
                }}>{name}</h3>
                <p style={{
                  fontSize: "0.875rem", color: "#00ff88",
                  fontWeight: 600, textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}>{category}</p>
              </div>
            </div>
            <p style={{
              fontSize: "1rem", color: "#b8c5c0", lineHeight: 1.6,
            }}>{description}</p>
          </div>

          {/* Right column */}
          <div style={{
            display: "flex", flexDirection: "column",
            borderLeft: "2px solid rgba(0,255,136,0.2)",
            paddingLeft: "2rem",
          }}
            className="project-card-right"
          >
            <h4 style={{
              fontSize: "1.125rem", fontWeight: 600,
              color: "#fff", marginBottom: "1rem",
            }}>Services Provided</h4>

            {/* Tabs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {services.map((service, i) => {
                const isActive = activeService === i;
                const isHovered = hoveredTab === i && !isActive;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveService(i)}
                    onMouseEnter={() => setHoveredTab(i)}
                    onMouseLeave={() => setHoveredTab(null)}
                    style={{
                      padding: "0.6rem 1.2rem",
                      border: `2px solid ${isActive ? "#00ff88" : isHovered ? "#00ff88" : "rgba(0,255,136,0.3)"}`,
                      background: isActive
                        ? "#00ff88"
                        : isHovered
                        ? "rgba(0,255,136,0.1)"
                        : "rgba(0,255,136,0.05)",
                      color: isActive ? "#0a1f1a" : isHovered ? "#00ff88" : "#b8c5c0",
                      borderRadius: 8,
                      fontSize: "0.875rem", fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      whiteSpace: "nowrap",
                      transform: isHovered && !isActive ? "translateY(-2px)" : "translateY(0)",
                      boxShadow: isActive ? "0 4px 12px rgba(0,255,136,0.4)" : "none",
                      fontFamily: "inherit",
                    }}
                  >
                    {service.type}
                  </button>
                );
              })}
            </div>

            {/* Scope */}
            {services[activeService] && (
              <div
                key={activeService}
                style={{
                  borderLeft: "3px solid #00ff88",
                  paddingLeft: "1.5rem",
                  animation: "fadeInUp 0.3s ease-in",
                }}
              >
                <p style={{
                  fontSize: "0.875rem", fontWeight: 600,
                  color: "#00ff88", marginBottom: "0.75rem",
                }}>Scope of Works:</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {services[activeService].scopeOfWork.map((item, idx) => (
                    <li key={idx} style={{
                      position: "relative",
                      paddingLeft: "1.5rem",
                      marginBottom: "0.5rem",
                      color: "#d4ddd9",
                      lineHeight: 1.6,
                      fontSize: "0.95rem",
                    }}>
                      <span style={{
                        position: "absolute", left: 0,
                        color: "#00ff88", fontWeight: 700,
                      }}>–</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Feedbacks footer */}
        <div style={{
          borderTop: "2px solid rgba(0,255,136,0.2)",
          padding: "1.25rem 2rem",
        }}>
          <span style={{
            color: "#00ff88", fontSize: "0.95rem",
            fontWeight: 600, cursor: "pointer",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#00dd77";
              e.currentTarget.style.textDecoration = "underline";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "#00ff88";
              e.currentTarget.style.textDecoration = "none";
            }}
          >
            &gt; Feedbacks
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .project-card-body { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .project-card-right { border-left: none !important; border-top: 2px solid rgba(0,255,136,0.2); padding-left: 0 !important; padding-top: 1.5rem !important; }
        }
        @media (max-width: 768px) {
          .project-card-body { padding: 1.5rem !important; }
        }
      `}</style>
    </>
  );
}