// upload_router.js
const express = require("express");
const router = express.Router();
const path = require("path");
// const upload = require("../middleware/multerConfig");
const Image = require("../models/file");
const multer = require("multer");
const storage = multer.memoryStorage(); // Store files in memory as buffer
const upload = multer({ storage: storage });

// Upload single file
router
  .route("/")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "../views/upload.html"));
  })
  // .post(upload.single("file"), (req, res) => {
  //   if (!req.file) {
  //     return res.status(400).send("No file uploaded.");
  //   }
  //   res.send(`File uploaded successfully: ${req.file.path}`);
  // });

// Upload multiple files
router
  .route("/multiple")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "../views", "upload-multiple.html"));
  })
  .post(upload.array("files", 100), (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No files uploaded.");
    }

    const imagePromises = req.files.map((file) => {
      const newImage = new Image({
        filename: file.originalname,
        contentType: file.mimetype,
        imageBuffer: file.buffer,
      });
      return newImage.save();
    });

    Promise.all(imagePromises)
      .then(() => {
        res.status(200).send("Files uploaded successfully.");
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("Error saving files to database.");
      });
  });

module.exports = router;
