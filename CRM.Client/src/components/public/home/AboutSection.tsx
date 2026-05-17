export default function AboutSection() {
  return (
    <section id="about" style={{
      padding: "6rem 2rem",
      background: "#f8f9fa",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <span style={{
            display: "inline-block",
            background: "#e6f7f0",
            border: "2px solid #00ff88",
            color: "#0a1f1a",
            padding: "0.4rem 1.2rem",
            borderRadius: 24,
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}>Find Us</span>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: "0.75rem",
          }}>Visit Our Service Center</h2>
          <p style={{
            color: "#666",
            fontSize: "1rem",
            maxWidth: 500,
            margin: "0 auto",
            lineHeight: 1.7,
          }}>
            Drop by for consultations, walk-in diagnostics, or to pick up completed repairs.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "2rem",
          alignItems: "start",
        }}>

          {/* Map */}
          <div style={{
            position: "relative",
            height: 460,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            border: "1px solid #e8e8e8",
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4078.4335142038844!2d125.49317867510116!3d7.027566117100341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f90d345435ca29%3A0x956b6d7472a90432!2sTechne%20Fixer%20Computer%20and%20Laptop%20Repair%20Services%2F%20CCTV%20INSTALLATION!5e1!3m2!1sen!2sph!4v1764341286198!5m2!1sen!2sph"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Techne-Fixer Location"
            />
            <a
              href="https://maps.google.com/?q=Techne+Fixer+Computer+and+Laptop+Repair+Services"
              target="_blank"
              rel="noreferrer"
              style={{
                position: "absolute", bottom: "1rem", right: "1rem",
                background: "#fff",
                color: "#0a1f1a",
                padding: "0.6rem 1rem",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "all 0.3s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#00ff88"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
            >
              ↗ View larger map
            </a>
          </div>

          {/* Hours card */}
          <div style={{
            background: "#fff",
            border: "1px solid #e8e8e8",
            borderRadius: 16,
            padding: "2rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          }}>
            <h3 style={{
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: "0.4rem",
            }}>Business Hours</h3>
            <p style={{ color: "#999", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              We're here when you need us.
            </p>

            {/* Hours row */}
            <div style={{
              background: "#e6f7f0",
              border: "1px solid rgba(0,255,136,0.4)",
              borderRadius: 10,
              padding: "1rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.25rem",
            }}>
              <span style={{ color: "#1a1a1a", fontWeight: 600, fontSize: "0.9rem" }}>
                Monday – Saturday
              </span>
              <span style={{ color: "#00aa55", fontWeight: 700, fontSize: "0.9rem" }}>
                9 AM – 6 PM
              </span>
            </div>

            {/* Info note */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#f8f9fa",
              border: "1px solid #e8e8e8",
              borderRadius: 8,
              padding: "0.75rem",
              fontSize: "0.8rem",
              color: "#999",
              marginBottom: "1.5rem",
            }}>
              ℹ️ Tap the map for directions
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "#f0f0f0", marginBottom: "1.5rem" }} />

            {/* Contact hints */}
            {[
              { icon: "📞", text: "Call us for appointments" },
              { icon: "📧", text: "Email for inquiries" },
            ].map(item => (
              <div key={item.text} style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  flexShrink: 0,
                }}>{item.icon}</div>
                <span style={{ color: "#666", fontSize: "0.9rem" }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}