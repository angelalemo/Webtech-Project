let cart = [];

// แสดงสินค้าทั้งหมด
function displayProducts(filteredProducts = products) {
    const container = document.getElementById("productsContainer");
    container.innerHTML = "";

    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        container.appendChild(productCard);
    });
}

// กรองสินค้าโดยหมวดหมู่
function filterByCategory(category) {
    if(category === "All") {
        displayProducts(products);
        return;
    }
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}

// ค้นหาสินค้า
function searchProducts() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
    displayProducts(filteredProducts);
}

// เพิ่มสินค้าไปยังตะกร้า
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingProduct = cart.find(p => p.id === productId);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCartToFile();
    alert("Product added to cart!");
}

// แสดงสินค้าในตะกร้า
function displayCart() {
    fetch("http://localhost:3000/cart")
        .then(response => response.json())
        .then(cartData => {
            const container = document.getElementById("cartContainer");
            container.innerHTML = ""; // ล้างข้อมูลเดิม

            if (cartData.length === 0) {
                container.innerHTML = "<p>Your cart is empty.</p>";
                return;
            }

            cartData.forEach(product => {
                const productCard = document.createElement("div");
                productCard.className = "product-card";
                productCard.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Price:</strong> ${product.pricey}</p>
                    <p><strong>Quantity:</strong> ${product.quantity}</p>
                    <button onclick="removeFromCart(${product.id})">Remove</button>
                `;
                container.appendChild(productCard);
            });
        })
        .catch(err => console.error("Error fetching cart data:", err));
}

// บันทึกข้อมูลตะกร้าไปยังไฟล์ JSON
function saveCartToFile() {
    fetch("http://localhost:3000/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(cart) // ส่งตะกร้าทั้งหมดไปยังเซิร์ฟเวอร์
    })
    .then(response => {
        if (response.ok) {
            alert("Cart saved successfully!");
        } else {
            alert("Error saving cart.");
        }
    })
    .catch(err => console.error("Error:", err));
}

function removeFromCart(productId) {
    fetch(`http://localhost:3000/cart/${productId}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                alert("Product removed successfully!");
                displayCart(); // อัปเดตตะกร้าหลังลบสินค้า
            } else {
                alert("Error removing product.");
            }
        })
        .catch(err => console.error("Error:", err));
}

// แสดงหน้า Check-Out
function displayCheckout() {
    fetch("http://localhost:3000/checkout")
        .then(response => response.json())
        .then(cartData => {
            const checkoutContainer = document.getElementById("checkoutContainer");
            checkoutContainer.innerHTML = ""; // ล้างข้อมูลเดิม

            if (cartData.length === 0) {
                checkoutContainer.innerHTML = "<p>Your cart is empty.</p>";
                return;
            }

            let totalPrice = 0;

            cartData.forEach(product => {
                const productRow = document.createElement("div");
                productRow.className = "checkout-row";
                productRow.innerHTML = `
                    <p><strong>${product.name}</strong> (x${product.quantity}) - $${product.quantity * product.price}</p>
                    <button onclick="removeFromCart(${product.id}, true)">Remove</button>
                `;
                checkoutContainer.appendChild(productRow);

                totalPrice += product.quantity * product.price; // คำนวณราคารวม
            });

            const totalRow = document.createElement("div");
            totalRow.className = "total-row";
            totalRow.innerHTML = `
                <h3>Total: $${totalPrice}</h3>
                <button onclick="confirmPayment(${totalPrice})">Pay</button>
            `;
            checkoutContainer.appendChild(totalRow);
        })
        .catch(err => console.error("Error fetching checkout data:", err));
}

// ยืนยันการชำระเงิน
function confirmPayment(totalPrice) {
    if (confirm(`The total price is $${totalPrice}. Do you want to proceed?`)) {
        alert("Payment successful!");
        clearCart(); // ล้างตะกร้าหลังชำระเงิน
    }
}

// ล้างตะกร้าหลังชำระเงิน
function clearCart() {
    fetch("http://localhost:3000/cart", {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                alert("Cart cleared.");
                displayCart(); // อัปเดตการแสดงผลของตะกร้า
                displayCheckout(); // อัปเดตการแสดงผลในหน้าชำระเงิน
            } else {
                alert("Error clearing cart.");
            }
        })
        .catch(err => console.error("Error:", err));
}


// โหลดสินค้าเมื่อเปิดหน้าเว็บ
displayProducts();
