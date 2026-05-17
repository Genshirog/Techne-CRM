// src/components/public/HeroSection.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { colors, fonts } from "../../styles/variables";

// ── Types ─────────────────────────────────────────────────────────────────────

interface StatItem {
  value: string;
  label: string;
}

interface CTAButton {
  label: string;
  to: string;
}

interface HeroSectionProps {
  badge?: string;
  title: string;
  titleHighlight?: string;          // highlighted portion appended after title
  description: string;
  stats?: StatItem[];
  cta?: CTAButton;
  image?: string;                   // pass undefined to hide image column
  imageAlt?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PARTICLE_POSITIONS = [10, 25, 40, 55, 70, 80, 15, 90];
const PARTICLE_DELAYS    = [0, 3, 1, 5, 2, 7, 4, 6];
const PARTICLE_DURATIONS = [12, 15, 18, 13, 16, 14, 17, 19];

// ── Component ─────────────────────────────────────────────────────────────────

export default function HeroSection({
  badge,
  title,
  titleHighlight,
  description,
  stats,
  cta,
  image,
  imageAlt = "Hero image",
}: HeroSectionProps) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section style={{
      background: "linear-gradient(135deg, #0a1f1a 0%, #0d2820 50%, #0f2d24 100%)",
      position: "relative",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      width: "100%",
    }}>

      {/* Particles */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none", overflow: "hidden",
      }}>
        {PARTICLE_POSITIONS.map((left, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${left}%`,
            width: 12, height: 12,
            background: colors.primary,
            borderRadius: "50%",
            opacity: 0,
            boxShadow: `0 0 20px ${colors.primary}, 0 0 40px rgba(0,255,136,0.5)`,
            animation: `floatUp ${PARTICLE_DURATIONS[i]}s linear infinite`,
            animationDelay: `${PARTICLE_DELAYS[i]}s`,
          }} />
        ))}
      </div>

      {/* Content */}
      <div style={{
        flexGrow: 1,
        minHeight: "calc(100vh - 92px)",
        display: "flex",
        alignItems: "center",
        padding: "3rem 0",
        position: "relative",
        width: "100%",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "0 2rem", width: "100%",
          boxSizing: "border-box",
          display: "flex", alignItems: "center",
          justifyContent: image ? "space-between" : "center",
          gap: "3rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s ease",
        }}>

          {/* Left: Text */}
          <div style={{
            flex: 1, color: "#fff",
            maxWidth: image ? 600 : 780,
            display: "flex", flexDirection: "column",
            justifyContent: "center",
            textAlign: image ? "left" : "center",
            alignItems: image ? "flex-start" : "center",
          }}>

            {/* Badge */}
            {badge && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                background: "rgba(0,255,136,0.1)",
                border: "1px solid rgba(0,255,136,0.3)",
                borderRadius: 100, padding: "0.4rem 1rem",
                marginBottom: "1.5rem",
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: colors.primary,
                  animation: "pulse 2s infinite",
                }} />
                <span style={{
                  fontFamily: fonts.mono,
                  fontSize: "0.75rem", color: colors.primary,
                  letterSpacing: "1px",
                }}>{badge.toUpperCase()}</span>
              </div>
            )}

            {/* Title */}
            <h1 style={{
              fontSize: "clamp(2rem, 3.5vw, 3.5rem)",
              lineHeight: 1.1, fontWeight: 800,
              color: "#fff", marginBottom: "0.5em",
              wordWrap: "break-word",
            }}>
              {title}
              {titleHighlight && (
                <>
                  {" "}
                  <span style={{
                    color: colors.primary,
                    textShadow: "0 0 30px rgba(0,255,136,0.5)",
                  }}>
                    {titleHighlight}
                  </span>
                </>
              )}
            </h1>

            {/* Description */}
            <p style={{
              fontSize: "1.2rem", lineHeight: 1.6,
              marginBottom: "1.5em",
              color: "rgba(255,255,255,0.85)",
            }}>
              {description}
            </p>

            {/* Stats */}
            {stats && stats.length > 0 && (
              <div style={{
                display: "flex", gap: "2rem",
                marginBottom: "2rem", flexWrap: "wrap",
                justifyContent: image ? "flex-start" : "center",
              }}>
                {stats.map(stat => (
                  <div key={stat.label}>
                    <div style={{
                      fontFamily: fonts.mono,
                      fontSize: "1.6rem", fontWeight: 700,
                      color: colors.primary,
                    }}>{stat.value}</div>
                    <div style={{
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.5)",
                    }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA */}
            {cta && (
              <button
                onClick={() => navigate(cta.to)}
                style={{
                  background: colors.primary, color: colors.textDark,
                  border: "none", padding: "15px 30px",
                  fontSize: "1.1rem", borderRadius: 4,
                  cursor: "pointer", fontWeight: 700,
                  display: "inline-flex", alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "0 0 30px rgba(0,255,136,0.3)",
                  transition: "all 0.3s ease",
                  fontFamily: fonts.mono,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.boxShadow = "0 0 40px rgba(0,255,136,0.5)";
                  e.currentTarget.style.background = "#00dd77";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(0,255,136,0.3)";
                  e.currentTarget.style.background = colors.primary;
                }}
              >
                {cta.label}
                <span style={{ fontSize: "1.2rem" }}>›</span>
              </button>
            )}
          </div>

          {/* Right: Image (only rendered if prop is passed) */}
          {image && (
            <div style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              maxWidth: "100%",
            }}>
              <img
                src={image}
                alt={imageAlt}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  display: "block",
                  filter: "drop-shadow(0 0 40px rgba(0,255,136,0.2))",
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes floatUp {
          0%   { bottom: -10%; opacity: 0; transform: translateX(0) scale(0.5); }
          10%  { opacity: 0.8; }
          50%  { transform: translateX(20px) scale(1); }
          90%  { opacity: 0.8; }
          100% { bottom: 110%; opacity: 0; transform: translateX(-20px) scale(0.5); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
        @media (max-width: 900px) {
          .hero-inner { flex-direction: column !important; text-align: center !important; }
        }
      `}</style>
    </section>
  );
}