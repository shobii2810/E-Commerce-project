const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: String,
    items: Array,
    total: Number,
    payment: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);