// PostContainerComponent.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";

function PostContainerComponent({ communityId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Add state for searchTerm
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter posts by the searchTerm
  // For example, we can match "title" OR "content"
  const filteredPosts = posts.filter((post) => {
    const combinedText = (post.title + post.content).toLowerCase();
    return combinedText.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      {/* Our new SearchBar on top */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="posts-container">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
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
    </div>
  );
}

export default PostContainerComponent;
