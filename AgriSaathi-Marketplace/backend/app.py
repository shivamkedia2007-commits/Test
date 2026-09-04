import os
import sqlite3
from datetime import datetime
from functools import wraps
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import check_password_hash, generate_password_hash

from db import get_db_connection, init_db

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": os.getenv("CORS_ORIGINS", "*").split(",")}})

API_KEY = os.getenv("API_KEY", "")


def api_key_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if API_KEY and request.headers.get("X-API-Key") != API_KEY:
            return jsonify({"error": "Invalid or missing API key"}), 401
        return fn(*args, **kwargs)
    return wrapper


def rows_to_dict(rows):
    return [dict(r) for r in rows]


def validate_common(data):
    required = ["name", "email", "password", "phone", "account_number"]
    missing = [key for key in required if not str(data.get(key, "")).strip()]
    if missing:
        return f"Missing fields: {', '.join(missing)}"
    if len(data["password"]) < 8:
        return "Password must contain at least 8 characters."
    return None


def insert_address(conn, address):
    required = ["line1", "city", "state", "pincode"]
    missing = [key for key in required if not str(address.get(key, "")).strip()]
    if missing:
        raise ValueError(f"Address fields required: {', '.join(missing)}")

    row = conn.execute("SELECT COALESCE(MAX(address_id), 9000) + 1 FROM addresses").fetchone()
    address_id = row[0]
    conn.execute("""
        INSERT INTO addresses
        (address_id, street_line1, street_line2, city, state_province, postal_code, country_code)
        VALUES (?, ?, ?, ?, ?, ?, 'IN')
    """, (
        address_id,
        address["line1"].strip(),
        address.get("line2", "").strip() or None,
        address["city"].strip(),
        address["state"].strip(),
        address["pincode"].strip(),
    ))
    return address_id


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "AgriSaathi API"})


@app.get("/api/products")
@api_key_required
def get_products():
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT p.product_id, p.product_name, p.price_per_kg, p.quantity_available,
               p.date_of_harvest, p.seller_id, s.Seller_name AS farmer,
               a.city || ', ' || a.state_province AS location
        FROM Product p
        JOIN Seller s ON p.seller_id = s.Seller_Id
        LEFT JOIN addresses a ON s.address_id = a.address_id
        ORDER BY p.product_id
    """).fetchall()
    conn.close()
    return jsonify(rows_to_dict(rows))


@app.get("/api/products/<int:product_id>")
@api_key_required
def get_product(product_id):
    conn = get_db_connection()
    row = conn.execute("""
        SELECT p.product_id, p.product_name, p.price_per_kg, p.quantity_available,
               p.date_of_harvest, p.seller_id, s.Seller_name AS seller_name,
               s.Phone_No AS phone_no, s.email, s.kisaan_id,
               a.street_line1, a.city, a.state_province, a.postal_code
        FROM Product p
        JOIN Seller s ON p.seller_id = s.Seller_Id
        LEFT JOIN addresses a ON s.address_id = a.address_id
        WHERE p.product_id = ?
    """, (product_id,)).fetchone()
    conn.close()
    if not row:
        return jsonify({"error": "Product not found"}), 404
    return jsonify(dict(row))


@app.get("/api/products/search")
@api_key_required
def search_products():
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify({"error": "Search query cannot be empty"}), 400
    pattern = f"%{q}%"
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT p.product_id, p.product_name, p.price_per_kg, p.quantity_available,
               p.date_of_harvest, p.seller_id, s.Seller_name AS farmer,
               a.city || ', ' || a.state_province AS location
        FROM Product p
        JOIN Seller s ON p.seller_id = s.Seller_Id
        LEFT JOIN addresses a ON s.address_id = a.address_id
        WHERE p.product_name LIKE ? COLLATE NOCASE
           OR s.Seller_name LIKE ? COLLATE NOCASE
           OR a.city LIKE ? COLLATE NOCASE
           OR a.state_province LIKE ? COLLATE NOCASE
        ORDER BY p.product_name
    """, (pattern, pattern, pattern, pattern)).fetchall()
    conn.close()
    return jsonify({"count": len(rows), "results": rows_to_dict(rows)})


