require("dotenv").config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const app = express();
const path = require("path");
const upload_router = require("./router/upload_router");
const fetch_router = require("./router/fetch_router")

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use("/upload", upload_router);
app.use("/fetch", fetch_router);

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/index.html"));
});

app.get("/gallery", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "gallery.html"));
});

// Serve gallery-pagination.html
app.get("/gallery-pagination", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "gallery-pagination.html"));
});

// Handle 404
app.use((req, res) => {
  res.status(404).send("Route does not exist on our server");
});

// Start the server
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
