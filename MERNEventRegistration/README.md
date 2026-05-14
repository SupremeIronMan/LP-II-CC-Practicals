# MERN Event registration (minimal)

Single-page React client and Express + Mongoose API. Guests pick an event and register with **full name**, **email**, and optional **phone**. Same deployment shape as the other small MERN apps in this workspace.

## Behavior

- **Events**: title, description, date/time, location, optional **capacity** (`maxAttendees`). Seeded sample events when the database is empty.
- **Registrations**: stored per event; **one registration per email per event** (unique index). If capacity is set and reached, new sign-ups get **409**.
- **Delete event** removes its registrations as well.

## Stack

Node **18+ / 20 / 22** (`engines` in `package.json`). Dependencies use pinned semver ranges (no `latest`).

## Local dev

1. MongoDB running (local or `docker compose up mongo -d`).

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

## API

| Method | Path | Notes |
|--------|------|--------|
| GET | `/api/health` | Liveness |
| CRUD | `/api/events` | List (by date), create, read, update, delete |
| GET, POST, DELETE | `/api/registrations` | List (optional `?eventId=`), create body `{ eventId, fullName, email, phone? }`, delete `:id` |

## Docker

```bash
docker compose up --build
```

Open `http://localhost:5000`. If port **27017** is already in use, adjust the Mongo port mapping or stop the other instance.

## Production (no Docker)

Build the client, copy `dist` into `server/client-dist`, set `NODE_ENV=production` and `MONGO_URI`, then `node index.js` from `server`.
