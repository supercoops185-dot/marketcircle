import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { addDoc, collection, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function ApplyOrganizer() {
  const { currentUser, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ marketName: "", location: "", schedule: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      // Create role application
      await addDoc(collection(db, "roleApplications"), {
        userId: currentUser.uid,
        applicationType: "MarketOrganizer",
        status: "pending",
        ...form,
        createdAt: serverTimestamp(),
      });
      // Update user role to pending
      await updateDoc(doc(db, "users", currentUser.uid), {
        role: "MarketOrganizer",
        roleStatus: "pending",
      });
      // Create market page draft
      await addDoc(collection(db, "markets"), {
        organizerId: currentUser.uid,
        name: form.marketName,
        location: form.location,
        schedule: form.schedule,
        description: form.description,
        status: "pending",
        featuredStatus: false,
        createdAt: serverTimestamp(),
      });
      await fetchUserProfile(currentUser.uid);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please try again.");
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successEmoji}>🎉</div>
          <h1 style={styles.successTitle}>Application Submitted!</h1>
          <p style={styles.successText}>Your market organizer application is under review. We'll notify you once it's approved and your market page is live.</p>
          <button onClick={() => navigate("/dashboard")} style={styles.btn}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Apply as a Market Organizer</h1>
        <p style={styles.subtitle}>Create your market page and start connecting with your community on MarketCircle.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Market Name *</label>
            <input
              value={form.marketName}
              onChange={(e) => setForm({ ...form, marketName: e.target.value })}
              style={styles.input}
              placeholder="e.g. Sunrise Farmers Market"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Location *</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              style={styles.input}
              placeholder="e.g. Boca Raton, FL"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Schedule *</label>
            <input
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
              style={styles.input}
              placeholder="e.g. Every Saturday, 8am–1pm"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>About Your Market *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ ...styles.input, minHeight: 100, resize: "vertical" }}
              placeholder="Describe your market, what vendors attend, what makes it special..."
              required
            />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#fafaf8", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans', sans-serif" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: "48px 40px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", width: "100%", maxWidth: 480 },
  title: { fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px", letterSpacing: "-0.5px" },
  subtitle: { color: "#888", fontSize: 15, margin: "0 0 28px", lineHeight: 1.5 },
  form: { display: "flex", flexDirection: "column", gap: 18 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 600, color: "#333" },
  input: { padding: "12px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 15, outline: "none", fontFamily: "'DM Sans', sans-serif", width: "100%", boxSizing: "border-box" },
  btn: { backgroundColor: "#1a6b3c", color: "#fff", border: "none", padding: "14px", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 4, fontFamily: "'DM Sans', sans-serif" },
  successCard: { textAlign: "center", backgroundColor: "#fff", borderRadius: 16, padding: "60px 40px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", maxWidth: 420, width: "100%" },
  successEmoji: { fontSize: 56, marginBottom: 16 },
  successTitle: { fontSize: 26, fontWeight: 800, color: "#1a1a1a", margin: "0 0 12px" },
  successText: { color: "#777", fontSize: 15, lineHeight: 1.6, margin: "0 0 28px" },
};
