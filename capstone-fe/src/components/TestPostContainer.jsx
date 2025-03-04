import React from "react";
import PostContainerComponent from "./PostContainerComponent";

const TestPostContainer = () => {
  // Use a dummy communityId for testing. Make sure this ID exists in your test database or adjust as needed.
  const dummyCommunityId = "d91b376a-bd07-4adc-af15-90c2e8664734";

  return (
    <div>
      <h1>Test Post Container</h1>
      <PostContainerComponent communityId={dummyCommunityId} />
    </div>
  );
};

export default TestPostContainer;
