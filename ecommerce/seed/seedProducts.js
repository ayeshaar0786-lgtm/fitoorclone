require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const products = [
  {
    name: "River Valley",
    price: 22000,
    description: "Landscape painting of a forest river flowing between white boulders, with swirling ripples and a turquoise sky.",
    image: "/images/photo2.jpg",
    mockup: "/images/river-valley-room.jpg",
    category: "Paintings",
    medium: "Oil",
    orientation: "Square",
  },
  {
    name: "Sunset and Night",
    price: 18000,
    description: "Sunset and night in one canvas: a red and orange sky with a golden sun and two birds, dark hills, and a glowing moon above stars.",
    image: "/images/photo4.jpg",
    mockup: "/images/sunset-night-room.jpg",
    category: "Paintings",
    medium: "Acrylic on canvas",
    frame: "No frame",
    orientation: "Square",
  },
  {
    name: "Flowers in Vase",
    price: 21000,
    description: "Still life painting of pink and purple flowers in a glass vase, set by a window with a soft grey-green background.",
    image: "/images/photo6.jpg",
    mockup: "/images/flowers-room.jpg",
    category: "Still Life",
    medium: "Oil",
    orientation: "Vertical",
  },
  {
    name: "Mountain Cabin",
    price: 24000,
    description: "Landscape painting of a wooden cabin beside a waterfall, with snow-capped mountains and pine trees.",
    image: "/images/photo8.jpg",
    mockup: "/images/mountain-cabin-room.jpg",
    category: "Landscape",
    medium: "Oil",
    orientation: "Vertical",
  },
  {
    name: "Black Horse",
    price: 23000,
    description: "Oil painting on canvas of a black horse with a flowing mane, decorated with gold ornamental patterns.",
    image: "/images/photo9.jpg",
    mockup: "/images/black-horse-room.jpg",
    category: "Animal Life",
    medium: "Oil on canvas",
    orientation: "Vertical",
  },
  {
    name: "Islamic Calligraphy",
    price: 20000,
    description: "Oil and knife painting on canvas with Islamic calligraphy in an abstract style, framed and ready to hang.",
    image: "/images/photo10.jpg",
    mockup: "/images/islamic-calligraphy-room.jpg",
    category: "Calligraphy",
    subcategory: "Abstract",
    size: "24 × 18 in",
    weight: "2 kg",
    medium: "Oil and knife",
    frame: "Included",
    dimension: "Large",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`${products.length} products saved`);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();