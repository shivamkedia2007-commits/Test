# AgriSaathi Flask API

`app.py` is the single API entry point. `db.py` initializes/migrates the supplied SQLite database.

Endpoints:
- GET `/api/health`
- GET `/api/products`
- GET `/api/products/<id>`
- GET `/api/products/search?q=wheat`
- POST `/api/auth/login`
- POST `/api/auth/signup/buyer`
- POST `/api/auth/signup/seller`
- GET `/api/sellers/<seller_id>/products`
- POST `/api/sellers/<seller_id>/products`
- GET `/api/logistics/quote?quantity=100&distance_km=120`
