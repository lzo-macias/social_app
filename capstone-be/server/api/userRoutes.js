const express = require("express");
const { createUser, fetchUsers } = require("../db/users");
const router = express.Router();
const app = express();
require("dotenv").config();
const { Pool } = require("pg");

<<<<<<< HEAD
const { createTables } = require("../db/db");
const { createUser, fetchUsers } = require("../db/users");

router.post("/users/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const token = await register({ username, password });
    res.status(201).send(token);
  } catch (ex) {
    next(ex);
=======
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
>>>>>>> community_branch
  }
});

router.post("/users/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    console.log("Attempting login with username:", username);
    res.send(await authenticate({ username, password }));
  } catch (ex) {
    next(ex);
=======
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
>>>>>>> community_branch
  }
});


router.get("/myprofile", async (req, res, next) => {
  try {
    res.send(await findUserByToken(req.headers.authorization));
  } catch (ex) {
    next(ex);
  }
});

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
const init = async () => {
  try {
    console.log("connecting to client");
    await client.connect();
    app.use("api", router);
    app.listen(PORT, () => {
      console.log(`server live on port ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
};

init();
module.exports = router;
