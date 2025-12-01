const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const BookingRoute = require("./routes/bookingRoute");
const TripPlanRoutes = require("./routes/tripPlanRoute");
const UserRoutes = require("./routes/userRoute");
const ProgramRoutes = require("./routes/programRoute");
const PlaceRoutes = require("./routes/placeRoute");
const AuthRoutes = require("./routes/authRoute");
const PostRoutes = require("./routes/postRoute");
const TravelRoutes = require("./routes/travelRoute");
const ContactRoutes = require("./routes/contactRoute");
const ReviewRoutes = require("./routes/reviewRoute");
const AttractionRoutes = require("./routes/attractionRoute");

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://127.0.0.1:5500",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static serving for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// MongoDB Connection
main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/TripPlanDB");
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}

// Routes
app.use("/api", AuthRoutes)
app.use("/api", BookingRoute);
app.use("/api", TripPlanRoutes);
app.use("/api", UserRoutes);
app.use("/api", ProgramRoutes);
app.use("/api", PlaceRoutes);
app.use("/api", PostRoutes);
app.use("/api", TravelRoutes);
app.use("/api", ContactRoutes);
app.use("/api", ReviewRoutes);
app.use("/api", AttractionRoutes);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});


// Server
app.listen(8000, () => {
  console.log("Server Running at port 8000");
});