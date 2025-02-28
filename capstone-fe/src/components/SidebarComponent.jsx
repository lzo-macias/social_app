import React, { useState, useEffect } from "react"; // Add useState and useEffect
import { Link } from "react-router-dom";
import axios from "axios";

function Sidebar() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  const token = localStorage.getItem("jwtToken"); // Or use a context for token handling

  useEffect(() => {
    axios(`${import.meta.env.VITE_API_BASE_URL}/communities`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setCommunities(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load communities.");
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/myprofile">Profile</Link>
        <Link to="/communities">Communities</Link>
        <Link to="/messages">My Messages</Link>
      </nav>
      <div>
        {communities.length > 0 ? (
          communities.map((community, index) => (
            <div key={index}>
              <h3>{community.name}</h3>
              <p>{community.description}</p>
            </div>
          ))
        ) : (
          <p>No communities available.</p>
        )}
      </div>
    </>
  );
}

export default Sidebar;
