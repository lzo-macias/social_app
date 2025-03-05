// TestPostContainer.jsx
import React from "react";
import PostContainerComponent from "./PostContainerComponent";

const TestPostContainer = () => {
  const dummyCommunityId = "d91b376a-bd07-4adc-af15-90c2e8664734";
  return (
    <div className="card">
      <h1>Test Post Container</h1>
      <PostContainerComponent communityId={dummyCommunityId} />
    </div>
  );
};

export default TestPostContainer;
