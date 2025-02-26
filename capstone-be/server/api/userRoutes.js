const express = require("express");
const { createUser, fetchUsers } = require("../db/users"); // Ensure proper import from db/users
const { authenticate } = require("../db/authentication"); // Import authenticate
const isLoggedIn = require("../middleware/isLoggedIn"); // Import the middleware
const router = express.Router();
require("dotenv").config();

// POST: Login User
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await authenticate({ username, password });

    // Assuming you are using sessions or JWT, you would set req.user here
    req.user = user; // This sets the authenticated user in the request

    // Respond with user or a token (if using JWT)
    res.status(200).json(user); // Or send a JWT token here
  } catch (ex) {
    next(ex);
  }
});

// GET: All Users
router.get("/", async (req, res, next) => {
  console.log("GET /api/users route hit");
  try {
    const users = await fetchUsers(); // Fetch users from the database
    console.log("Fetched users:", users);
    res.json(users); // Send the list of users as a JSON response
  } catch (err) {
    console.error("Error in /api/users route:", err);
    next(err); // Forward the error to the next middleware (error handler)
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

// Fetch User Info
router.get("/myprofile", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await findUserByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

// Updating User Info
router.put("/users/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const {
      is_admin,
      username,
      password,
      email,
      dob,
      visibility,
      profile_picture,
      bio,
      location,
      status,
    } = req.body;
    const user = req.user;

    const result = await updateUser(
      is_admin,
      username,
      password,
      email,
      dob,
      visibility,
      profile_picture,
      bio,
      location,
      status
    );
    console.log("Profile updated!");
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
