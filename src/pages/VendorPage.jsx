import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc, collection, getDocs, addDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function VendorPage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVendor() {
      try {
        const docSnap = await getDoc(doc(db, "users", id));
        if (docSnap.exists()) setVendor({ id: docSnap.id, ...docSnap.data() });

        const postsSnap = await getDocs(
          query(collection(db, "posts"), where("authorId", "==", id))
        );
        setPosts(postsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        if (currentUser) {
          const alertSnap = await getDocs(
            query(collection(db, "alertSubscriptions"),
              where("userId", "==", currentUser.uid),
              where("vendorId", "==", id))
          );
          setFollowing(!alertSnap.empty);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchVendor();
  }, [id, currentUser]);

  async function toggleFollow() {
    if (!currentUser) return alert("Please log in to follow vendors.");
    if (following) {
      const alertSnap = await getDocs(
        query(collection(db, "alertSubscriptions"),
          where("userId", "==", currentUser.uid),
          where("vendorId", "==", id))
      );
      alertSnap.docs.forEach((d) => deleteDoc(d.ref));
      setFollowing(false);
    } else {
      await addDoc(collection(db, "alertSubscriptions"), {
        userId: currentUser.uid,
        vendorId: id,
        marketId: null,
        createdAt: serverTimestamp(),
      });
      setFollowing(true);
    }
  }

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!vendor || vendor.role !== "Vendor") return <div style={styles.loading}>Vendor not found.</div>;

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.avatar}>
              {vendor.photoURL ? (
                <img src={vendor.photoURL} alt={vendor.displayName} style={styles.avatarImg} />
              ) : (
                <span style={styles.avatarEmoji}>🏪</span>
              )}
            </div>
            <div>
              <div style={styles.nameRow}>
                <h1 style={styles.name}>{vendor.businessName || vendor.displayName}</h1>
                {vendor.featuredStatus && <span style={styles.featuredBadge}>⭐ Featured</span>}
              </div>
              <p style={styles.category}>🏷️ {vendor.vendorCategory || "Local Vendor"}</p>
              <p style={styles.location}>📍 {vendor.location || "South Florida"}</p>
              {vendor.bio && <p style={styles.bio}>{vendor.bio}</p>}
            </div>
          </div>
          <button
            onClick={toggleFollow}
            style={{ ...styles.followBtn, ...(following ? styles.followingBtn : {}) }}
          >
            {following ? "🔔 Following" : "🔔 Follow Vendor"}
          </button>
        </div>

        {/* Upcoming Locations */}
        {vendor.upcomingLocations && vendor.upcomingLocations.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Upcoming Locations</h2>
            <div style={styles.locationGrid}>
              {vendor.upcomingLocations.map((loc, i) => (
                <div key={i} style={styles.locationCard}>
                  <span style={styles.locationEmoji}>📍</span>
                  <div>
                    <p style={styles.locationName}>{loc.marketName}</p>
                    <p style={styles.locationDate}>{loc.date} · {loc.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Posts */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Posts</h2>
          {posts.length === 0 ? (
            <div style={styles.emptySection}>No posts yet.</div>
          ) : (
            <div style={styles.postsGrid}>
              {posts.map((post) => (
                <div key={post.id} style={styles.postCard}>
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt="" style={styles.postImage} />
                  )}
                  <div style={styles.postBody}>
                    <p style={styles.postCaption}>{post.caption}</p>
                    <p style={styles.postDate}>
                      {post.createdAt?.toDate?.()?.toLocaleDateString() || ""}
                    </p>
                    <div style={styles.postActions}>
                      <span style={styles.postAction}>❤️ {post.likes || 0}</span>
                      <span style={styles.postAction}>💬 {post.commentCount || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
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
  headerLeft: { display: "flex", gap: 20, alignItems: "flex-start" },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: "#e8f5ee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  avatarEmoji: { fontSize: 36 },
  nameRow: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 },
  name: { fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: 0, letterSpacing: "-0.5px" },
  featuredBadge: {
    backgroundColor: "#fff8e1",
    color: "#f59e0b",
    fontSize: 12,
    fontWeight: 700,
    padding: "4px 10px",
    borderRadius: 6,
  },
  category: { color: "#888", fontSize: 14, margin: "0 0 4px" },
  location: { color: "#888", fontSize: 14, margin: "0 0 10px" },
  bio: { color: "#555", fontSize: 15, lineHeight: 1.6, maxWidth: 480, margin: 0 },
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
  emptySection: { color: "#999", fontSize: 15, padding: "32px 0", textAlign: "center", borderTop: "1px solid #eee" },
  locationGrid: { display: "flex", flexDirection: "column", gap: 10 },
  locationCard: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: "14px 18px",
    border: "1px solid #eee",
  },
  locationEmoji: { fontSize: 20 },
  locationName: { fontWeight: 600, color: "#1a1a1a", margin: "0 0 2px", fontSize: 15 },
  locationDate: { color: "#888", fontSize: 13, margin: 0 },
  postsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    border: "1px solid #eee",
    overflow: "hidden",
  },
  postImage: { width: "100%", height: 180, objectFit: "cover" },
  postBody: { padding: "14px 16px" },
  postCaption: { color: "#333", fontSize: 14, lineHeight: 1.5, margin: "0 0 8px" },
  postDate: { color: "#bbb", fontSize: 12, margin: "0 0 10px" },
  postActions: { display: "flex", gap: 16 },
  postAction: { color: "#888", fontSize: 13, fontWeight: 600 },
};
