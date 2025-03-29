import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SidebarComponent() {
  const [communities, setCommunities] = useState([]);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null); 
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();

  // Detect screen size for conditional rendering
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
          url: `${
            import.meta.env.VITE_API_BASE_URL
          }/communities/user/${username}`,
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
      {/* Conditional Rendering for Home Link */}
      {!isMobile && <Link to="/">Home</Link>}

      {username && userId && <Link to={`/${username}/${userId}`}>Profile</Link>}
      {!isMobile &&<Link to="/communities">Communities</Link>}
      <Link to="/messagedashboard">My Messages</Link>

      {!isMobile  && <div className="sidebar-communities-container">
        <p><u>Your Communities</u></p>
        <div className="sidebar-communities">
          {communities.length > 0 ? (
            communities.map((community) => (
              <div className="sidebar-communities-list" key={community.id}>
                <Link to={`/communities/${community.id}`}>
                  <p>{community.name}</p>
                </Link>
              </div>
            ))
          ) : (
            <p>You're not in any communities...</p>
          )}
        </div>
      </div>}
      {isMobile && <Link to="/communitiesmobile">Communities</Link>}
    </nav>
  );
}

export default SidebarComponent;
