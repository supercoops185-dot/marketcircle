import { useState, useEffect } from "react";
import { db, storage } from "../firebase/config";
import {
  collection, getDocs, addDoc, updateDoc, doc,
  query, orderBy, serverTimestamp, arrayUnion, arrayRemove
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Feed() {
  const { currentUser, userProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const snap = await getDocs(query(collection(db, "posts"), orderBy("createdAt", "desc")));
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handlePost() {
    if (!caption.trim() && !image) return;
    setPosting(true);
    try {
      let imageUrl = null;
      if (image) {
        const storageRef = ref(storage, `posts/${currentUser.uid}/${Date.now()}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(db, "posts"), {
        authorId: currentUser.uid,
        authorName: userProfile?.displayName || "User",
        authorRole: userProfile?.role || "CommunityMember",
        caption,
        imageUrl,
        likes: [],
        commentCount: 0,
        createdAt: serverTimestamp(),
      });
      setCaption("");
      setImage(null);
      setImagePreview(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Failed to post. Please try again.");
    }
    setPosting(false);
  }

  async function toggleLike(postId, currentLikes) {
    const liked = currentLikes?.includes(currentUser.uid);
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, {
      likes: liked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid),
    });
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: liked
                ? p.likes.filter((id) => id !== currentUser.uid)
                : [...(p.likes || []), currentUser.uid],
            }
          : p
      )
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <h1 style={styles.title}>Community Feed</h1>

        {/* Compose */}
        <div style={styles.compose}>
          <div style={styles.composeTop}>
            <div style={styles.composeAvatar}>
              {userProfile?.displayName?.[0] || "U"}
            </div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share something from the market..."
              style={styles.textarea}
              rows={3}
            />
          </div>
          {imagePreview && (
            <div style={styles.previewWrap}>
              <img src={imagePreview} alt="preview" style={styles.preview} />
              <button onClick={() => { setImage(null); setImagePreview(null); }} style={styles.removeImg}>✕</button>
            </div>
          )}
          <div style={styles.composeActions}>
            <label style={styles.imgBtn}>
              📷 Photo
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
            </label>
            <button onClick={handlePost} disabled={posting || (!caption.trim() && !image)} style={styles.postBtn}>
              {posting ? "Posting..." : "Post"}
            </button>
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div style={styles.loading}>Loading feed...</div>
        ) : posts.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyEmoji}>🌿</div>
            <p style={styles.emptyText}>No posts yet. Be the first to share!</p>
          </div>
        ) : (
          <div style={styles.posts}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} currentUser={currentUser} onLike={toggleLike} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, currentUser, onLike }) {
  const liked = post.likes?.includes(currentUser?.uid);

  function handleShare() {
    if (navigator.share) {
      navigator.share({ title: "MarketCircle Post", text: post.caption, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    }
  }

  return (
    <div style={styles.postCard}>
      <div style={styles.postHeader}>
        <div style={styles.postAvatar}>{post.authorName?.[0] || "U"}</div>
        <div>
          <p style={styles.postAuthor}>{post.authorName}</p>
          <p style={styles.postMeta}>
            <span style={styles.roleBadge(post.authorRole)}>{roleLabel(post.authorRole)}</span>
            {" · "}
            {post.createdAt?.toDate?.()?.toLocaleDateString() || ""}
          </p>
        </div>
      </div>
      {post.imageUrl && (
        <img src={post.imageUrl} alt="" style={styles.postImg} />
      )}
      {post.caption && <p style={styles.postCaption}>{post.caption}</p>}
      <div style={styles.postFooter}>
        <button
          onClick={() => onLike(post.id, post.likes)}
          style={{ ...styles.actionBtn, ...(liked ? styles.likedBtn : {}) }}
        >
          {liked ? "❤️" : "🤍"} {post.likes?.length || 0}
        </button>
        <button style={styles.actionBtn}>💬 {post.commentCount || 0}</button>
        <button onClick={handleShare} style={styles.actionBtn}>↗ Share</button>
      </div>
    </div>
  );
}

function roleLabel(role) {
  if (role === "Vendor") return "Vendor";
  if (role === "MarketOrganizer") return "Organizer";
  return "Member";
}

const styles = {
  page: { minHeight: "100vh", backgroundColor: "#fafaf8", fontFamily: "'DM Sans', sans-serif" },
  inner: { maxWidth: 640, margin: "0 auto", padding: "48px 24px" },
  title: { fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 24px", letterSpacing: "-0.5px" },
  compose: {
    backgroundColor: "#fff",
    borderRadius: 14,
    border: "1px solid #eee",
    padding: "20px",
    marginBottom: 28,
  },
  composeTop: { display: "flex", gap: 12, marginBottom: 12 },
  composeAvatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#1a6b3c",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 16,
    flexShrink: 0,
  },
  textarea: {
    flex: 1,
    border: "none",
    outline: "none",
    resize: "none",
    fontSize: 15,
    lineHeight: 1.5,
    color: "#333",
    fontFamily: "'DM Sans', sans-serif",
    backgroundColor: "transparent",
  },
  previewWrap: { position: "relative", marginBottom: 12 },
  preview: { width: "100%", borderRadius: 10, maxHeight: 300, objectFit: "cover" },
  removeImg: {
    position: "absolute",
    top: 8,
    right: 8,
    background: "rgba(0,0,0,0.5)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 28,
    height: 28,
    cursor: "pointer",
    fontSize: 14,
  },
  composeActions: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f0f0", paddingTop: 12 },
  imgBtn: {
    fontSize: 14,
    color: "#666",
    fontWeight: 600,
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #eee",
    fontFamily: "'DM Sans', sans-serif",
  },
  postBtn: {
    backgroundColor: "#1a6b3c",
    color: "#fff",
    border: "none",
    padding: "8px 20px",
    borderRadius: 8,
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  loading: { textAlign: "center", color: "#999", padding: 40 },
  empty: { textAlign: "center", padding: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { color: "#999", fontSize: 16 },
  posts: { display: "flex", flexDirection: "column", gap: 16 },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    border: "1px solid #eee",
    overflow: "hidden",
  },
  postHeader: { display: "flex", gap: 12, alignItems: "center", padding: "16px 16px 12px" },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#e8f5ee",
    color: "#1a6b3c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 16,
    flexShrink: 0,
  },
  postAuthor: { fontWeight: 700, color: "#1a1a1a", margin: "0 0 2px", fontSize: 15 },
  postMeta: { color: "#aaa", fontSize: 12, margin: 0 },
  roleBadge: (role) => ({
    display: "inline-block",
    backgroundColor: role === "Vendor" ? "#e8f5ee" : role === "MarketOrganizer" ? "#e8eeff" : "#f5f5f5",
    color: role === "Vendor" ? "#1a6b3c" : role === "MarketOrganizer" ? "#3b4fc8" : "#888",
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 6px",
    borderRadius: 4,
    textTransform: "uppercase",
  }),
  postImg: { width: "100%", maxHeight: 400, objectFit: "cover" },
  postCaption: { padding: "12px 16px", color: "#333", fontSize: 15, lineHeight: 1.6, margin: 0 },
  postFooter: {
    display: "flex",
    gap: 4,
    padding: "8px 12px 12px",
    borderTop: "1px solid #f5f5f5",
  },
  actionBtn: {
    background: "none",
    border: "none",
    color: "#888",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    padding: "6px 10px",
    borderRadius: 6,
    fontFamily: "'DM Sans', sans-serif",
  },
  likedBtn: { color: "#e74c3c" },
};
