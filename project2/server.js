const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const productsRouter = require("./routes/products.routes");
const watchlistRouter = require("./routes/watchlist.routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());              // let the Project 1 frontend call this API from any origin
app.use(express.json());      // parse JSON request bodies
app.use(morgan("dev"));       // log method, path, status, response time

// Health check — useful for uptime monitors and for confirming the server is alive
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", uptimeSeconds: Math.round(process.uptime()) });
});

app.use("/api/products", productsRouter);
app.use("/api/watchlist", watchlistRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`PriceTracker API listening on http://localhost:${PORT}`);
});
