import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) return setError("Passwords do not match.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await signup(email, password, displayName);
      navigate("/feed");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    }
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <Link to="/" style={styles.logo}>🌿 MarketCircle</Link>
        <h1 style={styles.title}>Create your account</h1>
        <p style={styles.subtitle}>Join the local market community — it's free</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={styles.input}
              placeholder="Jane Smith"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="you@example.com"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="At least 6 characters"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Creating account..." : "Create Free Account"}
          </button>
        </form>

        <p style={styles.terms}>
          By signing up you agree to our Terms of Service and Privacy Policy.
        </p>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.switchLink}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#fafaf8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "48px 40px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: 420,
  },
  logo: {
    display: "block",
    textDecoration: "none",
    color: "#1a6b3c",
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 28,
  },
  title: { fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px", letterSpacing: "-0.5px" },
  subtitle: { color: "#888", fontSize: 15, margin: "0 0 28px" },
  error: {
    backgroundColor: "#fff0f0",
    color: "#c0392b",
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 20,
    border: "1px solid #ffd0d0",
  },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 600, color: "#333" },
  input: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 15,
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  },
  btn: {
    backgroundColor: "#1a6b3c",
    color: "#fff",
    border: "none",
    padding: "14px",
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 700,
    cursor: "pointer",
    marginTop: 4,
    fontFamily: "'DM Sans', sans-serif",
  },
  terms: { textAlign: "center", color: "#aaa", fontSize: 12, marginTop: 16 },
  switchText: { textAlign: "center", color: "#888", fontSize: 14, marginTop: 12 },
  switchLink: { color: "#1a6b3c", fontWeight: 600, textDecoration: "none" },
};
