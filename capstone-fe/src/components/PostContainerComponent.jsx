import React, { useEffect, useState } from "react";
import axios from "axios";

const PostContainerComponent = ({ communityId, onBack }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [communityId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="posts-container">
      <button onClick={onBack}>Back to Communities</button>
      <h2>Community Posts</h2>
      {posts.length > 0 ? (
        <div className="posts-grid">
          {posts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No posts available</p>
      )}
    </div>
  );
};

export default PostContainerComponent;
