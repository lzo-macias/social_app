const express = require("express");
const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");
const communityRoutes = require("./communityRoutes");
//const communityMemberRoutes = require("./communityMemberRoutes");
const messageRoutes = require("./messageRoutes");

const router = express.Router();

// Attach all routes
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/communities", communityRoutes);
//router.use("/community-members", communityMemberRoutes);
router.use("/messages", messageRoutes);

module.exports = router;
