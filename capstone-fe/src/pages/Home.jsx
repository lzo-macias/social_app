import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function Home() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Initialize navigate function

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
      const username = response.data.username; // Assume the API returns the username in the response

      // Navigate to the user's profile page using the username
      navigate(`/${username}`);
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
    <div className="homecontainer">
      <label>
        Search:
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>
      <div className="home-post-container">
        {posts
          .filter((post) =>
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((post) => {
            return (
              <div key={post.id} className="home-post">
                <p>{post.content}</p>
                <button onClick={() => handleUserClick(post.user_id)}>
                  Check out the user
                </button>

                {/* ✅ Only show if the post belongs to a community */}
                {post.community_id !== null && (
                  <button onClick={() => handleCommunityClick(post.community_id)}>
                    Check out community
                  </button>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Home;
