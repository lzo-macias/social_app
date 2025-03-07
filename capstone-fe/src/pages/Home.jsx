// Home.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/communitiespost/all`
      );
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleUserClick = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`
      );
      const username = response.data.username;
      navigate(`/${username}/${userId}`);
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  };

  const handleCommunityClick = async (communityId) => {
    try {
      navigate(`/communities/${communityId}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="home-container">
      <div className="home-search-container">
        <label>
          Search:
          <input
            className="home-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginLeft: "10px", padding: "5px" }}
          />
        </label>
      </div>
     
      <h2 className="explore">Explore All Posts</h2>
      <div className="home-post-container">
        {posts
          .filter((post) =>
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((post) => (
            <div key={post.id} className="card home-post">
              <img
                src={post.img_url} // :white_check_mark: Use img_url directly
                alt="Post"
                onError={(e) => {
                  console.error(":x: Image failed to load:", post.img_url);
                  e.target.style.display = "none"; // Hide broken images
                }}
              />
              <p>{post.content}</p>
              <button
                className="btn"
                onClick={() => handleUserClick(post.user_id)}
              >
                Check out the user
              </button>
              {post.community_id !== null && (
                <button
                  className="btn"
                  onClick={() => handleCommunityClick(post.community_id)}
                >
                  Check out community
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default Home;
