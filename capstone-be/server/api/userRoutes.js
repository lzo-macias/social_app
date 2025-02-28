const express = require("express");
const {
  createUser,
  fetchUsers,
  updateUser,
  deleteUser,
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
    const { username, password } = req.body; // Corrected from username to email
    const user = await authenticate({ username, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ error: "Server misconfiguration: Missing JWT_SECRET" });
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

router.delete("/:userId", isLoggedIn, async (req, res, next) => {
  try {
    const { userId, reviewId } = req.params;
    const deleted = await deleteUser(userId, reviewId);
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

module.exports = router;
