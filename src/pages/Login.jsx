import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/feed");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <Link to="/" style={styles.logo}>🌿 MarketCircle</Link>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.subtitle}>Log in to your account</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
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
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.switchLink}>Sign up free</Link>
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
  form: { display: "flex", flexDirection: "column", gap: 20 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 600, color: "#333" },
  input: {
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #ddd",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s",
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
  switchText: { textAlign: "center", color: "#888", fontSize: 14, marginTop: 24 },
  switchLink: { color: "#1a6b3c", fontWeight: 600, textDecoration: "none" },
};
