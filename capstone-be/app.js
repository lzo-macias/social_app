const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const { client } = require("./server/db");
const communityRoutes = require("./server/api/communityRoutes");
const userRoutes = require("./server/api/userRoutes"); // Import userRoutes

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Use express.json() instead of bodyParser.json()

app.use("/api", require("./server/api")); // This can still be here if you want all routes under /api
app.use("/api/communities", communityRoutes);
app.use("/api/users", userRoutes); // Add this line to use the userRoutes for /api/users

const init = async () => {
  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Database connected!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

init();
