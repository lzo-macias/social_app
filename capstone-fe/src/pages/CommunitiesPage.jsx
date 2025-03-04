// src/pages/CommunitiesPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";

function CommunitiesPage() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // For filtering
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch the communities from the backend
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

  // Filter communities by searchTerm
  // e.g. match name or description
  const filteredCommunities = communities.filter((community) => {
    const combinedText = (community.name + community.description).toLowerCase();
    return combinedText.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="main-content">
      <h1>Communities</h1>

      {/* Our SearchBar Component */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* We now use filteredCommunities instead of communities */}
      <div className="communities-container">
        {filteredCommunities.map((community) => (
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
  );
}

export default CommunitiesPage;
