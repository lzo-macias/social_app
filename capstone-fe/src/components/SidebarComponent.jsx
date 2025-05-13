import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SidebarComponent({ searchTerm, setSearchTerm }) {
  const [communities, setCommunities] = useState([]);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.username) setUsername(user.username);
    if (user?.id) setUserId(user.id);
  }, []);

  useEffect(() => {
    if (username) {
      const token = localStorage.getItem("token");

      if (token) {
        axios({
          method: "get",
          url: `${import.meta.env.VITE_API_BASE_URL}/communities/user/${username}`,
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => {
            const uniqueCommunities = Array.from(
              new Map(res.data.map((community) => [community.id, community])).values()
            );
            setCommunities(uniqueCommunities);
          })
          .catch((err) => console.error("Error fetching user's communities:", err));
      } else {
        console.error("No token found in localStorage");
      }
    }
  }, [username]);

  const handleCreateCommunityClick = () => navigate("/createCommunity");

  return (
    <nav className="sidebar">
      <div className="navbar">
        {!isMobile && (
          <Link className="sidebarlink" to="/">
            <img src="/icons/home.png" alt="" />
            <span>Home</span>
          </Link>
        )}

<div className="sidebarlink">
  <div className="sidebarsearchbar">
    <img src="/icons/magnifier.png" alt="Search Icon" />
    <span>Search</span>
    <input
      type="text"
      className="sidebarsearchbar-input"
      placeholder="Search posts..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
</div>
{console.log(username)}
          {console.log(userId)}
        {username && userId && (
          <Link className="sidebarlink" to={`/${username}/${userId}`}>
            <img src="/icons/profile.png" alt="" />
            <span>Profile</span>
          </Link>
        )}

        <Link className="sidebarlink" to="/communities">
          <img src="/icons/communities.png" alt="" />
          <span>Communities</span>
        </Link>

        <Link className="sidebarlink" to="/messagedashboard">
          <img src="/icons/messages.png" alt="" />
          <span>My Messages</span>
        </Link>
      </div>

      {!isMobile && (
        <div className="sidebar-communities-container">
          <p><u>Your Communities</u></p>
          <div className="sidebar-communities">
            {communities.length > 0 ? (
              communities.map((community) => (
                <div className="sidebar-communities-list" key={community.id}>
                  <Link to={`/communities/${community.id}`} className="sidebar-community-item">
                    {community.community_profile_picture && (
                      <img
                        src={`${import.meta.env.VITE_API_IMG_URL}${community.community_profile_picture}`}
                        alt={`${community.name} profile`}
                        className="community-img"
                      />
                    )}
                    <span>{community.name}</span>
                  </Link>
                </div>
              ))
            ) : (
              <p>You're not in any communities...</p>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default SidebarComponent;

