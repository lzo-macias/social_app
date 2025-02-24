const { client } = require("./db"); // Import database client
const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const pool = require("./db"); // Assuming you have a PostgreSQL connection setup
const { fetchPostsByCommunity } = require("./post");

const app = express();
app.use(cors());
app.use(express.json());

// Adjusted createCommunity function to work in both seeding and HTTP request contexts

const createCommunity = async (communityData) => {
  // Check if we're in the seeding process (no req.body available)
  const {
    name,
    description,
    admin_id = null,
    visibility = "public",
  } = communityData;

  if (!name || !description) {
    throw new Error("Name and description are required");
  }

  try {
    const SQL = `
      INSERT INTO communities(name, description, admin_id, visibility)
      VALUES($1, $2, $3, $4) RETURNING *;
    `;
    const { rows } = await client.query(SQL, [
      name,
      description,
      admin_id,
      visibility,
    ]);

    if (!rows[0]) {
      throw new Error("Failed to create community");
    }

    return rows[0];
  } catch (err) {
    console.error("Error creating community:", err);
    throw new Error("Failed to create community");
  }
};

const fetchCommunities = async () => {
  try {
    const SQL = `SELECT * FROM communities;`;
    const { rows } = await client.query(SQL);
    return rows;
  } catch (err) {
    console.error("Error fetching communities:", err);
    throw err;
  }
};

const fetchCommunityById = async (id) => {
  try {
    const SQL = `SELECT * FROM communities WHERE id = $1;`;
    const { rows } = await client.query(SQL, [id]);
    return rows[0];
  } catch (err) {
    console.error("Error fetching community by ID:", err);
    throw err;
  }
};
const fetchCommunityMembers = async (communityId) => {
  try {
    const SQL = `SELECT * FROM community_members WHERE community_id = $1;`;
    const { rows } = await client.query(SQL, [communityId]);
    return rows;
  } catch (err) {
    console.error("Error fetching community members:", err);
    throw err;
  }
};

const fetchPostsByCommunity = async (communityId) => {
  try {
    const SQL = `SELECT * FROM posts WHERE community_id = $1;`;
    const { rows } = await client.query(SQL, [communityId]);
    return rows;
  } catch (err) {
    console.error("Error fetching posts by community:", err);
    throw err;
  }
};

const addUserToCommunity = async (communityId, userId) => {
  try {
    // Check if the community exists
    const communitySQL = `SELECT * FROM communities WHERE id = $1`;
    const communityResult = await client.query(communitySQL, [communityId]);
    if (!communityResult.rows.length) {
      throw new Error("Community not found");
    }
    // Check if the user exists
    const userSQL = `SELECT * FROM users WHERE id = $1`;
    const userResult = await client.query(userSQL, [userId]);
    if (!userResult.rows.length) {
      throw new Error("User not found");
    }
    // Add the user to the community
    const SQL = `
      INSERT INTO community_members(community_id, user_id)
      VALUES($1, $2) RETURNING *;
    `;
    const { rows } = await client.query(SQL, [communityId, userId]);
    return rows[0]; // Return the added community member details
  } catch (err) {
    console.error("Error adding user to community:", err);
    throw err;
  }
};

// Set up Multer for file storage
// const storage = multer.diskStorage({
//   destination: "./uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });

// const upload = multer({ storage });

// // Endpoint for uploading an image
// app.post("/upload", upload.single("image"), async (req, res) => {
//   try {
//     const { community_id, user_id } = req.body;
//     const imageUrl = `/uploads/${req.file.filename}`; // Path to serve image

//     // Save image URL to the database
//     const newImage = await pool.query(
//       "INSERT INTO images (community_id, user_id, image_url) VALUES ($1, $2, $3) RETURNING *",
//       [community_id, user_id, imageUrl]
//     );

//     res.json(newImage.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server Error");
//   }
// });

// Serve uploaded images statically
// app.use("/uploads", express.static("uploads"));

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// 3. PostgreSQL Database Schema
// Your images table could look like this:

module.exports = {
  createCommunity,
  fetchCommunities,
  addUserToCommunity,
  fetchCommunityById,
  fetchCommunityMembers,
  fetchPostsByCommunity,
};
