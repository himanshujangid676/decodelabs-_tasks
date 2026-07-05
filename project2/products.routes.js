const express = require("express");
const router = express.Router();
const db = require("../data/products");
const { computeStats } = require("../utils/priceStats");
const validateProduct = require("../middleware/validateProduct");

/**
 * GET /api/products
 * Query params (all optional):
 *   search    - case-insensitive match on product name
 *   category  - Electronics | Fashion | Home
 *   sort      - savings (default) | lowprice | name
 */
router.get("/", (req, res) => {
  const { search = "", category = "", sort = "savings" } = req.query;

  let results = db.getAll().map(computeStats);

  if (search) {
    const q = search.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (category) {
    results = results.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (sort === "lowprice") {
    results.sort((a, b) => a.bestPrice - b.bestPrice);
  } else if (sort === "name") {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    results.sort((a, b) => b.savings - a.savings);
  }

  res.status(200).json({
    count: results.length,
    products: results,
  });
});

/**
 * GET /api/products/:id
 */
router.get("/:id", (req, res) => {
  const product = db.getById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: `Product ${req.params.id} not found.` });
  }
  res.status(200).json(computeStats(product));
});

/**
 * POST /api/products
 * Body: { name, category, prices: { store: price, ... } }
 */
router.post("/", validateProduct, (req, res) => {
  const { name, category, prices } = req.body;
  const created = db.add({ name: name.trim(), category, prices });
  res.status(201).json(computeStats(created));
});

/**
 * PUT /api/products/:id   (bonus — full replace of prices/category/name)
 */
router.put("/:id", validateProduct, (req, res) => {
  const { name, category, prices } = req.body;
  const updated = db.update(req.params.id, { name: name.trim(), category, prices });
  if (!updated) {
    return res.status(404).json({ error: `Product ${req.params.id} not found.` });
  }
  res.status(200).json(computeStats(updated));
});

/**
 * DELETE /api/products/:id   (bonus)
 */
router.delete("/:id", (req, res) => {
  const removed = db.remove(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: `Product ${req.params.id} not found.` });
  }
  res.status(204).send();
});

module.exports = router;
