import React, { useState } from "react";
import axios from "axios";

const DeletePostComponent = ({ postId, onDeleteSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/personal-post/post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Post deleted successfully!");
      onDeleteSuccess(postId); // Notify parent component to remove the post from the UI
    } catch (err) {
      console.error("❌ Error deleting post:", err);
      setError("Failed to delete post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleDelete} disabled={loading} className="btn">
        {loading ? "Deleting..." : "Delete"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DeletePostComponent;
