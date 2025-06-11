const fs = require('fs');
const path = 'data/cart.json';

// ฟังก์ชันเพิ่มสินค้าไปยัง cart.json
function addToCart1(product) {
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        // อ่านข้อมูลและแปลงเป็น JSON
        let cart = JSON.parse(data);

        // ตรวจสอบว่าสินค้าซ้ำหรือไม่
        const existingProduct = cart.find(p => p.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += 1; // เพิ่มจำนวนสินค้า
        } else {
            product.quantity = 1; // ตั้งค่าเริ่มต้น
            cart.push(product); // เพิ่มสินค้าใหม่
        }

        // เขียนข้อมูลกลับไปยัง cart.json
        fs.writeFile(path, JSON.stringify(cart, null, 2), (err) => {
            if (err) {
                console.error("Error writing file:", err);
            } else {
                console.log("Product added to cart.");
            }
        });
    });
}

// ตัวอย่างการใช้งาน
const newProduct = {
    id: 3,
    name: "Product 3",
    description: "Description 3",
    category: "Category 1"
};

function displayCart1() {
    fs.readFile(path, (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        const cart = JSON.parse(data);
        console.log("Current Cart:", cart);
    });
}

addToCart1(newProduct);
displayCart1();