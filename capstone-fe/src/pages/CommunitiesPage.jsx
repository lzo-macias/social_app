// CommunitiesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
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

  if (loading) return <div className="card">Loading...</div>;
  if (error) return <div className="card">{error}</div>;

  const filteredCommunities = communities.filter((community) => {
    const combinedText = (community.name + community.description).toLowerCase();
    return combinedText.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1>Communities</h1>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="grid">
        {filteredCommunities.map((community) => (
          <div key={community.id} className="card">
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
  );
}

export default CommunitiesPage;
