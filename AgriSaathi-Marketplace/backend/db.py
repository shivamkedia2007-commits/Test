import os
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_PATH = Path(os.getenv("DATABASE_PATH", BASE_DIR / "database" / "Database.db"))


def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_db_connection()
    cur = conn.cursor()

    # Create the core tables when running against a fresh database, while
    # preserving the supplied schema when it is already present.
    cur.execute("""
        CREATE TABLE IF NOT EXISTS addresses (
            address_id INTEGER PRIMARY KEY,
            street_line1 TEXT NOT NULL,
            street_line2 TEXT,
            city TEXT NOT NULL,
            state_province TEXT NOT NULL,
            postal_code TEXT NOT NULL,
            country_code TEXT NOT NULL DEFAULT 'IN',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Seller (
            Seller_Id INTEGER PRIMARY KEY,
            Seller_name TEXT NOT NULL,
            Phone_No TEXT NOT NULL,
            address_id INTEGER NOT NULL,
            Government_ID TEXT NOT NULL,
            FOREIGN KEY(address_id) REFERENCES addresses(address_id)
        )
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Product (
            product_id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            price_per_kg REAL NOT NULL CHECK(price_per_kg >= 0),
            quantity_available REAL NOT NULL CHECK(quantity_available >= 0),
            date_of_harvest TEXT NOT NULL,
            seller_id INTEGER NOT NULL,
            FOREIGN KEY (seller_id) REFERENCES Seller(Seller_Id)
        )
    """)

    # Add useful Seller fields if the original table does not have them.
    existing = {row[1] for row in cur.execute("PRAGMA table_info(Seller)").fetchall()}
    for name, ddl in [
        ("email", "TEXT"),
        ("account_number", "TEXT"),
        ("kisaan_id", "TEXT"),
        ("gst_number", "TEXT"),
    ]:
        if name not in existing:
            cur.execute(f"ALTER TABLE Seller ADD COLUMN {name} {ddl}")

    cur.execute("""
        CREATE TABLE IF NOT EXISTS Buyer (
            customer_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address_id INTEGER NOT NULL,
            phone_no TEXT NOT NULL,
            email_address TEXT NOT NULL UNIQUE COLLATE NOCASE,
            account_number TEXT NOT NULL,
            cart_id INTEGER NOT NULL UNIQUE,
            gst_number TEXT,
            FOREIGN KEY (address_id) REFERENCES addresses(address_id)
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS auth_credentials (
            auth_id INTEGER PRIMARY KEY AUTOINCREMENT,
            role TEXT NOT NULL CHECK(role IN ('buyer', 'seller')),
            account_id INTEGER NOT NULL,
            email TEXT NOT NULL UNIQUE COLLATE NOCASE,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(role, account_id)
        )
    """)

    cur.execute("CREATE INDEX IF NOT EXISTS idx_product_name ON Product(product_name)")
    cur.execute("CREATE INDEX IF NOT EXISTS idx_product_seller ON Product(seller_id)")

    # Seed a small working demo dataset only when the supplied DB has no sellers/products.
    seller_count = cur.execute("SELECT COUNT(*) FROM Seller").fetchone()[0]
    if seller_count == 0:
        demo_addresses = [
            (9001, "Village Road", "Near Main Market", "Bhopal", "Madhya Pradesh", "462001", "IN"),
            (9002, "Farmers Lane", "Taluka Road", "Indore", "Madhya Pradesh", "452001", "IN"),
            (9003, "Mandi Road", "Sector 4", "Jaipur", "Rajasthan", "302001", "IN"),
        ]
        for row in demo_addresses:
            cur.execute("""
                INSERT OR IGNORE INTO addresses
                (address_id, street_line1, street_line2, city, state_province, postal_code, country_code)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, row)

        sellers = [
            (1001, "Ramesh Yadav", "9876543210", 9001, "KIS001001", "ramesh@agrisaathi.demo", "AC1001001", "KIS001001", None),
            (1002, "Mahesh Patil", "9876543211", 9002, "KIS001002", "mahesh@agrisaathi.demo", "AC1001002", "KIS001002", None),
            (1003, "Suresh Meena", "9876543212", 9003, "KIS001003", "suresh@agrisaathi.demo", "AC1001003", "KIS001003", None),
        ]
        for s in sellers:
            cur.execute("""
                INSERT INTO Seller
                (Seller_Id, Seller_name, Phone_No, address_id, Government_ID, email, account_number, kisaan_id, gst_number)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, s)

    product_count = cur.execute("SELECT COUNT(*) FROM Product").fetchone()[0]
    if product_count == 0:
        products = [
            ("Tomato", 20, 1200, "2026-08-28", 1001),
            ("Potato", 18, 2000, "2026-08-25", 1002),
            ("Onion", 22, 1800, "2026-08-27", 1003),
            ("Carrot", 25, 900, "2026-08-29", 1001),
            ("Cauliflower", 28, 650, "2026-08-30", 1002),
            ("Apple", 120, 750, "2026-08-20", 1003),
            ("Banana", 40, 1100, "2026-08-31", 1003),
            ("Mango", 80, 950, "2026-08-22", 1001),
            ("Wheat", 26, 5000, "2026-08-18", 1002),
            ("Rice", 50, 4200, "2026-08-16", 1003),
            ("Moong Dal", 110, 1800, "2026-08-15", 1001),
            ("Turmeric Powder", 160, 700, "2026-08-14", 1002),
            ("Mustard Oil", 150, 500, "2026-08-13", 1003),
            ("Paneer", 240, 300, "2026-08-30", 1001),
            ("Milk", 56, 1000, "2026-08-31", 1001),
        ]
        cur.executemany("""
            INSERT INTO Product
            (product_name, price_per_kg, quantity_available, date_of_harvest, seller_id)
            VALUES (?, ?, ?, ?, ?)
        """, products)

    conn.commit()
    conn.close()
