const express = require("express");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve index.html, shop.html, product.html, cart.html, CSS, JS, and images
app.use(express.static(path.join(__dirname, "public")));

// Product API routes: /api/products and /api/products/:id
app.use("/api/products", productRoutes);

// Response for other API paths
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found." });
});

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 for missing pages
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

// --- WORKS ON BOTH LOCAL AND VERCEL ---

let isConnected = false;

async function ensureDB() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
}

// Connect to DB before handling requests (important for Vercel)
app.use(async (req, res, next) => {
  try {
    await ensureDB();
  } catch (err) {
    console.error("DB Error:", err.message);
  }
  next();
});

// Start server only on local machine, not on Vercel
if (!process.env.VERCEL) {
  ensureDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }).catch((err) => {
    console.error("Failed to start server:", err.message);
  });
}

// Must export app for Vercel
module.exports = app;