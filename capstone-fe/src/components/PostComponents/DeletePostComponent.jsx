import React, { useState } from "react";
import axios from "axios";

const DeleteButton = ({ postId, endpoint, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${endpoint}/${postId}`, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(`Post ${postId} deleted`);
      onSuccess && onSuccess(postId);
    } catch (err) {
      console.error("Error deleting post:", err);
      setError("Failed to delete post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleDelete} 
        disabled={loading} 
        style={{ backgroundColor: "red", color: "white", padding: "8px", cursor: "pointer" }}
      >
        {loading ? "Deleting..." : "Delete Post"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DeleteButton;