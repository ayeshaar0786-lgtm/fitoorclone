const connectDB = require("../config/db");
const Product = require("../models/product");

module.exports = async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === "GET") {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.status(200).json(products);
    }

    if (req.method === "POST") {
      const product = await Product.create(req.body);
      return res.status(201).json(product);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: "Method not allowed." });
  } catch (error) {
    console.error("Products API error:", error);
    return res.status(500).json({ message: "Could not process products request." });
  }
};