const ALLOWED_CATEGORIES = ["Electronics", "Fashion", "Home"];

// Runs before POST/PUT handlers. Collects every problem instead of
// stopping at the first one, so the client gets the full picture in one round trip.
function validateProduct(req, res, next) {
  const { name, category, prices } = req.body || {};
  const errors = [];

  if (typeof name !== "string" || name.trim().length < 2) {
    errors.push("name must be a string with at least 2 characters.");
  }

  if (typeof category !== "string" || !ALLOWED_CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${ALLOWED_CATEGORIES.join(", ")}.`);
  }

  if (typeof prices !== "object" || prices === null || Array.isArray(prices)) {
    errors.push("prices must be an object mapping store name to price.");
  } else {
    const storeEntries = Object.entries(prices);
    if (storeEntries.length < 2) {
      errors.push("prices must include at least 2 stores to compare.");
    }
    for (const [store, value] of storeEntries) {
      if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
        errors.push(`prices.${store} must be a positive number.`);
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors,
    });
  }

  next();
}

module.exports = validateProduct;
