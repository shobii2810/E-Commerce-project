console.log("Starting server...");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ---------------- MODELS ----------------
const Product = require("./models/product");
const User = require("./models/user");
const Order = require("./models/order");

// ---------------- MONGODB (IMPORTANT FIX) ----------------
// Replace MONGO_URL in Render / Railway environment variables
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log("MongoDB Error ❌", err));

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
    res.send("Server running 🚀");
});

// ---------------- SIGNUP ----------------
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send("Enter all fields ❌");
    }

    try {
        const existing = await User.findOne({ username });

        if (existing) {
            return res.send("User already exists ❌");
        }

        const user = new User({ username, password });
        await user.save();

        res.send("User created ✅");
    } catch (err) {
        res.send("Error ❌");
    }
});

// ---------------- LOGIN ----------------
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ success: false });
    }

    try {
        const user = await User.findOne({ username, password });

        if (user) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        res.json({ success: false });
    }
});

// ---------------- PRODUCTS ----------------
app.post("/add-product", async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.send("Product Added ✅");
    } catch (err) {
        res.send("Error adding product ❌");
    }
});

app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.send("Error fetching products ❌");
    }
});

// ---------------- ORDERS ----------------
app.post("/place-order", async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.send("Order Saved ✅");
    } catch (err) {
        res.send("Error placing order ❌");
    }
});

// ---------------- START SERVER (IMPORTANT FIX) ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});