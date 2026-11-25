const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const Product = require("../../models/Product");

module.exports = async function handler(req, res) {
  try {
    await connectDB();

    const { id } = req.query;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    if (req.method === "GET") {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: "Product not found." });
      return res.status(200).json(product);
    }

    if (req.method === "PUT") {
      const product = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      });
      if (!product) return res.status(404).json({ message: "Product not found." });
      return res.status(200).json(product);
    }

    if (req.method === "DELETE") {
      const product = await Product.findByIdAndDelete(id);
      if (!product) return res.status(404).json({ message: "Product not found." });
      return res.status(200).json({ message: "Product deleted successfully." });
    }

    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    return res.status(405).json({ message: "Method not allowed." });
  } catch (error) {
    console.error("Product API error:", error);
    return res.status(500).json({ message: "Could not process product request." });
  }
};