// server/api/communityRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Import JWT to verify user
const {
  fetchCommunities,
  fetchCommunityById,
  fetchCommunityMembers,
  createCommunity,
  updateCommunity,
  addUserToCommunity,
  deleteCommunity,
} = require("../db/community"); // Importing the community CRUD functions

// Get all communities
router.get("/", async (req, res) => {
  try {
    const communities = await fetchCommunities(); // Fetch all communities
    res.status(200).json(communities); // Send the list of communities as a response
  } catch (err) {
    console.error("Error fetching communities:", err.message);
    res.status(500).json({ error: "Failed to fetch communities" });
  }
});

// Get community details by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const community = await fetchCommunityById(id);
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }
    res.json(community);
  } catch (err) {
    console.error("Error fetching community by ID:", err.message);
    res.status(500).json({ error: "Failed to fetch community" });
  }
});

// Get community members
router.get("/:id/members", async (req, res) => {
  const { id } = req.params;
  try {
    const members = await fetchCommunityMembers(id);
    res.json(members);
  } catch (err) {
    console.error("Error fetching community members:", err.message);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// Middleware to verify token and extract userId
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    req.userId = decoded.id; // Attach userId to request
    next();
  });
};

// Create Community 
router.post("/", verifyToken, async (req, res) => {
  const { name, description } = req.body;
  const admin_id = req.userId; // Get userId from the token

  if (!name || !description) {
    return res
      .status(400)
      .json({ error: "Community name and description are required" });
  }

  try {
    console.log("Request Body:", req.body); // Log the incoming request body
    const newCommunity = await createCommunity({ name, description, admin_id });

    console.log("Newly Created Community:", newCommunity); // Log the newly created community
    res.status(201).json(newCommunity);
  } catch (err) {
    console.error("Error creating community:", err.message); // Log the error
    res
      .status(500)
      .json({ error: "Failed to create community", details: err.message });
  }
});


// PUT: Update a community
router.put("/:communityId", async (req, res, next) => {
  const { communityId } = req.params;
  const { name, description } = req.body;

  try {
    // Call the updateCommunity function
    const updatedCommunity = await updateCommunity(communityId, {
      name,
      description,
    });

    if (!updatedCommunity) {
      return res.status(404).json({ error: "Community not found" });
    }

    res.status(200).json(updatedCommunity); // Send the updated community
  } catch (err) {
    // Log the error and include the community's name from the request body
    console.error(`Error updating community with name ${name}:`, err);
    next(err); // Forward error to the next middleware (error handler)
  }
});

// Delete a community
router.delete("/:communityId", async (req, res) => {
  const { communityId } = req.params; //ask about this being inside or outside the try block

  try {
    const deletedCommunity = await deleteCommunity(communityId);

    if (!deletedCommunity) {
      return res.status(404).json({ error: "Community not found" });
    }

    res.status(200).json({ message: "Community deleted", deletedCommunity });
  } catch (err) {
    console.error("Error in DELETE /communities/:communityId:", err);
    res.status(500).json({ error: "Failed to delete community" });
  }
});

// Add a user to a community
router.post("/:communityId/members", async (req, res) => {
  const { communityId } = req.params;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const addedMember = await addUserToCommunity(communityId, userId);

    if (addedMember) {
      res.status(201).json({ message: "User added to community", addedMember });
    } else {
      res.status(404).json({ error: "Community or user not found" });
    }
  } catch (err) {
    console.error("Error adding user to community:", err.message);
    res
      .status(500)
      .json({ error: "Failed to add user to community", details: err.message });
  }
});

module.exports = router;
