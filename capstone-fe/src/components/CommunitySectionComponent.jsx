// CommunitySectionComponent.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const CommunitySectionComponent = ({ onSelectCommunity }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/communities`
        );
        setCommunities(response.data);
      } catch (err) {
        setError("Failed to load communities");
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  if (loading) return <div className="card">Loading...</div>;
  if (error) return <div className="card">{error}</div>;

  return (
    <div className="card">
      <h2>Your Communities</h2>
      <div className="grid">
        {communities.length > 0 ? (
          communities.map((community) => (
            <div key={community.id} className="card">
              <h3>{community.name}</h3>
              <p>{community.description}</p>
              <button
                className="btn"
                onClick={() => onSelectCommunity(community.id)}
              >
                Browse this Community
              </button>
            </div>
          ))
        ) : (
          <p>No communities available</p>
        )}
      </div>
    </div>
  );
};

export default CommunitySectionComponent;
