// Turns a raw { store: price } map into the ranked comparison the frontend needs.
function computeStats(product) {
  const entries = Object.entries(product.prices).sort((a, b) => a[1] - b[1]);
  const [cheapestStore, cheapestPrice] = entries[0];
  const [priciestStore, priciestPrice] = entries[entries.length - 1];
  const savings = priciestPrice - cheapestPrice;
  const savingsPercent = priciestPrice === 0 ? 0 : Math.round((savings / priciestPrice) * 100);

  return {
    ...product,
    ranked: entries.map(([store, price], index) => ({ rank: index + 1, store, price })),
    bestStore: cheapestStore,
    bestPrice: cheapestPrice,
    worstStore: priciestStore,
    worstPrice: priciestPrice,
    savings,
    savingsPercent,
  };
}

module.exports = { computeStats };
