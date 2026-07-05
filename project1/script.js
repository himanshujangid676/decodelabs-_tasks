/* ============================================
   PriceTracker — vanilla JS (no frameworks)
   ============================================ */

// ---- Demo data --------------------------------------------------
// Each product lists what it costs on every store today.
// In a real build this array would come from a backend/API layer.
const STORES = ["Amazon", "Flipkart", "Meesho", "Myntra", "Brand Store"];

const ICONS = {
  Electronics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="12" rx="1.5"/><path d="M2 19h20M9 19l1-3h4l1 3"/></svg>',
  Fashion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 4 L12 7 L16 4 L20 7 L17 10 V21 H7 V10 L4 7 Z"/></svg>',
  Home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 11 L12 3 L21 11"/><path d="M5 10 V21 H19 V10"/></svg>'
};

const PRODUCTS = [
  { id: "p1", name: "Wireless Over-Ear Headphones", category: "Electronics", prices: { "Amazon": 3499, "Flipkart": 3299, "Meesho": 3599, "Myntra": 3899, "Brand Store": 3999 } },
  { id: "p2", name: "Everyday Running Shoes", category: "Fashion", prices: { "Amazon": 2199, "Flipkart": 2349, "Meesho": 1999, "Myntra": 2099, "Brand Store": 2599 } },
  { id: "p3", name: "Fitness Smartwatch", category: "Electronics", prices: { "Amazon": 4999, "Flipkart": 4799, "Meesho": 5199, "Myntra": 5499, "Brand Store": 5999 } },
  { id: "p4", name: "Cotton Kurta Set", category: "Fashion", prices: { "Amazon": 1299, "Flipkart": 1199, "Meesho": 899, "Myntra": 1099, "Brand Store": 1499 } },
  { id: "p5", name: "Digital Air Fryer 4L", category: "Home", prices: { "Amazon": 3999, "Flipkart": 3799, "Meesho": 4199, "Myntra": 4499, "Brand Store": 4299 } },
  { id: "p6", name: "Everyday Laptop Backpack", category: "Fashion", prices: { "Amazon": 1099, "Flipkart": 999, "Meesho": 849, "Myntra": 1199, "Brand Store": 1399 } },
  { id: "p7", name: "Portable Bluetooth Speaker", category: "Electronics", prices: { "Amazon": 1799, "Flipkart": 1699, "Meesho": 1899, "Myntra": 1999, "Brand Store": 2199 } },
  { id: "p8", name: "Cotton Double Bedsheet Set", category: "Home", prices: { "Amazon": 999, "Flipkart": 949, "Meesho": 749, "Myntra": 899, "Brand Store": 1199 } },
];

// ---- Session state (no localStorage — resets on reload) --------
const state = {
  query: "",
  category: "all",
  sort: "savings",
  onlyWatchlist: false,
  watchlist: new Set(),
};

// ---- Helpers -----------------------------------------------------
const money = (n) => "₹" + n.toLocaleString("en-IN");

function priceStats(product) {
  const entries = Object.entries(product.prices).sort((a, b) => a[1] - b[1]);
  const lowest = entries[0];
  const highest = entries[entries.length - 1];
  const savings = highest[1] - lowest[1];
  const savingsPct = Math.round((savings / highest[1]) * 100);
  return { entries, lowest, highest, savings, savingsPct };
}

function matchesFilters(product) {
  const q = state.query.trim().toLowerCase();
  const matchesQuery = !q || product.name.toLowerCase().includes(q);
  const matchesCategory = state.category === "all" || product.category === state.category;
  const matchesWatch = !state.onlyWatchlist || state.watchlist.has(product.id);
  return matchesQuery && matchesCategory && matchesWatch;
}

function sortedProducts(list) {
  const copy = [...list];
  if (state.sort === "savings") {
    copy.sort((a, b) => priceStats(b).savings - priceStats(a).savings);
  } else if (state.sort === "lowprice") {
    copy.sort((a, b) => priceStats(a).lowest[1] - priceStats(b).lowest[1]);
  } else {
    copy.sort((a, b) => a.name.localeCompare(b.name));
  }
  return copy;
}

