import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateCommentComponent from "../CommentComponents/CreateCommentComponent";
import DeleteCommentComponent from "../CommentComponents/DeleteCommentComponent";
import EditCommentComponent from "../CommentComponents/EditCommentComponent";
import DeletePostComponent from "../PostComponents/DeletePostComponent";

const getImageUrl = (post) => {
  if (post?.img_id === null) return `${post.img_url}`;
  if (post?.img_id) return `${import.meta.env.VITE_API_IMG_URL}${post.image_path}`;
  return null;
};

const PostCardComponent = ({ post, communityId }) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const currentUserObj = storedUser ? JSON.parse(storedUser) : {};
  const currentUserId = currentUserObj.id;
  const currentUserRole = currentUserObj.role;

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/communities-post-comments/${communityId}/${post.id}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(response.data);
    } catch (err) {
      setError("Failed to load comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post.id, communityId]);

  const handleCommentCreated = (newComment) => {
    setComments([...comments, newComment]);
    setShowCommentInput(false);
    if (comments.length === 0) setCommentsVisible(true);
  };

  const toggleComments = () => {
    setCommentsVisible(!commentsVisible);
  };

  const handleCommentDeleted = (deletedCommentId) => {
    setComments(comments.filter((cmt) => cmt.id !== deletedCommentId));
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments(
      comments.map((cmt) =>
        cmt.id === updatedComment.id ? updatedComment : cmt
      )
    );
  };

  // 🔥 Updated Image Logic
  const imageSrc = getImageUrl(post);

  return (
    <div className="communitycard" style={{ marginBottom: "15px", textAlign: "center" }}>
      {/* <h3>{post.title || "Untitled Post"}</h3>
      <p>{post.content}</p> */}
      {imageSrc && (
        <a href={imageSrc} target="_blank" rel="noopener noreferrer">
          <img
            src={imageSrc}
            loading="lazy"                 // enables native lazy loading`
            alt="Post"
            // style={{
            //   maxWidth: "250px",
            //   height: "auto",
            //   borderRadius: "5px",
            // }}
            onError={(e) => {
              console.error("❌ Image failed to load:", imageSrc);
              e.target.style.display = "none";
            }}
          />
        </a>
      )}

      {comments.length > 0 && (
        <div style={{ textAlign: "center", margin: "10px 0" }}>
          <button className="btn" onClick={toggleComments}>
            {commentsVisible ? "Hide comments" : "View comments"}
          </button>
        </div>
      )}

      {/* <div style={{ marginTop: "10px", textAlign: "center" }}>
        <button
          className="btn"
          onClick={() => setShowCommentInput(!showCommentInput)}
        >
          {showCommentInput ? "Cancel" : "Add a comment"}
        </button>
      </div> */}

      {showCommentInput && (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <CreateCommentComponent
            apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/communities-post-comments/${communityId}/${post.id}/comment`}
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
            textAlign: "center",
          }}
        >
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((cmt) => (
              <div
                key={cmt.id}
                className="card"
                style={{ marginBottom: "10px", padding: "5px" }}
              >
                {editingCommentId === cmt.id ? (
                  <EditCommentComponent
                    apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/communities-post-comments/${communityId}/${post.id}`}
                    commentId={cmt.id}
                    initialText={cmt.comment}
                    onUpdate={(updatedComment) => {
                      handleCommentUpdated(updatedComment);
                      setEditingCommentId(null);
                    }}
                    onCancel={() => setEditingCommentId(null)}
                  />
                ) : (
                  <>
                    <p>{cmt.comment}</p>
                    <small className="comment-meta">
                      By {cmt.username || cmt.created_by} on{" "}
                      {new Date(cmt.created_at).toLocaleString()}
                    </small>
                    {cmt.created_by === currentUserId && (
                      <div style={{ marginTop: "5px" }}>
                        <button
                          className="btn"
                          onClick={() => setEditingCommentId(cmt.id)}
                          style={{ marginRight: "5px" }}
                        >
                          Edit
                        </button>
                        <DeleteCommentComponent
                          apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/communities-post-comments/${communityId}/${post.id}`}
                          commentId={cmt.id}
                          onDelete={handleCommentDeleted}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      {(post.user_id === currentUserId || currentUserRole === "admin") && (
        <div style={{ marginTop: "10px", textAlign: "center" }}>
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


