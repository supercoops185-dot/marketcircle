import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import { addDoc, collection, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function ApplyVendor() {
  const { currentUser, fetchUserProfile } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ businessName: "", category: "", description: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = ["Produce", "Baked Goods", "Coffee & Drinks", "Meat & Seafood", "Dairy", "Crafts & Art", "Plants & Flowers", "Prepared Food", "Other"];

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "roleApplications"), {
        userId: currentUser.uid,
        applicationType: "Vendor",
        status: "pending",
        ...form,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "users", currentUser.uid), {
        role: "Vendor",
        roleStatus: "pending",
        businessName: form.businessName,
        vendorCategory: form.category,
        bio: form.description,
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
          <p style={styles.successText}>Your vendor application is under review. We'll notify you once it's approved.</p>
          <button onClick={() => navigate("/dashboard")} style={styles.btn}>Go to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Apply as a Vendor</h1>
        <p style={styles.subtitle}>Join MarketCircle as a local market vendor and grow your visibility in South Florida.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Business Name *</label>
            <input
              value={form.businessName}
              onChange={(e) => setForm({ ...form, businessName: e.target.value })}
              style={styles.input}
              placeholder="Your business name"
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Category *</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={styles.input}
              required
            >
              <option value="">Select a category</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>About Your Business *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ ...styles.input, minHeight: 100, resize: "vertical" }}
              placeholder="Tell us about what you sell..."
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Website / Instagram (optional)</label>
            <input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              style={styles.input}
              placeholder="https://..."
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
