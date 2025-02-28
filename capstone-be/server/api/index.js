const express = require("express");
const userRoutes = require("./userRoutes");
const communityRoutes = require("./communityRoutes");
//const communityMemberRoutes = require("./communityMemberRoutes");
const messageRoutes = require("./messageRoutes");
const imgRoutes = require("./imgRoutes"); //Import image routes
// const communityPostRoutes = require("./communityPostRoutes");
const personalPostRoutes = require("./personalPostRoutes"); // import personal post routes

const router = express.Router();

// Attach all routes
router.use("/users", userRoutes);
router.use("/communities", communityRoutes);
//router.use("/community-members", communityMemberRoutes);
router.use("/messages", messageRoutes);
router.use("/images", imgRoutes);
// router.use("/communities", communityPostRoutes);
router.use("/personalPost", personalPostRoutes);

module.exports = router;
