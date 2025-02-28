import React, { useState } from "react";
import axios from "axios";

function AddUserToCommunityComponent({ communityId, userId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

//communityId will be grabbed from params on page
//userId is selected by user sending invite
  
  const handleYesClick = async () => {
    setIsLoading(true);
    try {
      // Call the API to add the user to the community
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/addUserToCommunity/${communityId}/users/${userId}`
      );
      setMessage("Successfully added to the community!");
    } catch (error) {
      console.error("Error adding user to community:", error);
      setMessage("Failed to add user to the community.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoClick = () => {
    setMessage("You declined the invitation.");
  };

  return (
    <div>
      <p>Someone is inviting you to join the community.</p>
      <p>Click "Yes" to accept or "No" to decline.</p>
      <button onClick={handleYesClick} disabled={isLoading}>
        {isLoading ? "Processing..." : "Yes"}
      </button>
      <p>or</p>
      <button onClick={handleNoClick}>No</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddUserToCommunityComponent;
