import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function SidebarComponent() {
  const [communities, setCommunities] = useState([]);
  const [username, setUsername] = useState(null);
  const [userId, setUserId] = useState(null); // Add userId state
  const navigate = useNavigate(); // Hook to handle navigation

  // Fetch user data from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.username) {
      setUsername(user.username);
    }
    if (user?.id) {
      setUserId(user.id); // Store userId
    }
  }, []);

  useEffect(() => {
    if (username) {
      console.log("Fetching communities for user:", username);

      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");

      if (token) {
        axios({
          method: "get",
          url: `${
            import.meta.env.VITE_API_BASE_URL
          }/communities/user/${username}`,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            console.log("Fetched Communities for user:", res.data);

            // Ensure no duplicates based on community.id
            const uniqueCommunities = Array.from(
              new Map(
                res.data.map((community) => [community.id, community])
              ).values()
            );

            setCommunities(uniqueCommunities);
          })
          .catch((err) => {
            console.error("Error fetching user's communities:", err);
          });
      } else {
        console.error("No token found in localStorage");
      }
    }
  }, [username]);

  const handleCreateCommunityClick = () => {
    navigate("/createCommunity"); // Navigate to the create community page
  };

  return (
    <nav className="sidebar">
      <h1 style={{ color: "#ff6f61" }}>Shenanigram</h1>
      {/* <img src="../../../capstone-be/uploads/logo.png" alt="logo" /> */}
      <Link
        style={{ textDecoration: "none", color: "black", fontWeight: "bold" }}
        to="/"
      >
        Home
      </Link>
      {username && userId && (
        <Link
          style={{ textDecoration: "none", color: "black", fontWeight: "bold" }}
          to={`/${username}/${userId}`}
        >
          Profile
        </Link>
      )}{" "}
      {/* Updated Link */}
      <Link
        style={{ textDecoration: "none", color: "black", fontWeight: "bold" }}
        to="/communities"
      >
        Communities
      </Link>
      <Link
        style={{ textDecoration: "none", color: "black", fontWeight: "bold" }}
        to="/messages"
      >
        My Messages
      </Link>
      <div className="sidebar-communities">
        <h3>Your Communities</h3>
        <button onClick={handleCreateCommunityClick}>
          Create Community
        </button>{" "}
        {/* Added onClick */}
        {communities.length > 0 ? (
          communities.map((community) => {
            console.log(community); // ✅ Moved outside JSX
            return (
              <div key={community.id}>
                <Link
                  style={{
                    textDecoration: "none",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  to={`/communities/${community.id}`}
                >
                  <p>{community.name}</p>
                </Link>
              </div>
            );
          })
        ) : (
          <p>You're not in any communities...</p>
        )}
      </div>
    </nav>
  );
}

export default SidebarComponent;
