import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase/config";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

export default function Discover() {
  const [markets, setMarkets] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [tab, setTab] = useState("markets");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const marketsSnap = await getDocs(collection(db, "markets"));
        const vendorsSnap = await getDocs(
          query(collection(db, "users"), where("role", "==", "Vendor"), where("roleStatus", "==", "active"))
        );
        setMarkets(marketsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setVendors(vendorsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredMarkets = markets.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.location?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredVendors = vendors.filter((v) =>
    v.displayName?.toLowerCase().includes(search.toLowerCase()) ||
    v.vendorCategory?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <h1 style={styles.title}>Discover</h1>
        <p style={styles.subtitle}>Find markets and vendors near South Florida</p>

        {/* Search */}
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search markets or vendors..."
            style={styles.searchInput}
          />
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{ ...styles.tab, ...(tab === "markets" ? styles.activeTab : {}) }}
            onClick={() => setTab("markets")}
          >
            🗺️ Markets ({filteredMarkets.length})
          </button>
          <button
            style={{ ...styles.tab, ...(tab === "vendors" ? styles.activeTab : {}) }}
            onClick={() => setTab("vendors")}
          >
            🏪 Vendors ({filteredVendors.length})
          </button>
        </div>

        {loading ? (
          <div style={styles.empty}>Loading...</div>
        ) : tab === "markets" ? (
          filteredMarkets.length === 0 ? (
            <EmptyState type="markets" />
          ) : (
            <div style={styles.grid}>
              {filteredMarkets.map((m) => (
                <MarketCard key={m.id} market={m} />
              ))}
            </div>
          )
        ) : filteredVendors.length === 0 ? (
          <EmptyState type="vendors" />
        ) : (
          <div style={styles.grid}>
            {filteredVendors.map((v) => (
              <VendorCard key={v.id} vendor={v} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MarketCard({ market }) {
  return (
    <Link to={`/market/${market.id}`} style={styles.card}>
      <div style={styles.cardEmoji}>🗺️</div>
      {market.featuredStatus && <span style={styles.featuredBadge}>⭐ Featured</span>}
      <h3 style={styles.cardTitle}>{market.name || "Unnamed Market"}</h3>
      <p style={styles.cardMeta}>📍 {market.location || "South Florida"}</p>
      <p style={styles.cardMeta}>📅 {market.schedule || "See page for dates"}</p>
      <p style={styles.cardDesc}>{market.description?.slice(0, 80) || "Local farmers market"}...</p>
    </Link>
  );
}

function VendorCard({ vendor }) {
  return (
    <Link to={`/vendor/${vendor.id}`} style={styles.card}>
      <div style={styles.cardEmoji}>🏪</div>
      {vendor.featuredStatus && <span style={styles.featuredBadge}>⭐ Featured</span>}
      <h3 style={styles.cardTitle}>{vendor.businessName || vendor.displayName}</h3>
      <p style={styles.cardMeta}>🏷️ {vendor.vendorCategory || "Local Vendor"}</p>
      <p style={styles.cardDesc}>{vendor.bio?.slice(0, 80) || "Local vendor"}...</p>
    </Link>
  );
}

function EmptyState({ type }) {
  return (
    <div style={styles.emptyState}>
      <div style={styles.emptyEmoji}>{type === "markets" ? "🗺️" : "🏪"}</div>
      <h3 style={styles.emptyTitle}>No {type} yet</h3>
      <p style={styles.emptyText}>
        {type === "markets"
          ? "Market organizers will appear here once they join."
          : "Vendors will appear here once they join and are approved."}
      </p>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#fafaf8", fontFamily: "'DM Sans', sans-serif" },
  inner: { maxWidth: 1100, margin: "0 auto", padding: "48px 24px" },
  title: { fontSize: 36, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px", letterSpacing: "-0.5px" },
  subtitle: { color: "#888", fontSize: 16, margin: "0 0 28px" },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: "10px 16px",
    marginBottom: 28,
    maxWidth: 480,
  },
  searchIcon: { fontSize: 16 },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: 15,
    width: "100%",
    fontFamily: "'DM Sans', sans-serif",
    backgroundColor: "transparent",
  },
  tabs: { display: "flex", gap: 12, marginBottom: 32 },
  tab: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "1px solid #ddd",
    background: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    color: "#555",
    fontFamily: "'DM Sans', sans-serif",
  },
  activeTab: {
    backgroundColor: "#1a6b3c",
    color: "#fff",
    border: "1px solid #1a6b3c",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },
  card: {
    textDecoration: "none",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: "24px 20px",
    border: "1px solid #eee",
    boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
    transition: "box-shadow 0.2s, transform 0.2s",
    position: "relative",
    display: "block",
  },
  cardEmoji: { fontSize: 32, marginBottom: 12 },
  featuredBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#fff8e1",
    color: "#f59e0b",
    fontSize: 11,
    fontWeight: 700,
    padding: "3px 8px",
    borderRadius: 6,
  },
  cardTitle: { fontWeight: 700, fontSize: 17, color: "#1a1a1a", margin: "0 0 8px" },
  cardMeta: { color: "#888", fontSize: 13, margin: "0 0 4px" },
  cardDesc: { color: "#555", fontSize: 14, lineHeight: 1.5, margin: "8px 0 0" },
  empty: { textAlign: "center", color: "#999", padding: 60 },
  emptyState: { textAlign: "center", padding: "80px 24px" },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: 700, color: "#333", margin: "0 0 10px" },
  emptyText: { color: "#888", fontSize: 15 },
};
