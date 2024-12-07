const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Game server is running!");
});

module.exports = router;
