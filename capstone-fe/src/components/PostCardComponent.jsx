// PostCardComponent.jsx
import React, { useState } from "react";
import axios from "axios";
import CreateCommentComponent from "./CommentComponents/CreateCommentComponent";

const PostCardComponent = ({ post, communityId }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch comments from the backend
  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/communities-post-comments/${communityId}/${post.id}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(response.data);
      console.log("Fetched comments:", response.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setError("Failed to load comments");
    }
  };

  // Toggle display of comments
  const toggleComments = async () => {
    if (!commentsVisible) {
      await fetchComments();
    }
    setCommentsVisible(!commentsVisible);
  };

  // When a comment is created, re-fetch the comments so that the new comment
  // includes all fields (including username and valid date)
  const handleCommentCreated = async (newComment) => {
    await fetchComments();
    setCommentsVisible(true);
  };

  return (
    <div
      className="post-card"
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "15px",
      }}
    >
      <h3>{post.title || "Untitled Post"}</h3>
      <p>{post.content}</p>
      {post.img_id && (
        <img
          src={`${import.meta.env.VITE_API_BASE_URL}/images/${post.img_id}`}
          alt="Post visual"
          style={{ maxWidth: "100%" }}
        />
      )}

      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setShowCommentInput(!showCommentInput)}>
          {showCommentInput ? "Cancel" : "Add a comment"}
        </button>
        {(comments.length > 0 || commentsVisible) && (
          <button onClick={toggleComments} style={{ marginLeft: "10px" }}>
            {commentsVisible ? "Hide comments" : "View comments"}
          </button>
        )}
      </div>

      {showCommentInput && (
        <div style={{ marginTop: "10px" }}>
          <CreateCommentComponent
            apiEndpoint={`${
              import.meta.env.VITE_API_BASE_URL
            }/communities-post-comments/${communityId}/${post.id}/comment`}
            postId={post.id}
            onCommentCreated={handleCommentCreated}
          />
        </div>
      )}

      {commentsVisible && (
        <div
          style={{
            marginTop: "10px",
            borderTop: "1px solid #ddd",
            paddingTop: "10px",
          }}
        >
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((cmt) => (
              <div key={cmt.id} style={{ marginBottom: "10px" }}>
                <p>{cmt.comment}</p>
                <small>
                  By {cmt.username} on{" "}
                  {new Date(cmt.created_at).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default PostCardComponent;
