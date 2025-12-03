const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// =======================
// CORS Configuration
// =======================
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:8080",
  "http://127.0.0.1:5500",
  "https://golden-nile.vercel.app",     // ضيف لينك الـ frontend بتاعك
  "https://your-frontend-domain.com",   // أو أي دومين تاني
];

app.use(
  cors()
);

// =======================
// Middlewares
// =======================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static folder للصور
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================
// MongoDB Connection – الحل النهائن لمشكلة buffering timed out
// =======================
const connectDB = async () => {
  try {
    console.log("جاري الاتصال بـ MongoDB...");

    const conn = await mongoose.connect(process.env.DB_URL, {
      dbName: "TripPlanDB", // اسم الداتابيز
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 ثواني
      socketTimeoutMS: 45000,          // 45 ثانية
      bufferMaxEntries: 0,             // يوقف الـ buffering فورًا
      bufferCommands: false,           // ← أهم سطر عشان يختفي الـ timeout
    });

    console.log(`MongoDB متصل بنجاح: ${conn.connection.host}`);
  } catch (error) {
    console.error(`خطأ في الاتصال بـ MongoDB: ${error.message}`);
    process.exit(1); // يوقف السيرفر تمامًا لو مفيش داتابيز
  }
};

// استدعاء الاتصال أول حاجة وقبل أي route
connectDB();

// =======================
// Routes
// =======================
app.use("/api", require("./routes/authRoute.js"));
app.use("/api", require("./routes/userRoute.js"));
app.use("/api", require("./routes/placeRoute.js"));
app.use("/api", require("./routes/bookingRoute.js"));
app.use("/api", require("./routes/programRoute.js"));
app.use("/api", require("./routes/tripPlanRoute.js"));
app.use("/api", require("./routes/postRoute.js"));
app.use("/api", require("./routes/travelRoute.js"));
app.use("/api", require("./routes/contactRoute.js"));
app.use("/api", require("./routes/reviewRoute.js"));
app.use("/api", require("./routes/attractionRoute.js"));

// =======================
// 404 Handler
// =======================
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// =======================
// Global Error Handler
// =======================
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`السيرفر شغال على الپورت ${PORT} `);
});

// Graceful Shutdown (مهم جدًا على Render / Railway / Vercel)
process.on("SIGTERM", () => {
  console.log("SIGTERM received: إغلاق السيرفر بأمان...");
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed.");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received: إغلاق السيرفر...");
  server.close(() => {
    mongoose.connection.close();
    process.exit(process.exit(0));
  });
});