const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const db = new sqlite3.Database("./cart.db");

// Middleware
app.use(bodyParser.json());

// สร้างตารางสำหรับสินค้าในตะกร้า
db.run(`
    CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY,
        name TEXT,
        description TEXT,
        category TEXT,
        quantity INTEGER
    )
`, (err) => {
    if (err) {
        console.error("Error creating table:", err);
    } else {
        console.log("Cart table is ready.");
    }
});

// เพิ่มสินค้าไปยังตะกร้า
app.post("/cart", (req, res) => {
    const { id, name, description, category } = req.body;

    db.get("SELECT * FROM cart WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).send("Error checking product in cart.");
            return;
        }

        if (row) {
            // ถ้าสินค้าซ้ำ ให้เพิ่มจำนวน
            db.run(
                "UPDATE cart SET quantity = quantity + 1 WHERE id = ?",
                [id],
                (err) => {
                    if (err) {
                        res.status(500).send("Error updating quantity.");
                    } else {
                        res.send("Product quantity updated in cart.");
                    }
                }
            );
        } else {
            // ถ้าสินค้าใหม่ ให้เพิ่มลงตาราง
            db.run(
                "INSERT INTO cart (id, name, description, category, quantity) VALUES (?, ?, ?, ?, ?)",
                [id, name, description, category, 1],
                (err) => {
                    if (err) {
                        res.status(500).send("Error adding product to cart.");
                    } else {
                        res.send("Product added to cart.");
                    }
                }
            );
        }
    });
});

// ดึงข้อมูลสินค้าในตะกร้า
app.get("/cart", (req, res) => {
    db.all("SELECT * FROM cart", [], (err, rows) => {
        if (err) {
            res.status(500).send("Error retrieving cart items.");
        } else {
            res.json(rows);
        }
    });
});

// ลบสินค้าออกจากตะกร้า
app.delete("/cart/:id", (req, res) => {
    const id = req.params.id;

    db.run("DELETE FROM cart WHERE id = ?", [id], (err) => {
        if (err) {
            res.status(500).send("Error deleting product from cart.");
        } else {
            res.send("Product removed from cart.");
        }
    });
});

// เริ่มเซิร์ฟเวอร์
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});