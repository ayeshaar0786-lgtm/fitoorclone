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

// Clear English response for other API paths
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found." });
});

// Serve the homepage at /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle other missing pages
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();