export default function Footer() {
  return (
    <footer style={{
      background: "rgba(10, 31, 26, 0.95)",
      borderTop: "1px solid rgba(0,255,136,0.1)",
      padding: "2rem",
      textAlign: "center",
    }}>
      <div style={{
        fontFamily: "'Space Mono', monospace",
        color: "rgba(255,255,255,0.3)", fontSize: "0.8rem",
      }}>
        © {new Date().getFullYear()} TechneFixer. All rights reserved.
      </div>
    </footer>
  );
}