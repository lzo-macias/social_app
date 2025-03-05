import React, { useState } from "react";
import axios from "axios";

const CreateCommentComponent = ({ apiEndpoint, postId, onCommentCreated }) => {
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

      onCommentCreated(response.data); // ✅ Add new comment to state
      setCommentText("");
    } catch (err) {
      setError("Failed to create comment.");
      console.error("❌ Error creating comment:", err);
    }
  };

  return (
    <div className="text-box-container">
      <h4>Add a Comment</h4>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          required
        />
        <p>
          <button className="btn" type="submit">
            Post Comment
          </button>
        </p>
      </form>
    </div>
  );
};

export default CreateCommentComponent