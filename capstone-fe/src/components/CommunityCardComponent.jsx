import React from "react";

const CommunityCardComponent = ({ community, onSelectCommunity }) => {
  return (
    <div className="community-card">
      <h3>{community.name}</h3>
      <p>{community.description}</p>
      {/* Button to trigger the community selection */}
      <button
        className="browse-button"
        onClick={() => onSelectCommunity(community.id)} // Pass community ID on click
      >
        Browse this community
      </button>
    </div>
  );
};

export default CommunityCardComponent;
