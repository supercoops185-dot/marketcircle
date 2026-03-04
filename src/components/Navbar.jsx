import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🌿</span>
          <span style={styles.logoText}>MarketCircle</span>
        </Link>

        {/* Desktop Links */}
        <div style={styles.links}>
          <Link to="/discover" style={{ ...styles.link, ...(isActive("/discover") ? styles.activeLink : {}) }}>
            Discover
          </Link>
          {currentUser && (
            <Link to="/feed" style={{ ...styles.link, ...(isActive("/feed") ? styles.activeLink : {}) }}>
              Feed
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div style={styles.auth}>
          {currentUser ? (
            <>
              <Link to="/dashboard" style={styles.dashBtn}>
                {userProfile?.displayName?.split(" ")[0] || "Dashboard"}
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.loginBtn}>Log in</Link>
              <Link to="/signup" style={styles.signupBtn}>Join Free</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/discover" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Discover</Link>
          {currentUser && (
            <Link to="/feed" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Feed</Link>
          )}
          {currentUser ? (
            <>
              <Link to="/dashboard" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={styles.mobileLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link to="/signup" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Join Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e8e8e8",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    fontFamily: "'DM Sans', sans-serif",
  },
  inner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 24px",
    height: 68,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    textDecoration: "none",
  },
  logoIcon: {
    fontSize: 22,
  },
  logoText: {
    fontSize: 20,
    fontWeight: 700,
    color: "#1a6b3c",
    letterSpacing: "-0.3px",
  },
  links: {
    display: "flex",
    gap: 32,
    alignItems: "center",
  },
  link: {
    textDecoration: "none",
    color: "#555",
    fontSize: 15,
    fontWeight: 500,
    transition: "color 0.2s",
  },
  activeLink: {
    color: "#1a6b3c",
    fontWeight: 600,
  },
  auth: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  loginBtn: {
    textDecoration: "none",
    color: "#333",
    fontSize: 15,
    fontWeight: 500,
    padding: "8px 16px",
    borderRadius: 8,
    transition: "background 0.2s",
  },
  signupBtn: {
    textDecoration: "none",
    backgroundColor: "#1a6b3c",
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    padding: "8px 20px",
    borderRadius: 8,
    transition: "background 0.2s",
  },
  dashBtn: {
    textDecoration: "none",
    color: "#1a6b3c",
    fontSize: 15,
    fontWeight: 600,
    padding: "8px 16px",
    borderRadius: 8,
    backgroundColor: "#f0f9f4",
  },
  logoutBtn: {
    border: "1px solid #ddd",
    background: "none",
    color: "#555",
    fontSize: 14,
    fontWeight: 500,
    padding: "7px 16px",
    borderRadius: 8,
    cursor: "pointer",
  },
  hamburger: {
    display: "none",
    background: "none",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    color: "#333",
    "@media (max-width: 768px)": {
      display: "block",
    },
  },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    padding: "16px 24px",
    borderTop: "1px solid #eee",
    gap: 12,
    backgroundColor: "#fff",
  },
  mobileLink: {
    textDecoration: "none",
    color: "#333",
    fontSize: 16,
    fontWeight: 500,
    padding: "8px 0",
  },
  mobileLogout: {
    background: "none",
    border: "none",
    color: "#e55",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    padding: "8px 0",
  },
};
