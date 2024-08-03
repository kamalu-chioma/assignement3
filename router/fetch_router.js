// fetch_router.js
const express = require("express");
const router = express.Router();
const Image = require("../models/file");

router.get("/all", (_, res) => {
  Image.find()
    .then((allImages) => {
      if (allImages.length === 0) {
        return res.status(404).json({ error: "No files found." });
      }
      const formattedImages = allImages.map((image) => ({
        filename: image.filename,
        contentType: image.contentType,
        imageBuffer: image.imageBuffer
          ? image.imageBuffer.toString("base64")
          : "",
      }));

      res.json(formattedImages);
    })
    .catch((error) => {
      console.error("Error fetching files:", error);
      res.status(500).json({ error: "Error fetching files." });
    });
});

router.get("/all/pages/:index", (req, res) => {
  const pageIndex = parseInt(req.params.index, 10);

  if (isNaN(pageIndex) || pageIndex < 1) {
    return res.status(400).send("Invalid page index.");
  }
  const ITEMS_PER_PAGE = 10;
  Image.find({}, { imageBuffer: 0 })
    .skip((pageIndex - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then((page_results) => {
      if (page_results.length === 0) {
        return res.status(404).send("Page not found.");
      }
      Image.countDocuments()
        .then((total_images) => {
          const totalPages = Math.ceil(total_images / ITEMS_PER_PAGE);
          const formattedPageItems = page_results.map((image) => ({
            filename: image.filename,
            contentType: image.contentType,
            imageBuffer: image.imageBufferThumbnail
              ? image.imageBufferThumbnail.toString("base64")
              : "",
          }));
          const response = {
            page: pageIndex,
            totalPages: totalPages,
            files: formattedPageItems,
          };
          res.json(response);
        })
        .catch((error) => {
          console.error("Error counting Documents:", error);
          res.status(500).send("Error fetching files.");
        });
    })
    .catch((error) => {
      console.error("Error Finding Documents:", error);
      res.status(500).send("Error fetching files.");
    });
});
// const path = require("path");
// const { getRandomFiles, getAllFiles } = require("../util/fileUtils");
// const {readFileAsBase64} = require("../util/base64Util")
// const { paginate } = require("../util/paginationUtil"); // Import the pagination utility function

// // Fetch file as base64
// const fetchFileAsBase64 = (filePath) => {
//   const content = readFileAsBase64(filePath);
//   return content ? { file: content } : { error: "File not found." };
// };

// router.get("/", (req, res) => {
//   const randomFile = getRandomFiles(1);
//   if (randomFile.length === 0) {
//     return res.status(404).send("No files found.");
//   }
//   const filePath = path.join(__dirname, "../uploads", randomFile[0]);
//   res.json(fetchFileAsBase64(filePath));
// });

// // Fetch multiple files as base64
// router.get("/multiple", (req, res) => {
//   console.log(req.query.count);
//   const count = Math.min(Number(req.query.count) || 5, 5);
//   const randomFiles = getRandomFiles(count);
//   if (randomFiles.length === 0) {
//     return res.status(404).send("No files found.");
//   }

//   const fileContents = {};

//   randomFiles.forEach((file) => {
//     const filePath = path.join(__dirname, "../uploads", file);
//     const content = readFileAsBase64(filePath);
//     if (content) {
//       fileContents[file] = content;
//     }
//   });

//   res.json(fileContents);
// });

// // Fetch all files as base64
// const fetchAllFilesAsBase64 = () => {
//   const files = getAllFiles();
//   const fileContents = {};

//   Object.keys(files).forEach((file) => {
//     const filePath = path.join(__dirname, "../uploads", file);
//     const content = readFileAsBase64(filePath);
//     if (content) {
//       fileContents[file] = content;
//     }
//   });

//   return fileContents;
// };

// router.get("/all", (req, res) => {
//   const files = fetchAllFilesAsBase64();
//   if (Object.keys(files).length === 0) {
//     return res.status(404).send("No files found.");
//   }
//   res.json(files);
// });

// const ITEMS_PER_PAGE = 1; // Number of items per page

// router.get("/all/pages/:index", (req, res) => {
//   const pageIndex = parseInt(req.params.index, 10);
//   if (isNaN(pageIndex) || pageIndex < 1) {
//     return res.status(400).send("Invalid page index.");
//   }

//   const allFiles = Object.entries(fetchAllFilesAsBase64());
//   const totalItems = allFiles.length;
//   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

//   if (pageIndex > totalPages) {
//     return res.status(404).send("Page not found.");
//   }

//   const pageItems = paginate(allFiles, pageIndex, ITEMS_PER_PAGE);

//   const response = {
//     page: pageIndex,
//     totalPages: totalPages,
//     files: Object.fromEntries(pageItems),
//   };

//   res.json(response);
// });

module.exports = router;
