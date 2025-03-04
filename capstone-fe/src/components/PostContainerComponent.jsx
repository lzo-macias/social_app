import React, { useEffect, useState } from "react";
import axios from "axios";

function PostContainerComponent({ communityId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/communities/${communityId}/posts`
        );
        setPosts(response.data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [communityId]);

  if (loading) return <div>Loading posts...</div>;
  if (error) return <div>{error}</div>;

  if (posts.length === 0) {
    return <p>No posts available for this community.</p>;
  }

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          {post.img_id && (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}/images/${post.img_id}`}
              alt="Post visual"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default PostContainerComponent;
