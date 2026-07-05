# PriceTracker API

Backend API for **Project 2 — Backend API Development** (DecodeLabs Full Stack Internship).
This is the "nervous system" behind the Project 1 frontend: it holds product data, computes
the price comparison, and answers requests over plain JSON/HTTP.

Built with **Node.js + Express**. Data lives in memory and resets on restart — that's a
deliberate scope cut for this project, called out below under "Not included on purpose."

## Setup

```bash
npm install
npm start
```

Server runs at `http://localhost:4000`. Every response is JSON.

## Endpoints

### Health

| Method | Path          | Description                     |
|--------|---------------|----------------------------------|
| GET    | `/api/health` | Confirms the server is running   |

```bash
curl http://localhost:4000/api/health
```

### Products

| Method | Path                 | Description                                   | Status codes |
|--------|----------------------|------------------------------------------------|---------------|
| GET    | `/api/products`      | List products, with optional filtering/sorting | 200 |
| GET    | `/api/products/:id`  | Get one product with its price comparison      | 200, 404 |
| POST   | `/api/products`      | Create a product                                | 201, 400 |
| PUT    | `/api/products/:id`  | Replace a product's data *(bonus, beyond brief)*| 200, 400, 404 |
| DELETE | `/api/products/:id`  | Remove a product *(bonus, beyond brief)*        | 204, 404 |

**Query params on `GET /api/products`:**
- `search` — case-insensitive substring match on name
- `category` — `Electronics`, `Fashion`, or `Home`
- `sort` — `savings` (default), `lowprice`, or `name`

```bash
# List everything, cheapest-savings-first (default)
curl "http://localhost:4000/api/products"

# Search + filter + sort
curl "http://localhost:4000/api/products?search=shoe&category=Fashion&sort=lowprice"

# Get one product
curl "http://localhost:4000/api/products/p1"

# Create a product
curl -X POST http://localhost:4000/api/products \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Ceramic Coffee Mug Set",
        "category": "Home",
        "prices": { "Amazon": 599, "Flipkart": 549, "Meesho": 499 }
      }'
```

A response from `GET /api/products/p1` looks like:

```json
{
  "id": "p1",
  "name": "Wireless Over-Ear Headphones",
  "category": "Electronics",
  "prices": { "Amazon": 3499, "Flipkart": 3299, "Meesho": 3599, "Myntra": 3899, "Brand Store": 3999 },
  "ranked": [
    { "rank": 1, "store": "Flipkart", "price": 3299 },
    { "rank": 2, "store": "Amazon", "price": 3499 },
    { "rank": 3, "store": "Meesho", "price": 3599 },
    { "rank": 4, "store": "Myntra", "price": 3899 },
    { "rank": 5, "store": "Brand Store", "price": 3999 }
  ],
  "bestStore": "Flipkart",
  "bestPrice": 3299,
  "worstStore": "Brand Store",
  "worstPrice": 3999,
  "savings": 700,
  "savingsPercent": 18
}
```

### Watchlist

| Method | Path                        | Description                          | Status codes |
|--------|-----------------------------|----------------------------------------|---------------|
| GET    | `/api/watchlist`            | List watched products                  | 200 |
| POST   | `/api/watchlist`            | Add a product to the watchlist         | 201, 400, 404 |
| DELETE | `/api/watchlist/:productId` | Remove a product from the watchlist    | 204, 404 |

```bash
curl -X POST http://localhost:4000/api/watchlist \
  -H "Content-Type: application/json" \
  -d '{"productId": "p3"}'

curl http://localhost:4000/api/watchlist

curl -X DELETE http://localhost:4000/api/watchlist/p3
```

## Validation rules

`POST` / `PUT` on `/api/products` reject the request with `400` and a `details` array
listing every problem at once if:
- `name` isn't a string of at least 2 characters
- `category` isn't one of `Electronics`, `Fashion`, `Home`
- `prices` isn't an object with at least 2 stores, each mapped to a positive number

```json
{
  "error": "Validation failed",
  "details": [
    "category must be one of: Electronics, Fashion, Home.",
    "prices.Amazon must be a positive number."
  ]
}
```

## Status code vocabulary used here

| Code | Meaning | Used when |
|------|---------|-----------|
| 200 | OK | successful GET/PUT |
| 201 | Created | successful POST |
| 204 | No Content | successful DELETE |
| 400 | Bad Request | validation failed |
| 404 | Not Found | id doesn't exist, or unknown route |
| 500 | Internal Server Error | unexpected server-side failure |

## Project structure

```
pricetracker-api/
├── server.js                    # app entry point, middleware wiring
├── routes/
│   ├── products.routes.js       # GET / GET:id / POST / PUT / DELETE
│   └── watchlist.routes.js      # GET / POST / DELETE
├── middleware/
│   ├── validateProduct.js       # "never trust the client" input validation
│   └── errorHandler.js          # 404 + centralized error handler
├── utils/
│   └── priceStats.js            # ranks stores and computes savings
├── data/
│   └── products.js              # in-memory data store + CRUD helpers
└── package.json
```

## Not included on purpose

This is a Project 2 milestone focused on API fundamentals, not a production backend:
- **No persistent database** — data resets on restart. A real version would swap
  `data/products.js` for a Postgres/Mongo layer without changing the routes.
- **No authentication** — every endpoint is open. Auth would sit in front of the
  mutating routes (`POST`/`PUT`/`DELETE`) as middleware, same pattern as `validateProduct`.
- **No rate limiting** — worth adding before this ever sees real traffic.

## Connecting to the Project 1 frontend

The frontend currently uses a hardcoded `PRODUCTS` array in `script.js`. To wire it to
this API, replace that array with a `fetch("http://localhost:4000/api/products")` call
on page load — the response shape already matches what the product cards expect
(`bestStore`, `savings`, `ranked`, etc.). Happy to make that change if you want the two
projects connected end to end.
