import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import EditPostComponent from "./EditPostComponent"; // Import Edit Component
import DeletePostComponent from "./DeletePostComponent";

const SinglePostComponent = () => {
  const { postId } = useParams();
  const navigate = useNavigate(); // ✅ Navigate after deletion
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:5000/api/personal-post/post/${postId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPost(response.data);
      } catch (err) {
        console.error("❌ Error fetching post:", err);
        setError("Failed to fetch post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
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
    </div>
  );
};

export default SinglePostComponent;
