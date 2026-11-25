const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Database: connect once, reuse everywhere ---
let dbPromise;

function ensureDatabase() {
  if (!dbPromise) {
    dbPromise = connectDB().catch((error) => {
      // Let next request retry if first connect fails
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}

// Block /api until DB is ready
app.use("/api", async (req, res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(503).json({ message: "Database is unavailable." });
  }
});

// --- API Routes ---
app.use("/api/products", productRoutes);

// Unknown API route
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found." });
});

// --- Frontend ---
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Unknown page
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

// --- Start Server ---
// On Vercel, just export app. Locally, connect + listen.
if (!process.env.VERCEL) {
  ensureDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error.message);
      process.exit(1);
    });
}

module.exports = app;