// CommunityCardComponent.jsx
import React from "react";

const CommunityCardComponent = ({ community, onSelectCommunity }) => {
  return (
    <div className="card">
      <h3>{community.name}</h3>
      <p>{community.description}</p>
      <button className="btn" onClick={() => onSelectCommunity(community.id)}>
        Browse this community
      </button>
    </div>
  );
};

export default CommunityCardComponent;
