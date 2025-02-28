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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="communities-container">
      <h2 className="communities-title">Available Communities</h2>
      {communities.length > 0 ? (
        <div className="communities-grid">
          {communities.map((community) => (
            <div key={community.id} className="community-card">
              <h3>{community.name}</h3>
              <p>{community.description}</p>
              <button onClick={() => onSelectCommunity(community.id)}>
                Browse this Community
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No communities available</p>
      )}
    </div>
  );
};

export default CommunitySectionComponent;
