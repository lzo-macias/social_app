const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const isCommunityAdmin = require("../middleware/isCommunityAdmin");
const {
  fetchCommunities,
  fetchCommunityById,
  fetchCommunityMembers,
  createCommunity,
  updateCommunity,
  addUserToCommunity,
  deleteCommunity,
} = require("../db/community");

// Get all communities
router.get("/", async (req, res) => {
  try {
    const communities = await fetchCommunities();
    res.status(200).json(communities);
  } catch (err) {
    console.error("Error fetching communities:", err.message);
    res.status(500).json({ error: "Failed to fetch communities" });
  }
});

// Get community details by ID
router.get("/:id", async (req, res) => {
  try {
    const community = await fetchCommunityById(req.params.id);
    if (!community) return res.status(404).json({ error: "Community not found" });
    res.json(community);
  } catch (err) {
    console.error("Error fetching community:", err.message);
    res.status(500).json({ error: "Failed to fetch community" });
  }
});

// Get community members
router.get("/:id/members", async (req, res) => {
  try {
    const members = await fetchCommunityMembers(req.params.id);
    res.json(members);
  } catch (err) {
    console.error("Error fetching community members:", err.message);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

// Create a new community
router.post("/", isLoggedIn, async (req, res) => {
  const { name, description } = req.body;
  const createdBy = req.user.id;

  if (!name || !description) {
    return res.status(400).json({ error: "Community name and description are required" });
  }

  try {
    const newCommunity = await createCommunity({ name, description, createdBy });
    res.status(201).json(newCommunity);
  } catch (err) {
    console.error("Error creating community:", err);
    res.status(500).json({ error: "Failed to create community" });
  }
});

// Update a community
router.put("/:communityId", isLoggedIn, isCommunityAdmin, async (req, res, next) => {
  try {
    const updatedCommunity = await updateCommunity(req.params.communityId, req.body);
    if (!updatedCommunity) return res.status(404).json({ error: "Community not found" });
    res.status(200).json(updatedCommunity);
  } catch (err) {
    console.error(`Error updating community:`, err);
    next(err);
  }
});

// Delete a community
router.delete("/:communityId", isLoggedIn, isCommunityAdmin, async (req, res) => {
  try {
    const deletedCommunity = await deleteCommunity(req.params.communityId);
    if (!deletedCommunity) return res.status(404).json({ error: "Community not found" });
    res.status(200).json({ message: "Community deleted", deletedCommunity });
  } catch (err) {
    console.error("Error deleting community:", err);
    res.status(500).json({ error: "Failed to delete community" });
  }
});

module.exports = router;
