const express = require("express");

const router = express.Router();

router.use("/users", require("./userRoutes.js"));
router.use("/images", require("./imgRoutes.js")); //img routes

// this is localhost:3000/api
router.get("/", (req, res) => {
  res.send("hello from the main router in api/index.js");
});

module.exports = router;
