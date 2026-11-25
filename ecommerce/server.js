const express = require("express");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Reuse one connection attempt per server process
let dbPromise;

function ensureDatabase() {
  if (!dbPromise) {
    dbPromise = connectDB().catch((error) => {
      // Allow a later request to retry after a connection failure
      dbPromise = null;
      throw error;
    });
  }

  return dbPromise;
}

// Connect before handling API requests
app.use("/api", async (req, res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);
    res.status(503).json({ message: "Database is unavailable." });
  }
});

// Product API routes
app.use("/api/products", productRoutes);

// Unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found." });
});

// Serve pages, CSS, JavaScript, and images
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Unknown pages
app.use((req, res) => {
  res.status(404).send("Page not found.");
});

// Start locally. On Vercel, export the app for the platform to run.
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