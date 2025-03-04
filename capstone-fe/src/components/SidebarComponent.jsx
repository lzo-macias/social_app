import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SidebarComponent() {
  const [communities, setCommunities] = useState([]);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate(); // Hook to handle navigation

  // Fetch username from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.username) {
      setUsername(user.username);
    }
  }, []);

  useEffect(() => {
    console.log("Fetching communities...");
    axios(`${import.meta.env.VITE_API_BASE_URL}/communities`)
      .then((res) => {
        console.log("Fetched Communities:", res.data);
        setCommunities(res.data);
      })
      .catch((err) => {
        console.error("Error fetching communities:", err);
      });
  }, []);

  const handleCreateCommunityClick = () => {
    navigate("/createCommunity"); // Navigate to the create community page
  };

  return (
    <nav className="sidebar">
      <img src="../../../../images/logo.png" alt="logo" />
      <Link to="/">Home</Link>
      {username && <Link to={`/${username}`}>Profile</Link>}
      <Link to="/communities">Communities</Link>
      <Link to="/messages">My Messages</Link>

      <div className="sidebar-communities">
        <h3>Communities</h3>
        <button onClick={handleCreateCommunityClick}>Create Community</button> {/* Added onClick */}
        {communities.length > 0 ? (
          communities.map((community) => {
            console.log(community); // ✅ Moved outside JSX
            return (
              <div key={community.id}>
                {/* Wrap the community name in a Link to navigate to the community's page */}
                <Link to={`/communities/${community.id}`}>
                  <p>{community.name}</p>
                </Link>
              </div>
            );
          })
        ) : (
          <p>Loading communities...</p>
        )}
      </div>
    </nav>
  );
}

export default SidebarComponent;
