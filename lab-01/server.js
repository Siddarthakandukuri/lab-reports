const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

// GET / — welcome text
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Node.js and Express server!");
});

// GET /about — JSON details
app.get("/about", (req, res) => {
  res.status(200).json({
    name: "K.SIDDARTHA",
    section: "252U1R9057"
  });
});

// GET /time — current date and time
app.get("/time", (req, res) => {
  res.status(200).json({
    currentDateTime: new Date().toISOString()
  });
});

// 404 handler for unknown paths
app.use((req, res) => {
  res.status(404).json({
    error: "404 - Route not found"
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});