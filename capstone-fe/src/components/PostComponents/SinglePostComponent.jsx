import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EditPostComponent from "./EditPostComponent"; // Import Edit Component
import DeletePostComponent from "./DeletePostComponent";
import CreateCommentComponent from "../CommentComponents/CreateCommentComponent";
import EditCommentForm from "../CommentComponents/EditCommentComponent";
import DeleteCommentComponent from "../CommentComponents/DeleteCommentComponent";

const SinglePostComponent = () => {
  const { postId } = useParams();
  const navigate = useNavigate(); // ✅ Navigate after deletion
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
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
        setPost(response.data);

        const commentsResponse = await axios.get(
          `http://localhost:5000/api/personal-post/${postId}/comments`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setComments(commentsResponse.data);

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
      navigate(`/album/${post.user_id}`); // ✅ Redirect with userId
    } else {
      navigate(`/album`); // Fallback if user_id is missing
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
    <div>
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
          {post.img_id && (
            <p>
              <strong>Image:</strong> <br />
              <img
                src={`http://localhost:5000/uploads/${post.img_id}`}
                alt="Post"
                style={{ maxWidth: "300px" }}
              />
            </p>
          )}
          <p>
            <small>
              Created at: {new Date(post.created_at).toLocaleString()}
            </small>
          </p>
          {/* ✅ Delete Post Button */}
          <DeletePostComponent
            postId={postId}
            onDeleteSuccess={handleDeleteSuccess}
          />
          <button onClick={() => setIsEditing(true)}>Edit</button>
        </>
      )}
      <h3>Comments</h3>
      <CreateCommentComponent
        apiEndpoint="http://localhost:5000/api/comments"
        postId={postId}
        onCommentCreated={handleCommentCreated}
      />

      {/* 🔹 Display Comments */}
      <ul>
        {comments.map((comment) => (
          <li key={comment.id} className="border p-2 my-2">
            {editingCommentId === comment.id ? (
              <EditCommentForm
                apiEndpoint="http://localhost:5000/api/comments"
                commentId={comment.id}
                initialText={comment.text}
                onUpdate={() => handleCommentUpdated({ ...comment, text: comment.text })}
              />
            ) : (
              <>
                <p>{comment.text}</p>
                <small>By {comment.user_name} at {new Date(comment.created_at).toLocaleString()}</small>
                <br />
                <button onClick={() => setEditingCommentId(comment.id)}>Edit</button>
                <DeleteCommentComponent
                  apiEndpoint="http://localhost:5000/api/comments"
                  commentId={comment.id}
                  onDelete={() => handleCommentDeleted(comment.id)}
                />
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SinglePostComponent;
