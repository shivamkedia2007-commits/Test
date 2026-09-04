from db import init_db
from app import app

init_db()
app.run(host="0.0.0.0", port=5000, debug=True)