@app.post("/api/auth/login")
@api_key_required
def login():
    data = request.get_json(silent=True) or {}
    role = str(data.get("role", "")).lower().strip()
    email = str(data.get("email", "")).strip().lower()
    password = str(data.get("password", ""))
    if role not in {"buyer", "seller"} or not email or not password:
        return jsonify({"error": "Role, email and password are required."}), 400

    conn = get_db_connection()
    cred = conn.execute("SELECT * FROM auth_credentials WHERE email = ? AND role = ?", (email, role)).fetchone()
    if not cred or not check_password_hash(cred["password_hash"], password):
        conn.close()
        return jsonify({"error": "Invalid email, password or account type."}), 401

    if role == "buyer":
        user = conn.execute("""
            SELECT b.customer_id, b.name, b.email_address, b.phone_no, b.account_number,
                   b.cart_id, b.gst_number, a.address_id, a.street_line1, a.street_line2,
                   a.city, a.state_province, a.postal_code
            FROM Buyer b JOIN addresses a ON b.address_id = a.address_id
            WHERE b.customer_id = ?
        """, (cred["account_id"],)).fetchone()
    else:
        user = conn.execute("""
            SELECT s.Seller_Id AS seller_id, s.Seller_name AS name, s.email,
                   s.Phone_No AS phone_no, s.account_number, s.kisaan_id, s.gst_number,
                   a.address_id, a.street_line1, a.street_line2, a.city,
                   a.state_province, a.postal_code
            FROM Seller s JOIN addresses a ON s.address_id = a.address_id
            WHERE s.Seller_Id = ?
        """, (cred["account_id"],)).fetchone()
    conn.close()
    return jsonify({"message": "Login successful", "role": role, "user": dict(user) if user else None})


@app.post("/api/auth/signup/buyer")
@api_key_required
def signup_buyer():
    data = request.get_json(silent=True) or {}
    error = validate_common(data)
    if error:
        return jsonify({"error": error}), 400
    address = data.get("address") or {}
    conn = get_db_connection()
    try:
        if conn.execute("SELECT 1 FROM auth_credentials WHERE email = ?", (data["email"].strip().lower(),)).fetchone():
            return jsonify({"error": "An account with this email already exists."}), 409
        address_id = insert_address(conn, address)
        next_cart = conn.execute("SELECT COALESCE(MAX(cart_id), 5000) + 1 FROM Buyer").fetchone()[0]
        cur = conn.execute("""
            INSERT INTO Buyer (name, address_id, phone_no, email_address, account_number, cart_id, gst_number)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (data["name"].strip(), address_id, data["phone"].strip(), data["email"].strip().lower(),
              data["account_number"].strip(), next_cart, data.get("gst_number") or None))
        customer_id = cur.lastrowid
        conn.execute("""
            INSERT INTO auth_credentials (role, account_id, email, password_hash)
            VALUES ('buyer', ?, ?, ?)
        """, (customer_id, data["email"].strip().lower(), generate_password_hash(data["password"])))
        conn.commit()
        return jsonify({"message": "Buyer account created", "role": "buyer", "customer_id": customer_id, "cart_id": next_cart}), 201
    except (sqlite3.IntegrityError, ValueError) as exc:
        conn.rollback()
        return jsonify({"error": str(exc)}), 400
    finally:
        conn.close()


@app.post("/api/auth/signup/seller")
@api_key_required
def signup_seller():
    data = request.get_json(silent=True) or {}
    error = validate_common(data)
    if error or not str(data.get("kisaan_id", "")).strip():
        return jsonify({"error": error or "Kisaan ID is required."}), 400
    address = data.get("address") or {}
    conn = get_db_connection()
    try:
        if conn.execute("SELECT 1 FROM auth_credentials WHERE email = ?", (data["email"].strip().lower(),)).fetchone():
            return jsonify({"error": "An account with this email already exists."}), 409
        address_id = insert_address(conn, address)
        seller_id = conn.execute("SELECT COALESCE(MAX(Seller_Id), 1000) + 1 FROM Seller").fetchone()[0]
        conn.execute("""
            INSERT INTO Seller
            (Seller_Id, Seller_name, Phone_No, address_id, Government_ID, email, account_number, kisaan_id, gst_number)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (seller_id, data["name"].strip(), data["phone"].strip(), address_id,
              data["kisaan_id"].strip(), data["email"].strip().lower(), data["account_number"].strip(),
              data["kisaan_id"].strip(), data.get("gst_number") or None))
        conn.execute("""
            INSERT INTO auth_credentials (role, account_id, email, password_hash)
            VALUES ('seller', ?, ?, ?)
        """, (seller_id, data["email"].strip().lower(), generate_password_hash(data["password"])))
        conn.commit()
        return jsonify({"message": "Seller account created", "role": "seller", "seller_id": seller_id}), 201
    except (sqlite3.IntegrityError, ValueError) as exc:
        conn.rollback()
        return jsonify({"error": str(exc)}), 400
    finally:
        conn.close()


