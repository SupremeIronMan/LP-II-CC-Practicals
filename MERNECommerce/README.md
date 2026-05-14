# MERN Mini Shop

Same footprint as the other minimal MERN apps in this workspace: Express + Mongoose API, React + Vite + Axios UI, MongoDB, optional Docker bundle.

## Features

- **Products**: list, detail, create, update, delete (`/api/products`). Empty database gets a small **demo catalog** on first server start.
- **Cart (client)**: add, change quantity, remove; stock limits enforced in the UI.
- **Simulated checkout** (`POST /api/orders`): validates stock, **decrements inventory**, saves an order with line snapshots and total (no payments).
- **Order history** (`GET /api/orders`): last 50 orders for the demo.

## Stack and Node

Dependencies use **semver ranges** (not `latest`) and **`engines.node` `>=18.18.0 <25`** for current LTS compatibility.

## Local development

1. Run MongoDB (local or `docker compose up mongo -d` from this folder).

2. **API**

   ```bash
   cd server
   cp .env.example .env
   npm install
   npm run dev
   ```

3. **Client** (Vite proxies `/api` to port 5000)

   ```bash
   cd client
   npm install
   npm run dev
   ```

Open the URL Vite prints (default `http://localhost:5173`).

## Environment

| Variable | Role |
|----------|------|
| `PORT` | API port (default `5000`). |
| `MONGO_URI` | Mongo URL (default `mongodb://127.0.0.1:27017/shopdb`). |
| `CLIENT_ORIGIN` | Dev CORS origin (default `http://localhost:5173`). |
| `NODE_ENV` | `production` serves the built SPA from `client-dist`. |

Client: optional `VITE_API_URL` (no trailing slash); leave unset for same-origin or dev proxy.

## API summary

- `GET /api/health`
- `GET|POST /api/products`, `GET|PUT|DELETE /api/products/:id`
- `GET|POST /api/orders`, `GET /api/orders/:id`

**Checkout body**

```json
{
  "customerName": "Alex",
  "items": [
    { "productId": "<mongo id>", "quantity": 2 }
  ]
}
```

## Docker

```bash
docker compose up --build
```

Then open `http://localhost:5000`. If port `27017` is already used locally, stop the other Mongo instance or change the host port mapping in `docker-compose.yml`.

## Production build (no Docker)

```bash
cd client && npm ci && npm run build
cd ../server && npm ci --omit=dev
```

Copy `client/dist` to `server/client-dist`, set `NODE_ENV=production` and `MONGO_URI`, run `node index.js` from `server`.
