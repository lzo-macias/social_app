import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all communities
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/communities`)
      .then((response) => {
        setCommunities(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching communities:", err);
        setError("Failed to load communities.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    // 1) Wrap everything in a <div className="main-content"> so that nothing is hidden underneath sidebar
    <div className="main-content">
      <div className="communities-page">
        <h1>Communities</h1>
        <div className="communities-container">
          {communities.map((community) => (
            <div key={community.id} className="community-card">
              <Link
                to={`/communities/${community.id}`}
                className="community-link"
              >
                <h3>{community.name}</h3>
                <p>{community.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CommunitiesPage;
