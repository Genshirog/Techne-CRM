// src/components/public/ContactUsSection.tsx
import { useState, useEffect, useRef } from "react";
import axios from "../../api/axios";

const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY;

declare global {
  interface Window {
    grecaptcha: any;
  }
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  recaptcha?: string;
  [key: string]: string | undefined;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const LocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const EmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7293C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1468 21.5901 20.9046 21.7335 20.6407 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.18999 12.85C3.49997 10.2412 2.44824 7.27099 2.11999 4.18C2.095 3.90347 2.12787 3.62476 2.21649 3.36162C2.30512 3.09849 2.44756 2.85669 2.63476 2.65162C2.82196 2.44655 3.0498 2.28271 3.30379 2.17052C3.55777 2.05833 3.83233 2.00026 4.10999 2H7.10999C7.5953 1.99522 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04207 3.23945 9.10999 3.72C9.23662 4.68007 9.47144 5.62273 9.80999 6.53C9.94454 6.88792 9.97366 7.27691 9.8939 7.65088C9.81415 8.02485 9.62886 8.36811 9.35999 8.64L8.08999 9.91C9.51355 12.4135 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9751 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const SendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    width="20" height="20" viewBox="0 0 24 24" fill="none"
    style={{ animation: "spin 0.8s linear infinite" }}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"
      strokeDasharray="31.4" strokeDashoffset="10" />
  </svg>
);

const SuccessIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#00ff88" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 4L12 14.01l-3-3" stroke="#00ff88" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// ── Styles ────────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  section: {
    background: "#f8f9fa",
    padding: "5rem 0",
    position: "relative",
    width: "100%",
  },
  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "0 2rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "4rem",
    alignItems: "start",
  },
  // Left side
  infoSide: {
    position: "sticky",
    top: 120,
  },
  tagBadge: {
    display: "inline-block",
    background: "#e6f7f0",
    border: "2px solid #00ff88",
    color: "#0a1f1a",
    padding: "0.5rem 1.5rem",
    borderRadius: 24,
    fontSize: "0.9rem",
    fontWeight: 600,
    marginBottom: "1.5rem",
  },
  heading: {
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
    fontWeight: 800,
    color: "#1a1a1a",
    lineHeight: 1.2,
    marginBottom: "1rem",
  },
  description: {
    fontSize: "1.1rem",
    color: "#666",
    lineHeight: 1.7,
    marginBottom: "2.5rem",
  },
  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    marginBottom: "2.5rem",
  },
  infoItem: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
  },
  infoIcon: {
    width: 48,
    height: 48,
    background: "#f0f0f0",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#00cc66",
    flexShrink: 0,
  },
  infoTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "0.25rem",
  },
  infoText: {
    fontSize: "0.95rem",
    color: "#666",
  },
  socialLinks: {
    display: "flex",
    gap: "1rem",
  },
  // Right side (form card)
  formCard: {
    background: "#fff",
    borderRadius: 16,
    padding: "2.5rem",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
  },
  // Success state
  successBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "3rem 2rem",
    gap: "1rem",
  },
  successHeading: {
    fontSize: "1.75rem",
    fontWeight: 800,
    color: "#1a1a1a",
  },
  successText: {
    color: "#666",
    fontSize: "1rem",
    lineHeight: 1.6,
    maxWidth: 320,
  },
  resetBtn: {
    marginTop: "0.5rem",
    background: "transparent",
    border: "2px solid #00ff88",
    color: "#0a1f1a",
    padding: "0.75rem 1.75rem",
    borderRadius: 8,
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  // Error banner
  errorBanner: {
    gridColumn: "1 / -1",
    background: "#fff0f0",
    border: "1px solid #ffcccc",
    color: "#cc0000",
    borderRadius: 8,
    padding: "0.875rem 1rem",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  // Form
  form: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1.5rem",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  formGroupFull: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
    gridColumn: "1 / -1",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  required: {
    color: "#e53e3e",
  },
  input: {
    padding: "0.875rem 1rem",
    border: "2px solid #e0e0e0",
    borderRadius: 8,
    fontSize: "1rem",
    fontFamily: "inherit",
    background: "white",
    color: "#1a1a1a",
    outline: "none",
    transition: "all 0.3s ease",
    width: "100%",
  },
  inputError: {
    borderColor: "#e53e3e",
    boxShadow: "0 0 0 3px rgba(229,62,62,0.1)",
  },
  textarea: {
    padding: "0.875rem 1rem",
    border: "2px solid #e0e0e0",
    borderRadius: 8,
    fontSize: "1rem",
    fontFamily: "inherit",
    background: "white",
    color: "#1a1a1a",
    outline: "none",
    transition: "all 0.3s ease",
    resize: "vertical",
    minHeight: 120,
    width: "100%",
  },
  fieldError: {
    fontSize: "0.8rem",
    color: "#e53e3e",
    marginTop: "0.1rem",
  },
  submitBtn: {
    gridColumn: "1 / -1",
    background: "#00ff88",
    color: "#0a1f1a",
    border: "none",
    padding: "1rem 2rem",
    borderRadius: 8,
    fontSize: "1.1rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    boxShadow: "0 4px 12px rgba(0,255,136,0.3)",
    fontFamily: "inherit",
    width: "100%",
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function ContactSection() {
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaWidgetId = useRef<number | null>(null);
  const recaptchaToken = useRef<string>("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Focus states for styled inputs
  const [focused, setFocused] = useState<Record<string, boolean>>({});

  // ── reCAPTCHA ──────────────────────────────────────────────────────────────

  const loadRecaptchaScript = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.grecaptcha) { resolve(); return; }
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  };

  const renderRecaptcha = () => {
    if (!window.grecaptcha || !recaptchaContainerRef.current) return;
    recaptchaWidgetId.current = window.grecaptcha.render(recaptchaContainerRef.current, {
      sitekey: RECAPTCHA_SITE_KEY,
      callback: (token: string) => {
        recaptchaToken.current = token;
        setErrors((prev) => ({ ...prev, recaptcha: undefined }));
      },
      "expired-callback": () => { recaptchaToken.current = ""; },
      "error-callback": () => { recaptchaToken.current = ""; },
    });
  };

  useEffect(() => {
    loadRecaptchaScript().then(() => {
      window.grecaptcha.ready(renderRecaptcha);
    });
    return () => {
      if (recaptchaWidgetId.current !== null && window.grecaptcha) {
        try { window.grecaptcha.reset(recaptchaWidgetId.current); } catch (_) {}
      }
    };
  }, []);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!formData.name.trim())
      e.name = "Full name is required.";

    if (!formData.email.trim())
      e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Please enter a valid email address.";

    if (formData.phone && !/^[\d\s+\-()]{7,20}$/.test(formData.phone))
      e.phone = "Please enter a valid phone number.";

    if (!formData.message.trim())
      e.message = "Message is required.";
    else if (formData.message.trim().length < 10)
      e.message = "Message must be at least 10 characters.";

    if (!recaptchaToken.current)
      e.recaptcha = "Please complete the reCAPTCHA verification.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await axios.post("/contact", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        recaptcha_token: recaptchaToken.current,
      });
      setSubmitSuccess(true);
    } catch (err: any) {
      const data = err.response?.data;
      const status = err.response?.status;

      if (status === 422 && data?.errors) {
        const laravelErrors: FormErrors = {};
        for (const [field, messages] of Object.entries(data.errors)) {
          laravelErrors[field] = Array.isArray(messages) ? messages[0] : (messages as string);
        }
        setErrors(laravelErrors);
      } else {
        setSubmitError(data?.message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
      if (recaptchaWidgetId.current !== null && window.grecaptcha) {
        window.grecaptcha.reset(recaptchaWidgetId.current);
        recaptchaToken.current = "";
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", message: "" });
    setErrors({});
    setSubmitSuccess(false);
    setSubmitError("");
    recaptchaToken.current = "";
    if (recaptchaWidgetId.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(recaptchaWidgetId.current);
    }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────

  const inputStyle = (field: string, isTextarea = false): React.CSSProperties => ({
    ...(isTextarea ? styles.textarea : styles.input),
    borderColor: errors[field]
      ? "#e53e3e"
      : focused[field]
      ? "#00ff88"
      : "#e0e0e0",
    boxShadow: errors[field]
      ? "0 0 0 3px rgba(229,62,62,0.1)"
      : focused[field]
      ? "0 0 0 3px rgba(0,255,136,0.1)"
      : "none",
  });

  const focusProps = (field: string) => ({
    onFocus: () => setFocused((f) => ({ ...f, [field]: true })),
    onBlur: () => setFocused((f) => ({ ...f, [field]: false })),
  });

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .contact-social-link {
          width: 44px; height: 44px; background: #f0f0f0;
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; color: #666; transition: all 0.3s ease;
          text-decoration: none;
        }
        .contact-social-link:hover {
          background: #00ff88; color: #0a1f1a; transform: translateY(-4px);
        }
        .contact-reset-btn:hover { background: #00ff88; }
        .contact-submit-btn:hover:not(:disabled) {
          background: #00dd77;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,255,136,0.4) !important;
        }
        @media (max-width: 1024px) {
          .contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .contact-info-side { position: static !important; }
        }
        @media (max-width: 768px) {
          .contact-section { padding: 3rem 0 !important; }
          .contact-form-card { padding: 1.5rem !important; }
          .contact-form-inner { grid-template-columns: 1fr !important; gap: 1.25rem !important; }
        }
      `}</style>

      <section id="contact" className="contact-section" style={styles.section}>
        <div style={styles.container}>
          <div className="contact-grid" style={styles.grid}>

            {/* ── Left: Info ── */}
            <div className="contact-info-side" style={styles.infoSide}>
              <div style={styles.tagBadge}>Get in Touch</div>

              <h2 style={styles.heading}>
                Let's Build Something Amazing Together
              </h2>
              <p style={styles.description}>
                Have a project in mind? We'd love to hear from you.
                Send us a message and we'll respond as soon as possible.
              </p>

              <div style={styles.infoList}>
                {[
                  { icon: <LocationIcon />, label: "Location", value: "Davao City, Philippines" },
                  { icon: <EmailIcon />, label: "Email", value: "info@techne-fixer.com" },
                  { icon: <PhoneIcon />, label: "Phone", value: "+63 123 456 7890" },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={styles.infoItem}>
                    <div style={styles.infoIcon}>{icon}</div>
                    <div>
                      <p style={styles.infoTitle}>{label}</p>
                      <p style={styles.infoText}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.socialLinks}>
                <a href="#" className="contact-social-link" aria-label="Facebook">
                  <FacebookIcon />
                </a>
              </div>
            </div>

            {/* ── Right: Form card ── */}
            <div className="contact-form-card" style={styles.formCard}>

              {/* Success State */}
              {submitSuccess && (
                <div style={styles.successBox as React.CSSProperties}>
                  <SuccessIcon />
                  <h3 style={styles.successHeading}>Message Sent!</h3>
                  <p style={styles.successText}>
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                  <button
                    className="contact-reset-btn"
                    onClick={resetForm}
                    style={styles.resetBtn}
                  >
                    Send Another Message
                  </button>
                </div>
              )}

              {/* Form */}
              {!submitSuccess && (
                <form
                  onSubmit={handleSubmit}
                  className="contact-form-inner"
                  style={styles.form}
                  noValidate
                >
                  {/* Error Banner */}
                  {submitError && (
                    <div style={styles.errorBanner}>
                      <AlertIcon />
                      {submitError}
                    </div>
                  )}

                  {/* Name */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Full Name <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                      {...focusProps("name")}
                      style={inputStyle("name")}
                      placeholder="John Doe"
                    />
                    {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
                  </div>

                  {/* Email */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Email Address <span style={styles.required}>*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                      {...focusProps("email")}
                      style={inputStyle("email")}
                      placeholder="john@example.com"
                    />
                    {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
                  </div>

                  {/* Phone */}
                  <div style={styles.formGroupFull}>
                    <label style={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData((f) => ({ ...f, phone: e.target.value }))}
                      {...focusProps("phone")}
                      style={inputStyle("phone")}
                      placeholder="+63 123 456 7890"
                    />
                    {errors.phone && <span style={styles.fieldError}>{errors.phone}</span>}
                  </div>

                  {/* Message */}
                  <div style={styles.formGroupFull}>
                    <label style={styles.label}>
                      Message <span style={styles.required}>*</span>
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData((f) => ({ ...f, message: e.target.value }))}
                      {...focusProps("message")}
                      style={inputStyle("message", true)}
                      rows={5}
                      placeholder="Tell us about your project..."
                    />
                    {errors.message && <span style={styles.fieldError}>{errors.message}</span>}
                  </div>

                  {/* reCAPTCHA */}
                  <div style={{ ...styles.formGroupFull, alignItems: "flex-start" }}>
                    <div ref={recaptchaContainerRef} id="recaptcha-container" />
                    {errors.recaptcha && (
                      <span style={styles.fieldError}>{errors.recaptcha}</span>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="contact-submit-btn"
                    style={{
                      ...styles.submitBtn,
                      opacity: isSubmitting ? 0.6 : 1,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <SpinnerIcon />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <SendIcon />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}