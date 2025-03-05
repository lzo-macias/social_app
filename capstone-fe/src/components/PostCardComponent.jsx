// PostCardComponent.jsx
import React, { useState } from "react";
import axios from "axios";
import CreateCommentComponent from "./CommentComponents/CreateCommentComponent";
import DeleteCommentComponent from "./CommentComponents/DeleteCommentComponent";
import DeletePostComponent from "./PostComponents/DeletePostComponent";

const PostCardComponent = ({ post, communityId }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const currentUserObj = storedUser ? JSON.parse(storedUser) : {};
  const currentUserId = currentUserObj.id;
  const currentUserRole = currentUserObj.role; // assume role is stored (e.g., "admin")

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/communities-post-comments/${communityId}/${post.id}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(response.data);
    } catch (err) {
      setError("Failed to load comments");
    }
  };

  const toggleComments = async () => {
    if (!commentsVisible) await fetchComments();
    setCommentsVisible(!commentsVisible);
  };

  const handleCommentCreated = (newComment) => {
    setComments([...comments, newComment]);
    if (!commentsVisible) setCommentsVisible(true);
  };

  const handleCommentDeleted = (deletedCommentId) => {
    setComments(comments.filter((cmt) => cmt.id !== deletedCommentId));
  };

  // Determine which image source to use:
  const imageSrc = post.img_url
    ? post.img_url
    : post.img_id
    ? `${import.meta.env.VITE_API_BASE_URL}/images/${post.img_id}`
    : null;

  return (
    <div className="card" style={{ marginBottom: "15px" }}>
      <h3>{post.title || "Untitled Post"}</h3>
      <p>{post.content}</p>
      {imageSrc && (
        <img
          src={imageSrc}
          alt="Post"
          style={{
            maxWidth: "100px",
            height: "auto",
            borderRadius: "5px",
          }}
          onError={(e) => {
            console.error("Image failed to load:", imageSrc);
            e.target.style.display = "none";
          }}
        />
      )}
      <div style={{ marginTop: "10px" }}>
        <button
          className="btn"
          onClick={() => setShowCommentInput(!showCommentInput)}
        >
          {showCommentInput ? "Cancel" : "Add a comment"}
        </button>
        {(comments.length > 0 || commentsVisible) && (
          <button
            className="btn"
            onClick={toggleComments}
            style={{ marginLeft: "10px" }}
          >
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
              <div
                key={cmt.id}
                className="card"
                style={{ marginBottom: "10px" }}
              >
                <p>{cmt.comment}</p>
                <small className="comment-meta">
                  By {cmt.username || cmt.created_by} on{" "}
                  {new Date(cmt.created_at).toLocaleString()}
                </small>
                {cmt.created_by === currentUserId && (
                  <DeleteCommentComponent
                    apiEndpoint={`${
                      import.meta.env.VITE_API_BASE_URL
                    }/communities-post-comments/${communityId}/${post.id}`}
                    commentId={cmt.id}
                    onDelete={handleCommentDeleted}
                  />
                )}
              </div>
            ))
          )}
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      {/* Delete Post button: show if current user is the creator or admin */}
      {(post.user_id === currentUserId || currentUserRole === "admin") && (
        <div style={{ marginTop: "10px" }}>
          <DeletePostComponent
            postId={post.id}
            onDeleteSuccess={() => window.location.reload()}
          />
        </div>
      )}
    </div>
  );
};

export default PostCardComponent;
