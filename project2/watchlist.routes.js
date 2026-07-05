const express = require("express");
const router = express.Router();
const db = require("../data/products");
const { computeStats } = require("../utils/priceStats");

// In-memory watchlist — a Set of product ids. Resets on server restart,
// same tradeoff as the rest of this demo API.
const watchlist = new Set();

/**
 * GET /api/watchlist
 */
router.get("/", (req, res) => {
  const items = [...watchlist]
    .map((id) => db.getById(id))
    .filter(Boolean)
    .map(computeStats);

  res.status(200).json({ count: items.length, items });
});

/**
 * POST /api/watchlist
 * Body: { productId }
 */
router.post("/", (req, res) => {
  const { productId } = req.body || {};

  if (typeof productId !== "string" || !productId.trim()) {
    return res.status(400).json({ error: "productId (string) is required." });
  }

  const product = db.getById(productId);
  if (!product) {
    return res.status(404).json({ error: `Product ${productId} not found.` });
  }

  watchlist.add(productId);
  res.status(201).json({ message: `${product.name} added to watchlist.`, productId });
});

/**
 * DELETE /api/watchlist/:productId
 */
router.delete("/:productId", (req, res) => {
  const { productId } = req.params;
  if (!watchlist.has(productId)) {
    return res.status(404).json({ error: `${productId} is not on the watchlist.` });
  }
  watchlist.delete(productId);
  res.status(204).send();
});

module.exports = router;
