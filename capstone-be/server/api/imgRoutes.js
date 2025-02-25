const express = require("express");
const multer = require("multer");
const path = require("path");
const { saveImage } = require("../db/img");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Assuming your uploads folder is at the root level
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Route to handle image uploads
router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    // Save image info to the database
    const imageRecord = await saveImage({
      filename: req.file.filename,
      filepath: `/uploads/${req.file.filename}`
    });
    res.json({ image: imageRecord });
  } catch (err) {
    console.error("Error saving image:", err);
    res.status(500).json({ error: "Error saving image" });
  }
});

module.exports = router;