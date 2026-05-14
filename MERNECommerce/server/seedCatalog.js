const Product = require("./models/Product");

const demoProducts = [
  {
    name: "Canvas Tote",
    description: "Sturdy everyday bag with reinforced handles.",
    price: 24.99,
    stock: 40,
  },
  {
    name: "Stainless Bottle",
    description: "Insulated 750ml bottle, keeps drinks cold for hours.",
    price: 32.5,
    stock: 60,
  },
  {
    name: "Wireless Earbuds",
    description: "Lightweight earbuds with charging case (simulated).",
    price: 59.99,
    stock: 25,
  },
  {
    name: "Desk Lamp LED",
    description: "Adjustable arm, warm and cool light modes.",
    price: 45.0,
    stock: 18,
  },
];

async function seedIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) return;
  await Product.insertMany(demoProducts);
  console.log("Seeded demo products.");
}

module.exports = { seedIfEmpty };
