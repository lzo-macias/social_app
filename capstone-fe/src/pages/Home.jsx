import React, { useState } from "react";
import CommunitySectionComponent from "../components/CommunitySectionComponent";
import PostContainerComponent from "../components/PostContainerComponent";
import CreatePostComponent from "../components/PostComponents/CreatePostComponent";

function Home() {
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);

  return (
    <div>
      {/* <h1>Home</h1>
      {selectedCommunityId ? (
        <PostContainerComponent
          communityId={selectedCommunityId}
          onBack={() => setSelectedCommunityId(null)}
        />
      ) : (
        <CommunitySectionComponent onSelectCommunity={setSelectedCommunityId} />
      )} */}
      <CreatePostComponent />
    </div>
  );
}

export default Home;