@app.get("/api/sellers/<int:seller_id>/products")
@api_key_required
def seller_products(seller_id):
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT product_id, product_name, price_per_kg, quantity_available, date_of_harvest, seller_id
        FROM Product WHERE seller_id = ? ORDER BY product_id DESC
    """, (seller_id,)).fetchall()
    conn.close()
    return jsonify(rows_to_dict(rows))


@app.post("/api/sellers/<int:seller_id>/products")
@api_key_required
def add_seller_product(seller_id):
    data = request.get_json(silent=True) or {}
    required = ["product_name", "price_per_kg", "quantity_available", "date_of_harvest"]
    if any(str(data.get(k, "")).strip() == "" for k in required):
        return jsonify({"error": "Product name, price, quantity and harvest date are required."}), 400
    conn = get_db_connection()
    try:
        if not conn.execute("SELECT 1 FROM Seller WHERE Seller_Id = ?", (seller_id,)).fetchone():
            return jsonify({"error": "Seller not found."}), 404
        cur = conn.execute("""
            INSERT INTO Product (product_name, price_per_kg, quantity_available, date_of_harvest, seller_id)
            VALUES (?, ?, ?, ?, ?)
        """, (data["product_name"].strip(), float(data["price_per_kg"]), float(data["quantity_available"]),
              data["date_of_harvest"].strip(), seller_id))
        conn.commit()
        return jsonify({"message": "Product listed", "product_id": cur.lastrowid}), 201
    except (ValueError, sqlite3.IntegrityError) as exc:
        conn.rollback()
        return jsonify({"error": str(exc)}), 400
    finally:
        conn.close()


@app.get("/api/logistics/quote")
@api_key_required
def logistics_quote():
    quantity = float(request.args.get("quantity", 1))
    distance = float(request.args.get("distance_km", 10))
    if quantity <= 0 or distance < 0:
        return jsonify({"error": "Quantity must be positive and distance cannot be negative."}), 400
    # Simple demo logistics model. Replace with a maps/carrier API later.
    base = 50
    distance_cost = distance * 6
    bulk_discount = min(quantity * 0.5, distance_cost * 0.35)
    estimated = round(max(base + distance_cost - bulk_discount, base), 2)
    eta_days = 1 if distance <= 100 else 2 if distance <= 400 else 3
    return jsonify({"estimated_cost": estimated, "eta_days": eta_days, "distance_km": distance, "quantity": quantity})


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")), debug=True)
