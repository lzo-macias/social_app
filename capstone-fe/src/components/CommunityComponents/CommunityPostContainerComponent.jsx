import React, { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "../SearchBar";
import PostCardComponent from "./CommunityPostCardComponent";

function PostContainerComponent({ communityId, onPostClick }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/communitiespost/${communityId}/posts`
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

  const getImageUrl = (post) => {
    if (post?.img_id === null) return `${post.img_url}`;
    if (post?.img_id) return `${import.meta.env.VITE_API_IMG_URL}${post.image_path}`;
    return null;
  };

  return (
    <div>
      {/* <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
      <div className="masonry-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => {
            const imageLarge = getImageUrl(post);
            return (
              <div
                key={post.id}
                className="masonry-item"
                onClick={() => onPostClick && onPostClick(post)}
                style={{ cursor: "pointer" }}
              >
                <img src={imageLarge} alt={post.caption || "Post"} />
              </div>
            );
          })
        ) : (
<div className="masonry-full-width-message">
  <p>No posts available for this community.</p>
</div>
        )}
      </div>
    </div>
  );
}

export default PostContainerComponent;
