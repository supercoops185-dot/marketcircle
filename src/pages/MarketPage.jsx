import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc, collection, getDocs, addDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function MarketPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [market, setMarket] = useState(null);
  const [events, setEvents] = useState([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rsvpd, setRsvpd] = useState({});

  useEffect(() => {
    async function fetchMarket() {
      try {
        const docSnap = await getDoc(doc(db, "markets", id));
        if (docSnap.exists()) setMarket({ id: docSnap.id, ...docSnap.data() });

        const eventsSnap = await getDocs(
          query(collection(db, "events"), where("marketId", "==", id))
        );
        setEvents(eventsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        if (currentUser) {
          const alertSnap = await getDocs(
            query(collection(db, "alertSubscriptions"),
              where("userId", "==", currentUser.uid),
              where("marketId", "==", id))
          );
          setFollowing(!alertSnap.empty);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchMarket();
  }, [id, currentUser]);

  async function toggleFollow() {
    if (!currentUser) return alert("Please log in to follow markets.");
    if (following) {
      const alertSnap = await getDocs(
        query(collection(db, "alertSubscriptions"),
          where("userId", "==", currentUser.uid),
          where("marketId", "==", id))
      );
      alertSnap.docs.forEach((d) => deleteDoc(d.ref));
      setFollowing(false);
    } else {
      await addDoc(collection(db, "alertSubscriptions"), {
        userId: currentUser.uid,
        marketId: id,
        vendorId: null,
        createdAt: serverTimestamp(),
      });
      setFollowing(true);
    }
  }

  async function toggleRsvp(eventId) {
    if (!currentUser) return alert("Please log in to RSVP.");
    const rsvpSnap = await getDocs(
      query(collection(db, "rsvps"),
        where("userId", "==", currentUser.uid),
        where("eventId", "==", eventId))
    );
    if (!rsvpSnap.empty) {
      rsvpSnap.docs.forEach((d) => deleteDoc(d.ref));
      setRsvpd((prev) => ({ ...prev, [eventId]: false }));
    } else {
      await addDoc(collection(db, "rsvps"), {
        userId: currentUser.uid,
        eventId,
        marketId: id,
        createdAt: serverTimestamp(),
      });
      setRsvpd((prev) => ({ ...prev, [eventId]: true }));
    }
  }

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!market) return <div style={styles.loading}>Market not found.</div>;

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.headerTop}>
              <h1 style={styles.title}>{market.name}</h1>
              {market.featuredStatus && <span style={styles.featuredBadge}>⭐ Featured</span>}
            </div>
            <p style={styles.location}>📍 {market.location || "South Florida"}</p>
            <p style={styles.schedule}>📅 {market.schedule || "See events below"}</p>
            {market.description && <p style={styles.desc}>{market.description}</p>}
          </div>
          <button
            onClick={toggleFollow}
            style={{ ...styles.followBtn, ...(following ? styles.followingBtn : {}) }}
          >
            {following ? "🔔 Following" : "🔔 Follow Market"}
          </button>
        </div>

        {/* Events */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Upcoming Events</h2>
          {events.length === 0 ? (
            <div style={styles.emptySection}>No upcoming events posted yet.</div>
          ) : (
            <div style={styles.eventGrid}>
              {events.map((event) => (
                <div key={event.id} style={styles.eventCard}>
                  <div style={styles.eventDate}>
                    <span style={styles.eventDay}>
                      {event.date ? new Date(event.date).toLocaleDateString("en-US", { day: "numeric" }) : "?"}
                    </span>
                    <span style={styles.eventMonth}>
                      {event.date ? new Date(event.date).toLocaleDateString("en-US", { month: "short" }) : ""}
                    </span>
                  </div>
                  <div style={styles.eventInfo}>
                    <h3 style={styles.eventName}>{event.name || "Market Day"}</h3>
                    <p style={styles.eventTime}>⏰ {event.time || "TBD"}</p>
                    {event.description && <p style={styles.eventDesc}>{event.description}</p>}
                  </div>
                  <button
                    onClick={() => toggleRsvp(event.id)}
                    style={{ ...styles.rsvpBtn, ...(rsvpd[event.id] ? styles.rsvpdBtn : {}) }}
                  >
                    {rsvpd[event.id] ? "✓ RSVP'd" : "RSVP"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Announcements */}
        {market.announcements && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Announcements</h2>
            <div style={styles.announcement}>{market.announcements}</div>
          </section>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#fafaf8", fontFamily: "'DM Sans', sans-serif" },
  inner: { maxWidth: 900, margin: "0 auto", padding: "48px 24px" },
  loading: { textAlign: "center", padding: 80, color: "#999", fontFamily: "'DM Sans', sans-serif" },
  header: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: "32px",
    marginBottom: 32,
    border: "1px solid #eee",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: 20,
  },
  headerTop: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  title: { fontSize: 32, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px", letterSpacing: "-0.5px" },
  featuredBadge: {
    backgroundColor: "#fff8e1",
    color: "#f59e0b",
    fontSize: 12,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 6,
  },
  location: { color: "#666", fontSize: 15, margin: "0 0 4px" },
  schedule: { color: "#666", fontSize: 15, margin: "0 0 12px" },
  desc: { color: "#555", fontSize: 15, lineHeight: 1.6, maxWidth: 560, margin: 0 },
  followBtn: {
    padding: "10px 20px",
    borderRadius: 8,
    border: "2px solid #1a6b3c",
    backgroundColor: "#fff",
    color: "#1a6b3c",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    whiteSpace: "nowrap",
  },
  followingBtn: { backgroundColor: "#1a6b3c", color: "#fff" },
  section: { marginBottom: 36 },
  sectionTitle: { fontSize: 22, fontWeight: 700, color: "#1a1a1a", margin: "0 0 16px" },
  emptySection: {
    color: "#999",
    fontSize: 15,
    padding: "32px 0",
    textAlign: "center",
    borderTop: "1px solid #eee",
  },
  eventGrid: { display: "flex", flexDirection: "column", gap: 12 },
  eventCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: "20px 24px",
    border: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
  },
  eventDate: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#e8f5ee",
    borderRadius: 10,
    padding: "10px 14px",
    minWidth: 50,
  },
  eventDay: { fontSize: 22, fontWeight: 800, color: "#1a6b3c", lineHeight: 1 },
  eventMonth: { fontSize: 12, fontWeight: 600, color: "#1a6b3c", textTransform: "uppercase" },
  eventInfo: { flex: 1 },
  eventName: { fontWeight: 700, fontSize: 17, color: "#1a1a1a", margin: "0 0 4px" },
  eventTime: { color: "#888", fontSize: 13, margin: "0 0 4px" },
  eventDesc: { color: "#666", fontSize: 14, margin: 0 },
  rsvpBtn: {
    padding: "8px 18px",
    borderRadius: 8,
    border: "2px solid #1a6b3c",
    backgroundColor: "#fff",
    color: "#1a6b3c",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  rsvpdBtn: { backgroundColor: "#1a6b3c", color: "#fff" },
  announcement: {
    backgroundColor: "#fffbf0",
    border: "1px solid #fde68a",
    borderRadius: 10,
    padding: "16px 20px",
    color: "#555",
    fontSize: 15,
    lineHeight: 1.6,
  },
};
