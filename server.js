console.log("Starting server...");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Models
const Product = require("./models/product");
const User = require("./models/user");
const Order = require("./models/order");

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// ---------------- TEST ----------------
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
    const product = new Product(req.body);
    await product.save();
    res.send("Product Added ✅");
});

app.get("/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});


// ---------------- ORDERS ----------------
app.post("/place-order", async (req, res) => {
    const order = new Order(req.body);
    await order.save();
    res.send("Order Saved ✅");
});


// ---------------- START ----------------
app.listen(5000, () => {
    console.log("Server running on port 5000");
});