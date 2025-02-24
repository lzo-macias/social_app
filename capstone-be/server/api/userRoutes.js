const express = require("express");
const { createUser, fetchUsers } = require("../db/users");
const router = express.Router();

// GET: All Users
router.get("/", async (req, res, next) => {
  try {
    const users = await fetchUsers(); // Fetch users from the database
    res.json(users); // Send the list of users as a JSON response
  } catch (err) {
    next(err); // Handle any errors
  }
});

// POST: Create a New User
router.post("/", async (req, res, next) => {
  try {
    const { username, password, email, dob, is_admin } = req.body; // Get user data from request body
    if (!username || !password || !email || !dob || is_admin === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newUser = await createUser({
      username,
      password,
      email,
      name: "", // You can adjust if you want the name field to be passed
      dob,
      is_admin,
    });
    res.status(201).json(newUser); // Respond with the newly created user
  } catch (err) {
    next(err); // Handle any errors
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
    // Assuming a function like addUserToCommunity exists
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
