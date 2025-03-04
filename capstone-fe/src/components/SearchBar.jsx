// src/components/SearchBar.jsx
import React from "react";

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label htmlFor="searchInput">Search: </label>
      <input
        id="searchInput"
        type="text"
        placeholder="Type to search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: "8px" }}
      />
    </div>
  );
}

export default SearchBar;
