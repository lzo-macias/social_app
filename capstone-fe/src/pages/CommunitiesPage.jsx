import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // To navigate to the SingleCommunity page

function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the communities from the backend
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/communities`)
      .then((response) => {
        setCommunities(response.data); // Set the communities to state
        setLoading(false); // Data is loaded, stop the loading state
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
    <div className="communities-page">
      <h1>Communities</h1>
      <div className="communities-container">
        {communities.map((community) => {
          console.log(community.id); // Log this to verify the ID
          return (
            <div key={community.id} className="community-card">
              <Link
                to={`/community/${community.id}`}
                className="community-link"
              >
                <h3>{community.name}</h3>
                <p>{community.description}</p>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CommunitiesPage;
