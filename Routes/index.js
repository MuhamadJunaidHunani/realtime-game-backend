const express = require("express");
const router = express.Router();

// Health check
router.get("/", (req, res) => {
  res.send("Game server is up and running!");
});

module.exports = router;
