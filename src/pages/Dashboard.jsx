import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { userProfile } = useAuth();

  if (!userProfile) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div style={styles.welcome}>
          <h1 style={styles.title}>Welcome back, {userProfile.displayName?.split(" ")[0]} 👋</h1>
          <span style={styles.roleBadge}>{roleLabel(userProfile.role)}</span>
        </div>

        {/* Status Cards */}
        <div style={styles.statusGrid}>
          <div style={styles.statusCard}>
            <p style={styles.statusLabel}>Account Status</p>
            <p style={styles.statusValue}>{userProfile.roleStatus === "active" ? "✅ Active" : "⏳ Pending"}</p>
          </div>
          <div style={styles.statusCard}>
            <p style={styles.statusLabel}>Subscription</p>
            <p style={styles.statusValue}>{userProfile.subscriptionStatus === "active" ? "✅ Active" : "—  Inactive"}</p>
          </div>
          <div style={styles.statusCard}>
            <p style={styles.statusLabel}>Featured</p>
            <p style={styles.statusValue}>{userProfile.featuredStatus ? "⭐ Featured" : "— Not featured"}</p>
          </div>
        </div>

        {/* Actions by Role */}
        {userProfile.role === "CommunityMember" && <CommunityActions />}
        {userProfile.role === "Vendor" && <VendorActions profile={userProfile} />}
        {userProfile.role === "MarketOrganizer" && <OrganizerActions profile={userProfile} />}
      </div>
    </div>
  );
}

function CommunityActions() {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Your Account</h2>
      <div style={styles.actionGrid}>
        <ActionCard
          icon="📸"
          title="View Feed"
          desc="Browse community posts from markets and vendors."
          link="/feed"
          linkLabel="Go to Feed"
        />
        <ActionCard
          icon="🗺️"
          title="Discover Markets"
          desc="Find farmers markets and vendors near South Florida."
          link="/discover"
          linkLabel="Explore"
        />
        <ActionCard
          icon="🏪"
          title="Become a Vendor"
          desc="Sell at markets? Apply for a vendor account."
          link="/apply/vendor"
          linkLabel="Apply Now"
          highlight
        />
        <ActionCard
          icon="🎪"
          title="Run a Market?"
          desc="Apply to become a market organizer."
          link="/apply/organizer"
          linkLabel="Apply Now"
          highlight
        />
      </div>
    </div>
  );
}

function VendorActions({ profile }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Vendor Dashboard</h2>
      {profile.roleStatus === "pending" && (
        <div style={styles.pendingNotice}>
          ⏳ Your vendor application is under review. You'll be notified once approved.
        </div>
      )}
      <div style={styles.actionGrid}>
        <ActionCard icon="📝" title="Create Post" desc="Share updates, photos, and upcoming locations." link="/feed" linkLabel="Post Now" />
        <ActionCard icon="🗺️" title="Browse Markets" desc="Find markets to attend and grow your visibility." link="/discover" linkLabel="Explore" />
        <ActionCard icon="⭐" title="Go Featured" desc="Upgrade to featured for higher visibility." link="#" linkLabel="Upgrade (Coming Soon)" />
        <ActionCard icon="📊" title="Analytics" desc="View your follower count and post performance." link="#" linkLabel="Coming Soon" />
      </div>
    </div>
  );
}

function OrganizerActions({ profile }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>Organizer Dashboard</h2>
      {profile.roleStatus === "pending" && (
        <div style={styles.pendingNotice}>
          ⏳ Your organizer application is under review. You'll be notified once approved.
        </div>
      )}
      <div style={styles.actionGrid}>
        <ActionCard icon="🏪" title="My Market Page" desc="View and manage your market profile." link="/discover" linkLabel="View Page" />
        <ActionCard icon="📅" title="Create Event" desc="Add upcoming market dates and events." link="#" linkLabel="Coming Soon" />
        <ActionCard icon="👥" title="RSVP Analytics" desc="See who's planning to attend your events." link="#" linkLabel="Coming Soon" />
        <ActionCard icon="⭐" title="Go Featured" desc="Upgrade your market to featured status." link="#" linkLabel="Upgrade (Coming Soon)" />
      </div>
    </div>
  );
}

function ActionCard({ icon, title, desc, link, linkLabel, highlight }) {
  return (
    <div style={{ ...styles.actionCard, ...(highlight ? styles.highlightCard : {}) }}>
      <div style={styles.actionIcon}>{icon}</div>
      <h3 style={styles.actionTitle}>{title}</h3>
      <p style={styles.actionDesc}>{desc}</p>
      <Link to={link} style={{ ...styles.actionLink, ...(highlight ? styles.highlightLink : {}) }}>
        {linkLabel} →
      </Link>
    </div>
  );
}

function roleLabel(role) {
  if (role === "Vendor") return "Vendor";
  if (role === "MarketOrganizer") return "Market Organizer";
  return "Community Member";
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#fafaf8", fontFamily: "'DM Sans', sans-serif" },
  inner: { maxWidth: 1000, margin: "0 auto", padding: "48px 24px" },
  loading: { textAlign: "center", padding: 80, color: "#999", fontFamily: "'DM Sans', sans-serif" },
  welcome: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 32 },
  title: { fontSize: 30, fontWeight: 800, color: "#1a1a1a", margin: 0, letterSpacing: "-0.5px" },
  roleBadge: {
    backgroundColor: "#e8f5ee",
    color: "#1a6b3c",
    fontSize: 13,
    fontWeight: 700,
    padding: "5px 12px",
    borderRadius: 20,
  },
  statusGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 40 },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "20px",
    border: "1px solid #eee",
  },
  statusLabel: { color: "#999", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 6px" },
  statusValue: { color: "#1a1a1a", fontSize: 16, fontWeight: 700, margin: 0 },
  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 20px" },
  pendingNotice: {
    backgroundColor: "#fffbf0",
    border: "1px solid #fde68a",
    borderRadius: 10,
    padding: "14px 18px",
    color: "#92400e",
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 20,
  },
  actionGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 },
  actionCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: "24px 20px",
    border: "1px solid #eee",
  },
  highlightCard: {
    border: "2px solid #1a6b3c",
    backgroundColor: "#f0f9f4",
  },
  actionIcon: { fontSize: 28, marginBottom: 12 },
  actionTitle: { fontWeight: 700, fontSize: 16, color: "#1a1a1a", margin: "0 0 8px" },
  actionDesc: { color: "#777", fontSize: 14, lineHeight: 1.5, margin: "0 0 16px" },
  actionLink: {
    textDecoration: "none",
    color: "#1a6b3c",
    fontSize: 14,
    fontWeight: 700,
  },
  highlightLink: { color: "#1a6b3c" },
};
