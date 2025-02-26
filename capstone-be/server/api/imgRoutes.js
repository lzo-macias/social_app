const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  saveImage,
  fetchAllImages,
  fetchImageByFilename,
  deleteImageByFilename,
} = require("../db/img");

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route to handle image uploads
router.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const imageRecord = await saveImage({
      filename: req.file.filename,
      filepath: `/uploads/${req.file.filename}`,
    });
    res.json({ image: imageRecord });
  } catch (err) {
    console.error("Error saving image:", err);
    res.status(500).json({ error: "Error saving image" });
  }
});

// GET all uploaded images metadata
router.get("/", async (req, res) => {
  try {
    const images = await fetchAllImages();
    res.json({ images });
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Error fetching images" });
  }
});

// Serve static images from the "uploads" folder
router.get("/:filename", async (req, res) => {
  try {
    const image = await fetchImageByFilename(req.params.filename);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    const filePath = path.join(__dirname, "../../uploads", image.filename);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ error: "Error retrieving image file" });
      }
    });
  } catch (err) {
    console.error("Error fetching image:", err);
    res.status(500).json({ error: "Error fetching image" });
  }
});

// DELETE image by filename
router.delete("/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;

    // Check if image exists before deleting
    const image = await fetchImageByFilename(filename);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    // Delete image
    const deletedImage = await deleteImageByFilename(filename);
    if (!deletedImage) {
      return res.status(500).json({ error: "Error deleting image" });
    }

    res.json({ message: "Image deleted successfully", image: deletedImage });
  } catch (err) {
    console.error("Error deleting image:", err);
    res.status(500).json({ error: "Error deleting image" });
  }
});

module.exports = router;
