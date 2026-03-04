import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const snap = await getDoc(doc(db, "users", id));
      if (snap.exists()) setProfile({ id: snap.id, ...snap.data() });
      setLoading(false);
    }
    fetchProfile();
  }, [id]);

  if (loading) return <div style={styles.loading}>Loading...</div>;
  if (!profile) return <div style={styles.loading}>User not found.</div>;

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <div style={styles.card}>
          <div style={styles.avatar}>{profile.displayName?.[0] || "U"}</div>
          <h1 style={styles.name}>{profile.displayName}</h1>
          <span style={styles.role}>{profile.role === "Vendor" ? "🏪 Vendor" : profile.role === "MarketOrganizer" ? "🗺️ Organizer" : "🌿 Community Member"}</span>
          {profile.bio && <p style={styles.bio}>{profile.bio}</p>}
          <p style={styles.location}>📍 {profile.location || "South Florida"}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#fafaf8", fontFamily: "'DM Sans', sans-serif" },
  inner: { maxWidth: 600, margin: "0 auto", padding: "48px 24px" },
  loading: { textAlign: "center", padding: 80, color: "#999", fontFamily: "'DM Sans', sans-serif" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: "48px 32px", border: "1px solid #eee", textAlign: "center" },
  avatar: { width: 80, height: 80, borderRadius: "50%", backgroundColor: "#1a6b3c", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, margin: "0 auto 16px" },
  name: { fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" },
  role: { display: "inline-block", backgroundColor: "#e8f5ee", color: "#1a6b3c", fontSize: 13, fontWeight: 600, padding: "5px 12px", borderRadius: 20, marginBottom: 16 },
  bio: { color: "#555", fontSize: 15, lineHeight: 1.6, margin: "0 0 12px" },
  location: { color: "#999", fontSize: 14, margin: 0 },
};
