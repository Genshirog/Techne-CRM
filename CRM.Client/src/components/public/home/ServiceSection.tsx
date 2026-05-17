import { useState, useEffect, useRef } from "react";
import { colors, fonts } from "../../../styles/variables";
import axios from "../../../api/axios";

interface Service {
  id: number;
  name: string;
  description: string;
  categoryName: string;      // ← add this
  serviceCategoryId: number; // ← add this
  createdAt: string;         // ← add this
}

const FALLBACK_COLORS = [
  "#ff4757", "#ffd93d", "#00ff88",
  "#3742fa", "#ff6b9d", "#c56cf0", "#ff9f43",
];

const SERVICE_ICONS = ["💻", "🖨️", "📱", "📷", "⚡", "🔧", "🩺"];

export default function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(3);
  const touchStartX = useRef(0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("/services");
        setServices(res.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 768) setVisibleSlides(1);
      else if (window.innerWidth < 1024) setVisibleSlides(2);
      else setVisibleSlides(3);
      setCurrentIndex(i => Math.min(i, Math.max(0, services.length - visibleSlides)));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [services.length]);

  const maxIndex = Math.max(0, services.length - visibleSlides);
  const next = () => setCurrentIndex(i => Math.min(i + 1, maxIndex));
  const prev = () => setCurrentIndex(i => Math.max(i - 1, 0));

  return (
    <section id="services" style={{
      padding: "6rem 2rem",
      background: colors.bgLight,
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* ─── Header ───────────────────────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{
            fontFamily: fonts.mono,
            fontSize: "0.75rem", letterSpacing: "3px",
            color: colors.primaryDark, textTransform: "uppercase",
          }}>What We Do</span>
          <h2 style={{
            fontFamily: fonts.mono,
            fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
            fontWeight: 700, color: colors.textDark,
            marginTop: "0.5rem", marginBottom: "0.75rem",
          }}>Our Services</h2>
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            Expert repair solutions for all your electronic needs
          </p>
        </div>

        {/* ─── Loading ──────────────────────────────────────────────────────── */}
        {loading && (
          <div style={{
            textAlign: "center", padding: "4rem",
            color: "#666",
          }}>
            <div style={{
              fontSize: "2.5rem", marginBottom: "1rem",
              animation: "spin 1s linear infinite",
              display: "inline-block",
            }}>⚙️</div>
            <p style={{ fontFamily: fonts.mono, fontSize: "0.9rem" }}>
              Loading services...
            </p>
          </div>
        )}

        {/* ─── Error ────────────────────────────────────────────────────────── */}
        {error && (
          <div style={{
            textAlign: "center", padding: "3rem",
            color: "#ff4757",
            background: "rgba(255,71,87,0.05)",
            borderRadius: 12,
            border: "1px solid rgba(255,71,87,0.2)",
          }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚠️</div>
            <p>Failed to load services. Please try again.</p>
          </div>
        )}

        {/* ─── Carousel ─────────────────────────────────────────────────────── */}
        {!loading && !error && services.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>

              {/* Prev */}
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                aria-label="Previous"
                style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: currentIndex === 0 ? "#e0e0e0" : colors.primary,
                  border: "none",
                  cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.3s",
                  boxShadow: currentIndex === 0 ? "none" : "0 4px 12px rgba(0,255,136,0.3)",
                }}
                onMouseEnter={e => {
                  if (currentIndex !== 0)
                    e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 18L9 12L15 6"
                    stroke={currentIndex === 0 ? "#aaa" : colors.textDark}
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </button>

              {/* Track */}
              <div
                style={{
                  overflow: "hidden", flex: 1,
                  padding: "1rem 0", margin: "-1rem 0",
                  touchAction: "pan-y",
                }}
                onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
                onTouchEnd={e => {
                  const diff = touchStartX.current - e.changedTouches[0].clientX;
                  if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
                }}
              >
                <div style={{
                  display: "flex",
                  transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)`,
                  transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1)",
                }}>
                  {services.map((service, i) => (
                    <div
                      key={service.id ?? i}
                      style={{
                        flex: `0 0 ${100 / visibleSlides}%`,
                        padding: "0 0.75rem",
                        boxSizing: "border-box",
                      }}
                    >
                      <div
                        style={{
                          background: "#fff",
                          borderRadius: 16, padding: "2rem",
                          border: "1px solid #e8f0e8",
                          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                          textAlign: "center",
                          height: "100%",
                          transition: "all 0.3s ease",
                          cursor: "default",
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.transform = "translateY(-6px)";
                          el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)";
                          el.style.borderColor = colors.primary;
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLDivElement;
                          el.style.transform = "translateY(0)";
                          el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                          el.style.borderColor = "#e8f0e8";
                        }}
                      >
                        {/* Icon */}
                        <div style={{
                          width: 72, height: 72, borderRadius: 16,
                          background: FALLBACK_COLORS[i % FALLBACK_COLORS.length] + "20",
                          border: `2px solid ${FALLBACK_COLORS[i % FALLBACK_COLORS.length]}40`,
                          display: "flex", alignItems: "center",
                          justifyContent: "center",
                          margin: "0 auto 1.25rem",
                          fontSize: "2rem",
                          transition: "transform 0.3s",
                        }}>
                          {SERVICE_ICONS[i % SERVICE_ICONS.length]}
                        </div>

                        <h3 style={{
                          fontFamily: fonts.mono,
                          fontSize: "1.1rem", fontWeight: 700,
                          color: colors.textDark, marginBottom: "0.75rem",
                        }}>{service.name}</h3>

                        <p style={{
                          fontSize: "0.9rem", color: "#666", lineHeight: 1.6,
                        }}>{service.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next */}
              <button
                onClick={next}
                disabled={currentIndex >= maxIndex}
                aria-label="Next"
                style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: currentIndex >= maxIndex ? "#e0e0e0" : colors.primary,
                  border: "none",
                  cursor: currentIndex >= maxIndex ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.3s",
                  boxShadow: currentIndex >= maxIndex ? "none" : "0 4px 12px rgba(0,255,136,0.3)",
                }}
                onMouseEnter={e => {
                  if (currentIndex < maxIndex)
                    e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 18L15 12L9 6"
                    stroke={currentIndex >= maxIndex ? "#aaa" : colors.textDark}
                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            {/* ─── Dots ───────────────────────────────────────────────────── */}
            <div style={{
              display: "flex", justifyContent: "center",
              gap: "0.5rem", marginTop: "2rem",
            }}>
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  style={{
                    width: i === currentIndex ? 32 : 10,
                    height: 10, borderRadius: 5,
                    background: i === currentIndex ? colors.primary : "#ddd",
                    border: "none", cursor: "pointer",
                    transition: "all 0.3s", padding: 0,
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* ─── Empty state ──────────────────────────────────────────────────── */}
        {!loading && !error && services.length === 0 && (
          <div style={{
            textAlign: "center", padding: "4rem",
            color: "#999", fontFamily: fonts.mono, fontSize: "0.9rem",
          }}>
            No services available at the moment.
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}