import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import EditPostComponent from "../PostComponents/EditPostComponent"; // Import Edit Component
import DeletePostComponent from "../PostComponents/DeletePostComponent";

const FetchAllPostByUserIdComponent = ({ userId, posts, setPosts }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null); // Track which post is being edited

  useEffect(() => {
    if (!userId) {
      console.error("❌ No userId provided.");
      setError("User ID is required.");
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError(null);

      // const token = localStorage.getItem("token");
      // console.log("📢 Token Used for Fetching Posts:", token);

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/personal-post/${userId}`,
          // {
          //   headers: { Authorization: `Bearer ${token}` },
          // }
        );

        console.log("✅ Fetched Posts:", response.data);
        setPosts(response.data);
      } catch {
        setError("Failed to fetch posts. Please try again.");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, setPosts]);

  const handleUpdateSuccess = (updatedContent, postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, content: updatedContent } : post
      )
    );
    setEditingPostId(null);
  };

  // ✅ Handle successful deletion
  const handleDeleteSuccess = (deletedPostId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPostId)
    );
  };

  return (
    <div className="user-post-container">
      <h2>User Posts</h2>

      {loading && <p>Loading posts...</p>}

      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              {/* 🔹 Clickable Link to Single Post */}
              <Link to={`/album/${userId}/post/${post.id}`}>
                {/* ✅ Ensure `img_url` is displayed correctly */}
                {post.img_url ? (
                  <div className="user-post-card">
                    <img
                      src={post.img_url} // ✅ Use img_url directly
                      alt="Post"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "5px",
                      }}
                      onError={(e) => {
                        console.error("❌ Image failed to load:", post.img_url);
                        e.target.style.display = "none"; // Hide broken images
                      }}
                    />
                    <p>
                      <strong>Content:</strong> {post.content}
                    </p>
                    <p>
                      <small>
                        Created at: {new Date(post.created_at).toLocaleString()}
                      </small>
                    </p>
                    <div className="user-post-card-btn">
                      {/* Edit Button */}
                      {editingPostId === post.id ? (
                        <EditPostComponent
                          postId={post.id}
                          initialContent={post.content}
                          onUpdateSuccess={(updatedContent) =>
                            handleUpdateSuccess(updatedContent, post.id)
                          }
                          onCancel={() => setEditingPostId(null)}
                        />
                      ) : (
                        <button
                          className="btn"
                          onClick={() => setEditingPostId(post.id)}
                        >
                          Edit
                        </button>
                      )}
                      {/* ✅ Delete Button */}
                      <DeletePostComponent
                        postId={post.id}
                        onDeleteSuccess={handleDeleteSuccess}
                      />
                    </div>
                  </div>
                ) : (
                  <p>No image available.</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No posts found.</p>
      )}
    </div>
  );
};

export default FetchAllPostByUserIdComponent;
