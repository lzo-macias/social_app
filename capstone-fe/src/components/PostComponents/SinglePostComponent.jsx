import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EditPostComponent from "./EditPostComponent";
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
          `${import.meta.env.VITE_API_BASE_URL}/personal-post/post/${postId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPost(response.data);

        const commentsResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/personal-post-comments/${postId}/comments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setComments(Array.isArray(commentsResponse.data) ? commentsResponse.data : []);
      } catch (err) {
        setError("Failed to fetch post or comments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [postId]);

  const getImageUrl = () => {
    if (post?.img_id === null) 
      return `${post.img_url}`;
    if (post?.img_id) 
      return `${import.meta.env.VITE_API_IMG_URL}${post.image_path}`;
    return null;
  };

  // const getImageUrl = () => {
  //   return post?.img_url || (post?.img_id && `${import.meta.env.VITE_API_IMG_URL}${post.image_path}`) || null;
  // };

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>No post found.</p>;

  return (
    <div className="single-post-detail-container">
      <h2>Post Details</h2>
      {isEditing ? (
        <EditPostComponent
          postId={postId}
          initialContent={post.content}
          onUpdateSuccess={(updatedContent) => {
            setPost((prevPost) => ({ ...prevPost, content: updatedContent }));
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <p>
            <strong>Content:</strong> {post.content}
          </p>

          {/* ✅ Display Image Logic */}
          {getImageUrl() ? (
            <p>
              <strong>Image:</strong> <br />
              <img
                src={getImageUrl()}
                alt="Post"
                style={{ maxWidth: "300px" }}
                onError={(e) => {
                  console.error("❌ Image failed to load:", getImageUrl());
                  e.target.style.display = "none";
                }}
              />
            </p>
          ) : (
            <p>No image available.</p>
          )}

          <p>
            <small>Created at: {new Date(post.created_at).toLocaleString()}</small>
          </p>

          <div className="single-post-detail-post-btn-container">
            <button className="btn" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <DeletePostComponent
              postId={postId}
              onDeleteSuccess={() => navigate("/")}
            />
          </div>
        </>
      )}

      <h3>Comments</h3>
      <ul className="comments-container">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id} className="single-post-comments">
              {editingCommentId === comment.id ? (
                <EditCommentComponent
                  apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/personal-post-comments/${postId}`}
                  commentId={comment.id}
                  initialText={comment.comment}
                  onUpdate={(updatedComment) => {
                    setComments((prevComments) =>
                      prevComments.map((comment) =>
                        comment.id === updatedComment.id ? updatedComment : comment
                      )
                    );
                    setEditingCommentId(null);
                  }}
                />
              ) : (
                <>
                  <p>{comment.comment}</p>
                  <small className="comment-meta">
                    By {comment.username || "Unknown"} at {new Date(comment.created_at).toLocaleString()}
                  </small>
                </>
              )}
            </li>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </ul>
      <CreateCommentComponent
        apiEndpoint={`${import.meta.env.VITE_API_BASE_URL}/personal-post-comments/${postId}/comment`}
        postId={postId}
        onCommentCreated={(newComment) => setComments((prevComments) => [...prevComments, newComment])}
      />
    </div>
  );
};

export default SinglePostComponent;