// ---- Rendering -----------------------------------------------------
function renderCard(product) {
  const { entries, lowest, savings, savingsPct } = priceStats(product);
  const maxPrice = entries[entries.length - 1][1];
  const isWatched = state.watchlist.has(product.id);

  const rows = entries.map(([store, price], i) => {
    const isBest = i === 0;
    const widthPct = Math.max(18, Math.round((price / maxPrice) * 100));
    return `
      <div class="price-row ${isBest ? "is-best" : ""}">
        <span class="store-label"><span class="rank-num">${i + 1}</span>${store}</span>
        <span class="bar-track"><span class="bar-fill" data-target="${widthPct}"></span></span>
        <span class="price-value">${money(price)}</span>
      </div>`;
  }).join("");

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="card-top">
        <div class="card-icon" aria-hidden="true">${ICONS[product.category]}</div>
        <div class="card-heading">
          <h3>${product.name}</h3>
          <span class="card-category">${product.category}</span>
        </div>
        <button class="watch-btn" type="button" data-watch="${product.id}"
          aria-pressed="${isWatched}" aria-label="${isWatched ? "Remove from" : "Add to"} watchlist: ${product.name}">
          <svg viewBox="0 0 24 24" fill="${isWatched ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8">
            <path d="M12 21c-5-4-9-7.5-9-11.5A5 5 0 0 1 12 6a5 5 0 0 1 9 3.5C21 13.5 17 17 12 21Z"/>
          </svg>
        </button>
      </div>

      <span class="best-tag">Best: ${lowest[0]}</span>

      <div class="savings-banner">
        💸 Save ${money(savings)} (${savingsPct}%) vs. the priciest listing
      </div>

      <div class="price-race" role="img" aria-label="Price comparison across stores, cheapest listed first">
        ${rows}
      </div>

      <div class="card-footer">
        <span>Updated just now</span>
        <a href="#" data-view="${product.id}">View at ${lowest[0]} →</a>
      </div>
    </article>`;
}

function renderGrid() {
  const grid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");
  const countEl = document.getElementById("resultsCount");
  const headingEl = document.getElementById("resultsHeading");

  const filtered = sortedProducts(PRODUCTS.filter(matchesFilters));

  grid.innerHTML = filtered.map(renderCard).join("");
  emptyState.hidden = filtered.length !== 0;

  countEl.textContent = filtered.length === PRODUCTS.length
    ? `Showing all ${filtered.length} products`
    : `${filtered.length} of ${PRODUCTS.length} products match`;

  headingEl.textContent = state.category === "all" ? "All products" : state.category;

  // animate bars in on next frame
  requestAnimationFrame(() => {
    grid.querySelectorAll(".bar-fill").forEach(el => {
      el.style.width = el.dataset.target + "%";
    });
  });

  renderWatchlist();
  updateStats(filtered);
}

function renderWatchlist() {
  const wlGrid = document.getElementById("watchlistGrid");
  const wlEmpty = document.getElementById("watchlistEmpty");
  const items = PRODUCTS.filter(p => state.watchlist.has(p.id));

  wlEmpty.hidden = items.length !== 0;

  wlGrid.innerHTML = items.map(p => {
    const { lowest } = priceStats(p);
    return `
      <div class="watchlist-item">
        <span><strong>${p.name}</strong>${p.category}</span>
        <span class="wl-price">${money(lowest[1])} <small>· ${lowest[0]}</small></span>
      </div>`;
  }).join("");
}

function updateStats(filtered) {
  document.getElementById("statProducts").textContent = PRODUCTS.length;
  const avgSavings = Math.round(
    PRODUCTS.reduce((sum, p) => sum + priceStats(p).savings, 0) / PRODUCTS.length
  );
  document.getElementById("statSavings").textContent = money(avgSavings);
}

// ---- Event wiring -----------------------------------------------------
document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  state.query = document.getElementById("searchInput").value;
  renderGrid();
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  state.query = e.target.value;
  renderGrid();
});

document.getElementById("categoryChips").addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("is-active"));
  btn.classList.add("is-active");
  state.category = btn.dataset.category;
  renderGrid();
});

document.querySelectorAll('input[name="sort"]').forEach(radio => {
  radio.addEventListener("change", (e) => {
    state.sort = e.target.value;
    renderGrid();
  });
});

document.getElementById("onlyWatchlist").addEventListener("change", (e) => {
  state.onlyWatchlist = e.target.checked;
  renderGrid();
});

document.getElementById("productGrid").addEventListener("click", (e) => {
  const watchBtn = e.target.closest("[data-watch]");
  if (watchBtn) {
    const id = watchBtn.dataset.watch;
    if (state.watchlist.has(id)) {
      state.watchlist.delete(id);
    } else {
      state.watchlist.add(id);
    }
    renderGrid();
    return;
  }
  const viewLink = e.target.closest("[data-view]");
  if (viewLink) {
    e.preventDefault();
    viewLink.textContent = "Opening store…";
    setTimeout(() => {
      viewLink.textContent = viewLink.textContent.replace("Opening store…", "") || "Visited ✓";
    }, 900);
  }
});

const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");
navToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});
primaryNav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    primaryNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// ---- Init -----------------------------------------------------
renderGrid();
