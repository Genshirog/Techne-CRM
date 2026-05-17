const FALLBACK_COLORS = [
  "#ff4757", "#ffd93d", "#00ff88",
  "#3742fa", "#ff6b9d", "#c56cf0", "#ff9f43",
];

export default function TestimonialsSection() {
  const testimonials = [
    { name: "Maria Santos", role: "Small Business Owner", text: "Fixed my printer in just 2 hours. Amazing service, very professional!", rating: 5 },
    { name: "Juan Dela Cruz", role: "Student", text: "My laptop was completely dead. They brought it back to life. Highly recommended!", rating: 5 },
    { name: "Anna Reyes", role: "Nurse", text: "Fast, reliable, and affordable. They even gave tips to maintain my device.", rating: 5 },
  ];

  return (
    <section style={{ padding: "6rem 2rem", background: "#f8faf8" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "0.75rem", letterSpacing: "3px",
            color: "#00cc6a", textTransform: "uppercase",
          }}>Reviews</span>
          <h2 style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
            fontWeight: 700, color: "#0a1f1a",
            marginTop: "0.5rem",
          }}>What Customers Say</h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{
              background: "#fff", borderRadius: 16, padding: "2rem",
              border: "1px solid #e8f0e8",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              transition: "all 0.3s",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "#00ff88";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "#e8f0e8";
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                {"⭐".repeat(t.rating)}
              </div>
              <p style={{
                color: "#444", lineHeight: 1.7, marginBottom: "1.5rem",
                fontStyle: "italic",
              }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${FALLBACK_COLORS[i]}, ${FALLBACK_COLORS[i + 1] || FALLBACK_COLORS[0]})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 700, fontSize: "1rem",
                }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#0a1f1a", fontSize: "0.9rem" }}>{t.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "#888" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}