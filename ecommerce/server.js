require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route nahi mila" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server chal raha hai: http://localhost:${PORT}`);
});