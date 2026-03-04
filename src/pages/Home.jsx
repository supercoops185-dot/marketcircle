import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <span style={styles.badge}>🌱 South Florida's Local Market Community</span>
          <h1 style={styles.heroTitle}>
            Discover Your <br />
            <span style={styles.heroAccent}>Local Farmers Market</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Find markets, follow your favorite vendors, and stay connected
            to the freshest local community around you.
          </p>
          <div style={styles.heroBtns}>
            <Link to="/signup" style={styles.primaryBtn}>Get Started Free</Link>
            <Link to="/discover" style={styles.secondaryBtn}>Explore Markets →</Link>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.heroCard}>
            <div style={styles.heroCardEmoji}>🥬</div>
            <p style={styles.heroCardTitle}>Fresh Produce</p>
            <p style={styles.heroCardSub}>Local vendors near you</p>
          </div>
          <div style={{ ...styles.heroCard, ...styles.heroCard2 }}>
            <div style={styles.heroCardEmoji}>☕</div>
            <p style={styles.heroCardTitle}>Artisan Coffee</p>
            <p style={styles.heroCardSub}>Every Saturday morning</p>
          </div>
          <div style={{ ...styles.heroCard, ...styles.heroCard3 }}>
            <div style={styles.heroCardEmoji}>🍞</div>
            <p style={styles.heroCardTitle}>Baked Goods</p>
            <p style={styles.heroCardSub}>Freshly made daily</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Everything local markets need</h2>
        <div style={styles.featureGrid}>
          {[
            { icon: "🗺️", title: "Discover Markets", desc: "Find farmers markets near you with event dates, vendors, and community reviews." },
            { icon: "🏪", title: "Vendor Pages", desc: "Follow your favorite vendors, get alerts when they're nearby, and see their upcoming locations." },
            { icon: "📸", title: "Community Feed", desc: "Share photos, tag vendors, and connect with fellow market-goers in your city." },
            { icon: "🔔", title: "Smart Alerts", desc: "Never miss your favorite vendor. Get notified when they're attending a market near you." },
            { icon: "📅", title: "RSVP Events", desc: "RSVP to market events so organizers know you're coming and can plan accordingly." },
            { icon: "⭐", title: "Featured Vendors", desc: "Vendors can upgrade to featured status for higher visibility and more followers." },
          ].map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Are you a vendor or market organizer?</h2>
        <p style={styles.ctaSubtitle}>Grow your visibility and connect with your community.</p>
        <div style={styles.ctaBtns}>
          <Link to="/signup" style={styles.ctaBtnVendor}>Join as Vendor</Link>
          <Link to="/signup" style={styles.ctaBtnOrganizer}>Join as Organizer</Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>🌿 MarketCircle · South Florida's local market community</p>
      </footer>
    </div>
  );
}

const styles = {
  page: { fontFamily: "'DM Sans', sans-serif", backgroundColor: "#fafaf8" },
  hero: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "80px 24px 60px",
    display: "flex",
    alignItems: "center",
    gap: 60,
    flexWrap: "wrap",
  },
  heroContent: { flex: 1, minWidth: 300 },
  badge: {
    display: "inline-block",
    backgroundColor: "#e8f5ee",
    color: "#1a6b3c",
    fontSize: 13,
    fontWeight: 600,
    padding: "6px 14px",
    borderRadius: 20,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 54,
    fontWeight: 800,
    color: "#1a1a1a",
    lineHeight: 1.1,
    margin: "0 0 20px",
    letterSpacing: "-1px",
  },
  heroAccent: { color: "#1a6b3c" },
  heroSubtitle: { fontSize: 18, color: "#555", lineHeight: 1.6, margin: "0 0 36px", maxWidth: 480 },
  heroBtns: { display: "flex", gap: 16, flexWrap: "wrap" },
  primaryBtn: {
    textDecoration: "none",
    backgroundColor: "#1a6b3c",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 16,
  },
  secondaryBtn: {
    textDecoration: "none",
    color: "#1a6b3c",
    padding: "14px 28px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 16,
    border: "2px solid #1a6b3c",
  },
  heroVisual: { flex: 1, minWidth: 280, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" },
  heroCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "24px 20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    textAlign: "center",
    minWidth: 140,
    flex: 1,
  },
  heroCard2: { transform: "translateY(20px)" },
  heroCard3: { transform: "translateY(-10px)" },
  heroCardEmoji: { fontSize: 36, marginBottom: 8 },
  heroCardTitle: { fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px", fontSize: 15 },
  heroCardSub: { color: "#888", fontSize: 13, margin: 0 },
  features: { backgroundColor: "#fff", padding: "80px 24px" },
  sectionTitle: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: 800,
    color: "#1a1a1a",
    marginBottom: 48,
    letterSpacing: "-0.5px",
  },
  featureGrid: {
    maxWidth: 1100,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
  },
  featureCard: {
    padding: "28px 24px",
    borderRadius: 14,
    border: "1px solid #eee",
    backgroundColor: "#fafaf8",
    transition: "box-shadow 0.2s",
  },
  featureIcon: { fontSize: 32, marginBottom: 14 },
  featureTitle: { fontWeight: 700, fontSize: 18, color: "#1a1a1a", margin: "0 0 10px" },
  featureDesc: { color: "#666", fontSize: 15, lineHeight: 1.6, margin: 0 },
  cta: {
    backgroundColor: "#1a6b3c",
    padding: "80px 24px",
    textAlign: "center",
  },
  ctaTitle: { fontSize: 36, fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.5px" },
  ctaSubtitle: { color: "#a8d5be", fontSize: 18, margin: "0 0 36px" },
  ctaBtns: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" },
  ctaBtnVendor: {
    textDecoration: "none",
    backgroundColor: "#fff",
    color: "#1a6b3c",
    padding: "14px 28px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 16,
  },
  ctaBtnOrganizer: {
    textDecoration: "none",
    backgroundColor: "transparent",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: 10,
    fontWeight: 700,
    fontSize: 16,
    border: "2px solid rgba(255,255,255,0.5)",
  },
  footer: { padding: "32px 24px", textAlign: "center", borderTop: "1px solid #eee" },
  footerText: { color: "#999", fontSize: 14, margin: 0 },
};
