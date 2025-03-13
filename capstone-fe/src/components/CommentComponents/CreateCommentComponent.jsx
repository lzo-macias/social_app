// CreateCommentComponent.jsx
import React, { useState } from "react";
import axios from "axios";

const CreateCommentComponent = ({
  apiEndpoint,
  postId,
  onCommentCreated,
  onCancel,
}) => {
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        apiEndpoint,
        { comment: commentText, post_id: postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCommentCreated(response.data);
      setCommentText("");
      if (onCancel) onCancel(); // Hide the comment form after posting
    } catch (err) {
      setError("Failed to create comment.");
      console.error("❌ Error creating comment:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", margin: "20px 0" }}>
      <h4>Add a Comment</h4>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "block",
          margin: "0 auto",
          maxWidth: "500px",
        }}
      >
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontFamily: "inherit",
            fontSize: "inherit",
            resize: "vertical",
          }}
        />
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button type="submit" className="btn">
            Post Comment
          </button>
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommentComponent;
