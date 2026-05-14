const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const eventRoutes = require("./routes/events");
const registrationRoutes = require("./routes/registrations");
const { seedIfEmpty } = require("./seedEvents");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventsdb";
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
    message: "Events API is running.",
    docs: ["/api/events", "/api/registrations"],
  });
});

app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

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
