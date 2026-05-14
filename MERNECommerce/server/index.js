const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders");
const { seedIfEmpty } = require("./seedCatalog");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopdb";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const isProduction = process.env.NODE_ENV === "production";

app.use(
  cors({
    origin: isProduction ? true : CLIENT_ORIGIN,
    credentials: false,
  })
);
app.use(express.json({ limit: "512kb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    message: "Shop API is running.",
    docs: ["/api/products", "/api/orders"],
  });
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

if (isProduction) {
  const clientBuild = path.join(__dirname, "client-dist");
  app.use(express.static(clientBuild));
  app.get("*", (req, res) => {
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ message: "Not found." });
    }
    return res.sendFile(path.join(clientBuild, "index.html"));
  });
}

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    await seedIfEmpty();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
