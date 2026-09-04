# AgriSaathi Marketplace - Combined Full-Stack App

This folder combines the supplied AgriSaathi frontend with the supplied SQLite database/backend work and adds the missing integration layer.

## What is connected
- Buyer/seller login against the database.
- Buyer and seller signup with password hashing.
- Address records stored in `addresses` and linked through `address_id`.
- Hidden/generated buyer `customer_id`, cart ID and seller ID.
- Seller Kisaan ID, bank account and optional GST.
- Live marketplace products read from SQLite instead of the old hard-coded product list.
- Product names open a product-detail page.
- Seller can list new harvest/products.
- Search works against product, farmer and location fields.
- A simple logistics quote API is included as the integration point for future maps/carrier APIs.
- Existing product/cart UI and imagery are retained.

## Folder structure
```
AgriSaathi-Marketplace/
  frontend/                 # React + TanStack Start + Vite UI
  backend/                  # Flask REST API
  database/Database.db      # supplied SQLite database, migrated at startup
```

## Run backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python run.py
```
Backend: http://localhost:5000

## Run frontend
```bash
cd frontend
bun install
# or npm install
bun run dev
# or npm run dev
```
Frontend: http://localhost:5173

Copy `frontend/.env.example` to `frontend/.env` if you need to change the API URL.

## Important
The database is initialized/migrated by the backend. A demo dataset is inserted only when the supplied database has no sellers/products, so the application opens with usable marketplace data without replacing an existing populated database.

The optional API key is only a demo gate. A secret API key cannot be kept secret in browser JavaScript. For production, use proper user authentication/session or token authorization, HTTPS and server-side access control.
