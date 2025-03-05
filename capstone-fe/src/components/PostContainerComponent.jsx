// PostContainerComponent.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "./SearchBar";
import PostCardComponent from "./PostCardComponent";

function PostContainerComponent({ communityId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/communitiespost/${communityId}/posts`
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

  if (loading) return <div className="card">Loading posts...</div>;
  if (error) return <div className="card">{error}</div>;

  const filteredPosts = posts.filter((post) => {
    const combinedText = (post.title + post.content).toLowerCase();
    return combinedText.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCardComponent
              key={post.id}
              post={post}
              communityId={communityId}
            />
          ))
        ) : (
          <p>No posts available for this community.</p>
        )}
      </div>
    </div>
  );
}

export default PostContainerComponent;
