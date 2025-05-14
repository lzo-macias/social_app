const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Import JWT to verify user
const isLoggedIn = require("../middleware/isLoggedIn");
const isCommunityAdmin = require("../middleware/isCommunityAdmin");
const { pool } = require("../db/index");
const multer = require("multer"); // ✅ Add this
const path = require("path");
const {
  fetchCommunities,
  getCommunityById,
  fetchCommunityMembers,
  createCommunity,
  updateCommunity,
  addUserToCommunity,
  fetchUserCommunities,
  deleteCommunity,
} = require("../db/community");

const { saveImage } = require("../db/img");

// Add user to a community

router.post(
  "/addUserToCommunity/:communityId/users/:userId",
  async (req, res, next) => {
    const { communityId, userId } = req.params;
    const { role } = req.body; // Role will default to "member" if not provided

    try {
      // Call the function to add the user to the community
      const addedUser = await addUserToCommunity(
        communityId,
        userId,
        role || "member"
      );

      // Return the result to the client
      res.status(201).json({ message: "User added to community", addedUser });
    } catch (err) {
      console.error("❌ Error adding user to community:", err);
      next(err);
    }
  }
);
// **Get all communities**
router.get("/", async (req, res) => {
  try {
    console.log("error");
    const communities = await fetchCommunities();
    res.status(200).json(communities);
  } catch (err) {
    console.error("Error fetching communities:", err.message);
    res.status(500).json({ error: "Failed to fetch communities" });
  }
});

// Get community details by communityId
router.get("/:communityId", async (req, res) => {
  const { communityId } = req.params;
  try {
    const community = await getCommunityById(communityId); // Ensure you have this function implemented
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }
    res.status(200).json(community);
  } catch (err) {
    console.error("Error fetching community:", err.message);
    res.status(500).json({ error: "Failed to fetch community" });
  }
});

// **Get community members**
router.get("/:id/members", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Community ID is required" });

    const members = await fetchCommunityMembers(id);
    res.json(members);
  } catch (err) {
    console.error("Error fetching community members:", err.message);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

// **Create a new community (User automatically becomes admin)**
router.post("/", isLoggedIn, (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: "Multer error: " + err.message });
    }

    try {
      const { name, description } = req.body;
      const createdBy = req.user.id;

      if (!name || !description) {
        return res.status(400).json({
          error: "Community name and description are required",
        });
      }

      let imageUrl = null;

      // Handle file upload
      if (req.file) {
        const imageRecord = await saveImage({
          filename: req.file.filename,
          filepath: `/uploads/${req.file.filename}`,
          userId: createdBy,
        });

        if (!imageRecord || !imageRecord.id) {
          return res.status(500).json({ error: "Image saving failed." });
        }

        imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        // console.log('this is the filename', req.file.filename)
        // imageUrl = `${req.file.filename}`
      }

      const newCommunity = await createCommunity({
        name,
        description,
        createdBy,
        imageUrl,
      });

      res.status(201).json({
        ...newCommunity,
        message: "Community created successfully",
      });
    } catch (err) {
      console.error("❌ Error creating community:", err);
      res.status(500).json({ error: err.message });
    }
  });
});


// **Update a community (Only Admins)**
router.put(
  "/:communityId",
  isLoggedIn,
  isCommunityAdmin,
  async (req, res, next) => {
    try {
      const { communityId } = req.params;
      const updateData = req.body;

      if (!updateData || Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "Update data is required" });
      }

      console.log(`Updating community ${communityId} with data:`, updateData);
      const updatedCommunity = await updateCommunity(communityId, updateData);

      if (!updatedCommunity) {
        return res.status(404).json({ error: "Community not found" });
      }

      res.status(200).json(updatedCommunity);
    } catch (err) {
      console.error(`Error updating community:`, err);
      next(err);
    }
  }
);

// **Delete a community (Only Admins)**
router.delete(
  "/:communityId",
  isLoggedIn,
  isCommunityAdmin,
  async (req, res) => {
    try {
      const { communityId } = req.params;

      const deletedCommunity = await deleteCommunity(communityId);
      if (!deletedCommunity)
        return res.status(404).json({ error: "Community not found" });

      res
        .status(200)
        .json({ message: "Community deleted successfully", deletedCommunity });
    } catch (err) {
      console.error("Error deleting community:", err);
      res.status(500).json({ error: "Failed to delete community" });
    }
  }
);

// leave a community you are currently a member of
router.delete(
  "/:communityId/members/:userId",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const { communityId, userId } = req.params;
      // Delete the membership record from community_members
      const result = await pool.query(
        "DELETE FROM community_members WHERE community_id = $1 AND user_id = $2 RETURNING *",
        [communityId, userId]
      );
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Membership not found" });
      }
      res
        .status(200)
        .json({ message: "Left the community", membership: result.rows[0] });
    } catch (err) {
      console.error("❌ Error leaving community:", err);
      next(err);
    }
  }
);

// **Get all communities a user is in**
router.get("/user/:username", isLoggedIn, async (req, res) => {
  try {
    console.log("Fetching communities for user:", req.params.username);
    const { username } = req.params;

    if (!username) {
      console.log("no username");
      return res.status(400).json({ error: "Username is required" });
    }

    const communities = await fetchUserCommunities(username);

    if (!communities || communities.length === 0) {
      return res
        .status(404)
        .json({ error: "User is not part of any community" });
    }

    res.status(200).json(communities);
  } catch (err) {
    console.error("Error fetching user's communities:", err.message);
    res.status(500).json({ error: "Failed to fetch communities" });
  }
});

module.exports = router;
