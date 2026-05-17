import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { colors, fonts } from "../../styles/variables";
import logo from "../../assets/logo.png";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5181/api";

function getStrength(pwd: string): "weak" | "medium" | "strong" | "" {
  if (!pwd) return "";
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  if (score <= 2) return "weak";
  if (score <= 3) return "medium";
  return "strong";
}

const STRENGTH_COLOR = { weak: "#ef5350", medium: "#ff9800", strong: "#00cc6a" };
const STRENGTH_WIDTH = { weak: "33%", medium: "66%", strong: "100%" };
const STRENGTH_LABEL = { weak: "Weak password", medium: "Medium strength", strong: "Strong password" };

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

function FormInput({
  label, id, type = "text", value, onChange, placeholder, required, minLength, rightElement,
}: {
  label: string; id: string; type?: string;
  value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
  minLength?: number; rightElement?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <label htmlFor={id} style={{ fontSize: "0.85rem", fontWeight: 600, color: "#333" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id} type={type} value={value} required={required}
          minLength={minLength} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          style={{
            padding: rightElement ? "0.75rem 3rem 0.75rem 1rem" : "0.75rem 1rem",
            border: "2px solid #e0e0e0", borderRadius: 8,
            fontSize: "0.95rem", background: "white", outline: "none",
            width: "100%", boxSizing: "border-box",
            transition: "all 0.2s ease",
          }}
          onFocus={e => {
            e.currentTarget.style.borderColor = colors.primaryDark;
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,204,106,0.1)";
          }}
          onBlur={e => {
            e.currentTarget.style.borderColor = "#e0e0e0";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        {rightElement && (
          <div style={{
            position: "absolute", right: "0.75rem",
            top: "50%", transform: "translateY(-50%)",
          }}>
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleBtn({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button type="button" tabIndex={-1} onClick={onToggle} style={{
      background: "none", border: "none", color: "#999",
      cursor: "pointer", padding: "0.25rem",
      display: "flex", alignItems: "center", transition: "color 0.2s",
    }}
      onMouseEnter={e => (e.currentTarget.style.color = colors.primaryDark)}
      onMouseLeave={e => (e.currentTarget.style.color = "#999")}
    >
      {show ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^a-zA-Z0-9]/.test(password);
  const passwordsMatch = !confirmPassword || password === confirmPassword;
  const strength = useMemo(() => getStrength(password), [password]);

  const isFormValid = useMemo(() =>
    !!(name && email && hasMinLength && hasNumber &&
      hasSpecial && passwordsMatch && confirmPassword && agreeToTerms),
    [name, email, hasMinLength, hasNumber, hasSpecial, passwordsMatch, confirmPassword, agreeToTerms]
  );

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed.");
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify({
        name: data.name, email: data.email, role: data.role,
      }));
      navigate("/portal/inquiries");
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{
        borderRadius: 16,
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        display: "grid",
        gridTemplateColumns: "1fr 1.4fr",
        overflow: "hidden",
        minHeight: 560,
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
          }}>Join TechneFixer</h2>

          <p style={{
            color: "#888", fontSize: "0.85rem",
            lineHeight: 1.6, marginBottom: "2rem",
          }}>
            Create your account to submit repair inquiries and track your devices.
          </p>

          {[
            { icon: "🔧", text: "Submit repair inquiries" },
            { icon: "📊", text: "Track repair status" },
            { icon: "💬", text: "Chat with technicians" },
            { icon: "📄", text: "View quotations & invoices" },
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
              Already have an account?
            </p>
            <Link to="/login" style={{
              color: colors.primaryDark, fontWeight: 700,
              textDecoration: "none", fontSize: "0.85rem",
              fontFamily: fonts.mono,
            }}>Sign in instead →</Link>
          </div>
        </div>

        {/* ─── Right — Form ─────────────────────────────────────────────────── */}
        <div style={{
          background: "rgba(255,255,255,0.98)",
          padding: "2.5rem 2rem",
          overflowY: "auto",
        }}>
          <h3 style={{
            fontFamily: fonts.mono, fontSize: "1.3rem",
            fontWeight: 700, color: colors.textDark,
            marginBottom: "0.25rem",
          }}>Create Account</h3>
          <p style={{ color: "#999", fontSize: "0.82rem", marginBottom: "1.5rem" }}>
            Fill in your details to get started
          </p>

          <form onSubmit={handleRegister}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            <FormInput label="Full Name" id="name" value={name}
              onChange={setName} placeholder="John Doe" required />

            <FormInput label="Email" id="email" type="email" value={email}
              onChange={setEmail} placeholder="your.email@example.com" required />

            {/* Password + strength */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <FormInput
                label="Password" id="password"
                type={showPassword ? "text" : "password"}
                value={password} onChange={setPassword}
                placeholder="Create a strong password"
                required minLength={8}
                rightElement={<ToggleBtn show={showPassword} onToggle={() => setShowPassword(v => !v)} />}
              />
              {password && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{
                    flex: 1, height: 4, background: "#f0f0f0",
                    borderRadius: 2, overflow: "hidden",
                  }}>
                    <div style={{
                      height: "100%", borderRadius: 2,
                      width: STRENGTH_WIDTH[strength as keyof typeof STRENGTH_WIDTH] || "0%",
                      background: STRENGTH_COLOR[strength as keyof typeof STRENGTH_COLOR] || "#f0f0f0",
                      transition: "all 0.3s ease",
                    }} />
                  </div>
                  <span style={{
                    fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap",
                    color: STRENGTH_COLOR[strength as keyof typeof STRENGTH_COLOR] || "#999",
                  }}>
                    {STRENGTH_LABEL[strength as keyof typeof STRENGTH_LABEL] || ""}
                  </span>
                </div>
              )}
              <div style={{ display: "flex", gap: "1rem" }}>
                {[
                  { met: hasMinLength, label: "8+ chars" },
                  { met: hasNumber, label: "Number" },
                  { met: hasSpecial, label: "Special char" },
                ].map(req => (
                  <span key={req.label} style={{
                    fontSize: "0.75rem",
                    color: req.met ? "#00cc6a" : "#ef5350",
                    display: "flex", alignItems: "center", gap: "0.25rem",
                  }}>
                    {req.met ? "✓" : "✗"} {req.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <FormInput
                label="Confirm Password" id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword} onChange={setConfirmPassword}
                placeholder="Re-enter your password" required
                rightElement={<ToggleBtn show={showConfirm} onToggle={() => setShowConfirm(v => !v)} />}
              />
              {confirmPassword && !passwordsMatch && (
                <span style={{ fontSize: "0.8rem", color: "#ef5350" }}>
                  Passwords do not match
                </span>
              )}
            </div>

            {/* Terms */}
            <label style={{
              display: "flex", alignItems: "flex-start",
              gap: "0.5rem", fontSize: "0.82rem",
              color: "#666", cursor: "pointer", lineHeight: 1.5,
            }}>
              <input type="checkbox" checked={agreeToTerms}
                onChange={e => setAgreeToTerms(e.target.checked)} required
                style={{
                  width: 16, height: 16, cursor: "pointer",
                  accentColor: colors.primaryDark,
                  marginTop: "0.15rem", flexShrink: 0,
                }} />
              <span>
                I agree to the{" "}
                <a href="#" style={{ color: colors.primaryDark, textDecoration: "none", fontWeight: 600 }}>
                  Terms of Service
                </a>{" "}and{" "}
                <a href="#" style={{ color: colors.primaryDark, textDecoration: "none", fontWeight: 600 }}>
                  Privacy Policy
                </a>
              </span>
            </label>

            {errorMessage && (
              <div style={{
                background: "#fef2f2", color: "#dc2626",
                border: "1px solid #fecaca", borderRadius: 8,
                padding: "0.65rem 1rem", fontSize: "0.85rem", textAlign: "center",
              }}>{errorMessage}</div>
            )}

            <button
              type="submit" disabled={isLoading || !isFormValid}
              style={{
                width: "100%", padding: "0.875rem",
                background: isLoading || !isFormValid ? "#ccc" : colors.primaryDark,
                color: "white", border: "none", borderRadius: 8,
                fontSize: "0.95rem", fontWeight: 600, fontFamily: fonts.mono,
                cursor: isLoading || !isFormValid ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "0.5rem",
              }}
              onMouseEnter={e => {
                if (!isLoading && isFormValid) {
                  e.currentTarget.style.background = "#2d7a4f";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,204,106,0.3)";
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isLoading || !isFormValid ? "#ccc" : colors.primaryDark;
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
                  Creating account...
                </>
              ) : "Create Account"}
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