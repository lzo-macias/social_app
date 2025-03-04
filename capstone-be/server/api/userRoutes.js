const express = require("express");
const {
  createUser,
  fetchUsers,
  updateUser,
  deleteUser,
  findUserByUsername,
  fetchUsernameByUserId
} = require("../db/users"); // Ensure proper import from db/users
const { authenticate, findUserByToken } = require("../db/authentication"); // Import authenticate
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
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    console.log(`🔍 Searching for user: ${username}`);
    const authResult = await authenticate({ username, password });

    if (!authResult) {
      console.log("❌ Invalid credentials");
      return res.status(401).json({ error: "Invalid credentials" });
    }

    console.log("✅ User logged in:", authResult.user);
    res.status(200).json(authResult);
  } catch (err) {
    next(err);
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

router.get("/:userId", async (req, res, next) => {
  console.log("Getting id via username");
  const userId = req.params.userId;  // Get userId from the URL params
  console.log(userId);  // Log the userId to ensure it's being passed correctly
  try {
    const username = await fetchUsernameByUserId(userId);  // Pass the userId to fetchUsernameByUserId
    res.json({ username });  // Send the username as a JSON response
  } catch (err) {
    console.error(err);
    next(err);  // Pass the error to the next middleware (error handler)
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
    } = req.body;

    if (!username || !password || !email || !dob) {
      return res.status(400).json({ error: "Missing required fields" });
    }

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
    });

    if (!newUser) {
      return res.status(500).json({ error: "User could not be created" });
    }

    // ✅ Check if JWT_SECRET is set
    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET in environment variables!");
      return res
        .status(500)
        .json({ error: "Server misconfiguration: Missing JWT_SECRET" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ ...newUser, token });
  } catch (err) {
    next(err);
  }
});

// Fetch User Info
// Route to get user data by username
router.get("/userinfo/:username", async (req, res, next) => {
  try {
    console.log("working")
    const { username } = req.params;  // Extract username from the URL parameter
    const user = await findUserByUsername(username);  // Get user data by username
    console.log(user)
    res.send(user); // Send the user data back to the frontend
  } catch (ex) {
    next(ex); // Pass any error to the error handler
  }
});



// Updating User Info
router.put("/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // ✅ Ensure `userId` is a valid UUID
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "Update data is required" });
    }

    console.log(`🔍 Updating user ${userId} with data:`, updateData);
    const updatedUser = await updateUser(userId, updateData);

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ ...updatedUser, message: "User profile updated successfully" });
  } catch (err) {
    console.error("❌ Error in PUT /users/:userId", err);
    next(err);
  }
});

//delete user profile

router.delete("/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const deleted = await deleteUser(userId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
