// server/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product"); // adjust if your model path differs

// GET /api/categories - Return unique categories from MongoDB
router.get("/", async (req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
