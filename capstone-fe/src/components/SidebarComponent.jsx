import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function SidebarComponent() {
  const [communities, setCommunities] = useState([]);
  const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage
  // console.log(token)
  const user = JSON.parse(localStorage.getItem("user")); // Get the user object
  // console.log(user)
  const username = user?.username; // Extract the username from the user object
  // console.log(username)

  useEffect(() => {
    if (token && username) {
      console.log("running")
        axios(`${import.meta.env.VITE_API_BASE_URL}/communities/user/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res.data);
          setCommunities(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token, username]); // Add username as a dependency to refetch if username changes
    // Log communities after the state has been updated
    // useEffect(() => {
    //   console.log("Updated communities state:", communities);
    // }, [communities]);

  // if (communities.length === 0) return <p>Loading...</p>; // Fix the loading check
  return (
    <>
      <nav className="sidebar">
      <img src="../../../../images/logo.png" alt="logo" />
        <Link to="/">Home</Link>
        <Link to="/myprofile">Profile</Link>
        <Link to="/communities">Communities</Link>
        <Link to="/messages">My Messages</Link>
      <div>
        <h3>Communities</h3>
        <button>create communities</button>
  {communities.length > 0 ? (
    communities.map((community) => {
      console.log(community); // ✅ Log each community
      return (
        <div key={community.id}>
          <hr />
          <p>{community.name}</p>
          <hr />
        </div>
      );
    })
  ) : (
    <p>You are not in any communities.</p>
  )}
</div>
</nav>
    </>
  );
}

export default SidebarComponent;
