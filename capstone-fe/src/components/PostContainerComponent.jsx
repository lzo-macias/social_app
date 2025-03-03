import React, { useEffect, useState } from "react";
import axios from "axios";

//This Component is about Fetch Posts by CommunityId
const PostContainerComponent = ({ communityId, onBack }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Update the endpoint to match the backend route
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/communityPosts/${communityId}/posts`
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

  return (
    <div className="posts-container">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            {post.img_id && (
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/images/${
                  post.img_id
                }`}
                alt="Post visual"
              />
            )}
          </div>
        ))
      ) : (
        <p>No posts available for this community.</p>
      )}
    </div>
  );
};

export default PostContainerComponent;
