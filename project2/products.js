// In-memory "database" — resets whenever the server restarts.
// Same shape as the Project 1 frontend so the two can eventually talk to each other.

let products = [
  { id: "p1", name: "Wireless Over-Ear Headphones", category: "Electronics", prices: { Amazon: 3499, Flipkart: 3299, Meesho: 3599, Myntra: 3899, "Brand Store": 3999 } },
  { id: "p2", name: "Everyday Running Shoes", category: "Fashion", prices: { Amazon: 2199, Flipkart: 2349, Meesho: 1999, Myntra: 2099, "Brand Store": 2599 } },
  { id: "p3", name: "Fitness Smartwatch", category: "Electronics", prices: { Amazon: 4999, Flipkart: 4799, Meesho: 5199, Myntra: 5499, "Brand Store": 5999 } },
  { id: "p4", name: "Cotton Kurta Set", category: "Fashion", prices: { Amazon: 1299, Flipkart: 1199, Meesho: 899, Myntra: 1099, "Brand Store": 1499 } },
  { id: "p5", name: "Digital Air Fryer 4L", category: "Home", prices: { Amazon: 3999, Flipkart: 3799, Meesho: 4199, Myntra: 4499, "Brand Store": 4299 } },
  { id: "p6", name: "Everyday Laptop Backpack", category: "Fashion", prices: { Amazon: 1099, Flipkart: 999, Meesho: 849, Myntra: 1199, "Brand Store": 1399 } },
  { id: "p7", name: "Portable Bluetooth Speaker", category: "Electronics", prices: { Amazon: 1799, Flipkart: 1699, Meesho: 1899, Myntra: 1999, "Brand Store": 2199 } },
  { id: "p8", name: "Cotton Double Bedsheet Set", category: "Home", prices: { Amazon: 999, Flipkart: 949, Meesho: 749, Myntra: 899, "Brand Store": 1199 } },
];

let nextId = 9;

module.exports = {
  getAll: () => products,
  getById: (id) => products.find((p) => p.id === id),
  add: (product) => {
    const withId = { id: `p${nextId++}`, ...product };
    products.push(withId);
    return withId;
  },
  update: (id, changes) => {
    const product = products.find((p) => p.id === id);
    if (!product) return null;
    Object.assign(product, changes);
    return product;
  },
  remove: (id) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  },
};
