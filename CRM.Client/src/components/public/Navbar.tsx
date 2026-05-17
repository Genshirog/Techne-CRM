// src/components/public/Navbar.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { colors, fonts } from "../../styles/variables";
import logo from "../../assets/logo.png";

// ── Nav config ────────────────────────────────────────────────────────────────
// href: route path   |   section: scroll target on home (optional)

const navLinks = [
  { label: "Home",     href: "/",         section: "#home"    },
  { label: "Services", href: "/services", section: undefined  },
  { label: "About",    href: "/about-us",    section: undefined  },
  { label: "Contact",    href: "/contact",    section: "#contact"  },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const handleNavClick = (href: string, section?: string) => {
    setMenuOpen(false);

    if (section) {
      const el = document.querySelector(section);
      if (el) {
        // Element exists on this page — just scroll
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        // Element not on this page — go home then scroll
        navigate("/");
        setTimeout(() => {
          document.querySelector(section)?.scrollIntoView({ behavior: "smooth" });
        }, 150);
      }
      return;
    }

    navigate(href);
  };

  const linkColor = (href: string) =>
    isActive(href) ? colors.primary : "rgba(255,255,255,0.7)";

  const linkGlow = (href: string) =>
    isActive(href)
      ? `0 0 10px rgba(0,255,136,0.6), 0 0 20px rgba(0,255,136,0.3)`
      : "none";

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "1rem 2rem",
      background: scrolled ? "rgba(10, 31, 26, 0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${colors.border}` : "none",
      transition: "all 0.3s ease",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>

      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
      >
        <img src={logo} alt="TechneFixer Logo" style={{ width: 42, height: 42, objectFit: "contain" }} />
        <span style={{
          fontFamily: fonts.mono, fontSize: "1.2rem", fontWeight: 700,
          color: colors.text, letterSpacing: "-0.5px",
        }}>
          Techne<span style={{ color: colors.primary }}>Fixer</span>
        </span>
      </div>

      {/* Desktop Nav */}
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }} className="desktop-nav">
        {navLinks.map(link => (
          <button
            key={link.label}
            onClick={() => handleNavClick(link.href, link.section)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: linkColor(link.href),
              textShadow: linkGlow(link.href),
              fontFamily: fonts.mono, fontSize: "0.8rem",
              letterSpacing: "1px", textTransform: "uppercase",
              transition: "color 0.2s, text-shadow 0.2s", padding: 0,
            }}
            onMouseEnter={e => {
              if (!isActive(link.href)) {
                e.currentTarget.style.color = colors.primary;
              }
            }}
            onMouseLeave={e => {
              if (!isActive(link.href)) {
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }
            }}
          >
            {link.label}
            {/* Active underline dot */}
            {isActive(link.href) && (
              <span style={{
                display: "block", height: 2, borderRadius: 2,
                background: colors.primary,
                boxShadow: `0 0 6px ${colors.primary}`,
                marginTop: 3,
              }} />
            )}
          </button>
        ))}

        <button
          onClick={() => navigate("/login")}
          style={{
            background: "transparent", border: `1px solid ${colors.primary}`,
            color: colors.primary, padding: "0.5rem 1.25rem",
            borderRadius: 6, cursor: "pointer",
            fontFamily: fonts.mono, fontSize: "0.8rem",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = colors.primary;
            e.currentTarget.style.color = colors.textDark;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = colors.primary;
          }}
        >Login</button>
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(o => !o)}
        style={{
          display: "none", background: "none", border: "none",
          cursor: "pointer", padding: 0, color: colors.text, fontSize: "1.5rem",
        }}
        className="hamburger"
        aria-label="Toggle menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 65, left: 0, right: 0,
          background: "rgba(10,15,10,0.98)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${colors.border}`,
          padding: "1.5rem 2rem",
          display: "flex", flexDirection: "column", gap: "1.25rem",
        }}>
          {navLinks.map(link => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href, link.section)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: isActive(link.href) ? colors.primary : "rgba(255,255,255,0.8)",
                textShadow: linkGlow(link.href),
                fontFamily: fonts.mono, fontSize: "0.9rem",
                letterSpacing: "1px", textTransform: "uppercase",
                textAlign: "left", padding: "0.5rem 0",
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { setMenuOpen(false); navigate("/login"); }}
            style={{
              background: colors.primary, border: "none",
              color: colors.textDark, padding: "0.75rem",
              borderRadius: 8, cursor: "pointer",
              fontFamily: fonts.mono, fontWeight: 700,
              fontSize: "0.9rem", marginTop: "0.5rem",
            }}
          >Login</button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: block !important; }
        }
      `}</style>
    </nav>
  );
}