import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EditPostComponent from "./EditPostComponent"; // Import Edit Component
import DeletePostComponent from "./DeletePostComponent";
import CreateCommentComponent from "../CommentComponents/CreateCommentComponent";
import EditCommentComponent from "../CommentComponents/EditCommentComponent";
import DeleteCommentComponent from "../CommentComponents/DeleteCommentComponent";

const SinglePostComponent = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:5000/api/personal-post/post/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("🚀 Debug: Received Post Data", response.data); // ✅ Ensure img_url exists
        setPost(response.data);

        const commentsResponse = await axios.get(
          `http://localhost:5000/api/personal-post-comments/${postId}/comments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments(
          Array.isArray(commentsResponse.data) ? commentsResponse.data : []
        );
      } catch (err) {
        console.error("❌ Error fetching post or comments:", err);
        setError("Failed to fetch post or comments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const handleUpdateSuccess = (updatedContent) => {
    setPost((prevPost) => ({ ...prevPost, content: updatedContent }));
    setIsEditing(false);
  };

  const handleDeleteSuccess = () => {
    if (post?.user_id) {
      navigate(`/album/${post.user_id}`);
    } else {
      navigate(`/album`);
    }
  };

  const handleCommentCreated = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  };

  const handleCommentUpdated = (updatedComment) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
    setEditingCommentId(null);
  };

  const handleCommentDeleted = (commentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>No post found.</p>;

  return (
    <div className="single-page-post">
      <h2>Post Details</h2>
      {isEditing ? (
        <EditPostComponent
          postId={postId}
          initialContent={post.content}
          onUpdateSuccess={handleUpdateSuccess}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <p>
            <strong>Content:</strong> {post.content}
          </p>

          {/* ✅ Ensure img_url is displayed properly */}
          {post?.img_url ? (
            <p>
              <strong>Image:</strong> <br />
              <img
                src={post.img_url} // ✅ Directly use img_url
                alt="Post"
                style={{ maxWidth: "300px" }}
                onError={(e) => {
                  console.error("❌ Image failed to load:", post.img_url);
                  e.target.style.display = "none"; // Hide broken images
                }}
              />
            </p>
          ) : (
            <p>No image available.</p>
          )}

          <p>
            <small>
              Created at: {new Date(post.created_at).toLocaleString()}
            </small>
          </p>

          <DeletePostComponent
            postId={postId}
            onDeleteSuccess={handleDeleteSuccess}
          />
          <button className="btn" onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}

      <h3>Comments</h3>
      <CreateCommentComponent
        apiEndpoint={`http://localhost:5000/api/personal-post-comments/${postId}/comment`}
        postId={postId}
        onCommentCreated={handleCommentCreated}
      />

      {/* 🔹 Display Comments */}
      <ul className="comments-container">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id} className="border p-2 my-2">
              {editingCommentId === comment.id ? (
                <EditCommentComponent
                  apiEndpoint={`http://localhost:5000/api/personal-post-comments/${postId}`}
                  commentId={comment.id}
                  initialText={comment.comment}
                  onUpdate={(updatedComment) =>
                    handleCommentUpdated(updatedComment)
                  }
                />
              ) : (
                <>
                  <p>{comment.comment}</p>
                  <small className="comment-meta">
                    By {comment.username || "Unknown"} at{" "}
                    {new Date(comment.created_at).toLocaleString()}
                  </small>
                  <br />
                  <button className="btn" onClick={() => setEditingCommentId(comment.id)}>
                    Edit
                  </button>
                  <DeleteCommentComponent
                    apiEndpoint={`http://localhost:5000/api/personal-post-comments/${postId}`}
                    commentId={comment.id}
                    onDelete={() => handleCommentDeleted(comment.id)}
                  />
                </>
              )}
            </li>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </ul>
    </div>
  );
};

export default SinglePostComponent;
