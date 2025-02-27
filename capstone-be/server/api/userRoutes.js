const express = require("express");
const { createUser, fetchUsers,updateUser,deleteUser } = require("../db/users"); // Ensure proper import from db/users
const { authenticate,findUserByToken } = require("../db/authentication"); // Import authenticate
const isLoggedIn = require("../middleware/isLoggedIn"); // Import the middleware
const { Pool } = require("pg");
const router = express.Router();
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken"); // Import JWT if not already done


// POST: Login User
//When testing in thunderclient use http://localhost:3000/api/users/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body; // Corrected from username to email
    const user = await authenticate({ username, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "Server misconfiguration: Missing JWT_SECRET" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ token });
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
router.post("/register", async (req, res, next) => {
  try {
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
      created_at,
    } = req.body;

    if (!username || !password || !email || !dob || is_admin === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a new user
    const newUser = await createUser({
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
      created_at,
    });

    // Generate a JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET, // Ensure this is set in your .env file
      { expiresIn: "7d" } // Token expires in 7 days
    );

    // Return the user data along with the token
    res.status(201).json({ ...newUser, token });
  } catch (err) {
    next(err);
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
router.get("/:userId", isLoggedIn, async (req, res, next) => {
  try {
    res.send(await findUserByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

// Updating User Info
router.put("/:userId", isLoggedIn, async (req, res, next) => {
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

    const result = await updateUser({
      userId,
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
    });

    console.log("Profile updated!");
    res.status(200).json(result); // Send the updated profile
  } catch (err) {
    console.error("Error in PUT /users/:userId", err);
    next(err); // Forward error to error handler
  }
});


//delete user profile 

router.delete("/:userId", isLoggedIn,
  async (req, res, next) => {
    try {
      const { userId, reviewId} = req.params;
      const deleted = await deleteUser(userId, reviewId);
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  }
);


module.exports = router;
