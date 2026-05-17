import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { colors, fonts } from "../../styles/variables";
import logo from "../../assets/logo.png";
import axis from "../../api/axios";
import { useAuth } from "../../context/AuthContext";


function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M1 10s3-7 9-7 9 7 9 7-3 7-9 7-9-7-9-7z" stroke="currentColor" strokeWidth="2" />
      <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M14.12 14.12A7 7 0 0 1 3 10M9.88 5.88A7 7 0 0 1 17 10M1 1l18 18"
        stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await axis.post("/auth/login", { email, password });
      const data = res.data;

      // store via AuthContext instead of manual localStorage
      login({
        id:    data.id,
        name:  data.name,
        email: data.email,
        role:  data.role,
        token: data.token,
      });

      // role-based redirect
      if (data.role === "Admin" || data.role === "SuperAdmin") {
        navigate("/admin/dashboard");
      } else if (data.role === "Technician") {
        navigate("/technician/dashboard");
      } else {
        navigate("/customer/dashboard");
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    padding: "0.875rem 1rem",
    border: "2px solid #e0e0e0", borderRadius: 8,
    fontSize: "0.95rem", background: "white", outline: "none",
    width: "100%", boxSizing: "border-box" as const,
    transition: "all 0.2s ease",
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{
        borderRadius: 16,
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        display: "grid",
        gridTemplateColumns: "1fr 1.4fr",
        overflow: "hidden",
        minHeight: 480,
      }} className="auth-grid">

        {/* ─── Left — White Panel ───────────────────────────────────────────── */}
        <div style={{
          background: "#ffffff",
          borderRight: "1px solid #f0f0f0",
          padding: "3rem 2rem",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
        }}>
          <img src={logo} alt="TechneFixer"
            style={{ width: 80, height: "auto", marginBottom: "1.25rem" }} />

          <h2 style={{
            fontFamily: fonts.mono, fontSize: "1.4rem",
            fontWeight: 700, color: colors.textDark,
            marginBottom: "0.5rem",
          }}>Welcome Back</h2>

          <p style={{
            color: "#888", fontSize: "0.85rem",
            lineHeight: 1.6, marginBottom: "2rem",
          }}>
            Sign in to manage your repair inquiries and track your devices.
          </p>

          {[
            { icon: "🔒", text: "Secure & encrypted" },
            { icon: "⚡", text: "Real-time updates" },
            { icon: "📱", text: "Works on all devices" },
          ].map(f => (
            <div key={f.text} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              marginBottom: "0.75rem", textAlign: "left", width: "100%",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "#f5fdf8",
                border: "1px solid #d4f0e0",
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "1rem",
                flexShrink: 0,
              }}>{f.icon}</div>
              <span style={{ color: "#555", fontSize: "0.85rem" }}>
                {f.text}
              </span>
            </div>
          ))}

          <div style={{
            marginTop: "1.5rem", paddingTop: "1.5rem",
            borderTop: "1px solid #f0f0f0", width: "100%",
            textAlign: "center",
          }}>
            <p style={{ color: "#aaa", fontSize: "0.78rem", marginBottom: "0.4rem" }}>
              Don't have an account?
            </p>
            <Link to="/register" style={{
              color: colors.primaryDark, fontWeight: 700,
              textDecoration: "none", fontSize: "0.85rem",
              fontFamily: fonts.mono,
            }}>Create one →</Link>
          </div>
        </div>

        {/* ─── Right — Form ─────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(255,255,255,0.98)",
          padding: "2.5rem 2rem",
          display: "flex", flexDirection: "column",
          justifyContent: "center",
        }}>
          <h3 style={{
            fontFamily: fonts.mono, fontSize: "1.3rem",
            fontWeight: 700, color: colors.textDark,
            marginBottom: "0.25rem",
          }}>Sign In</h3>
          <p style={{ color: "#999", fontSize: "0.82rem", marginBottom: "1.75rem" }}>
            Enter your credentials to continue
          </p>

          <form onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>

            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
                Email
              </label>
              <input
                type="email" value={email} required
                onChange={e => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                style={inputStyle}
                onFocus={e => {
                  e.currentTarget.style.borderColor = colors.primaryDark;
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,204,106,0.1)";
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "#e0e0e0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password} required
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ ...inputStyle, paddingRight: "3rem" }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = colors.primaryDark;
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,204,106,0.1)";
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = "#e0e0e0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button" tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: "absolute", right: "0.75rem",
                    top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", color: "#999",
                    cursor: "pointer", padding: "0.25rem",
                    display: "flex", alignItems: "center",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = colors.primaryDark)}
                  onMouseLeave={e => (e.currentTarget.style.color = "#999")}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", fontSize: "0.85rem",
            }}>
              <label style={{
                display: "flex", alignItems: "center",
                gap: "0.5rem", cursor: "pointer", color: "#555",
              }}>
                <input type="checkbox" checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: colors.primaryDark }} />
                Remember me
              </label>
              <Link to="/forgot-password" style={{
                color: colors.primaryDark, textDecoration: "none",
                fontWeight: 600, fontSize: "0.82rem",
              }}>Forgot password?</Link>
            </div>

            {errorMessage && (
              <div style={{
                background: "#fef2f2", color: "#dc2626",
                border: "1px solid #fecaca", borderRadius: 8,
                padding: "0.65rem 1rem", fontSize: "0.85rem", textAlign: "center",
              }}>{errorMessage}</div>
            )}

            <button
              type="submit" disabled={isLoading}
              style={{
                width: "100%", padding: "0.9rem",
                background: isLoading ? "#ccc" : colors.primaryDark,
                color: "white", border: "none", borderRadius: 8,
                fontSize: "0.95rem", fontWeight: 600, fontFamily: fonts.mono,
                cursor: isLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s ease", marginTop: "0.25rem",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "0.5rem",
              }}
              onMouseEnter={e => {
                if (!isLoading) {
                  e.currentTarget.style.background = "#2d7a4f";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,204,106,0.3)";
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isLoading ? "#ccc" : colors.primaryDark;
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: 16, height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "white", borderRadius: "50%",
                    animation: "spin 0.6s linear infinite",
                  }} />
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .auth-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}