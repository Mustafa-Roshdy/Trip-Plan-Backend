const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

// MongoDB Connection
main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(`${process.env.DB_URL}/TripPlanDB`);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}

const BookingRoute = require("./routes/bookingRoute.js");
const TripPlanRoutes = require("./routes/tripPlanRoute.js");
const UserRoutes = require("./routes/userRoute.js");
const ProgramRoutes = require("./routes/programRoute.js");
const PlaceRoutes = require("./routes/placeRoute.js");
const AuthRoutes = require("./routes/authRoute.js");
const PostRoutes = require("./routes/postRoute.js");
const TravelRoutes = require("./routes/travelRoute.js");
const ContactRoutes = require("./routes/contactRoute.js");
const ReviewRoutes = require("./routes/reviewRoute.js");
const AttractionRoutes = require("./routes/attractionRoute.js");

const app = express();

const allowedOrigins = [
  "http://127.0.0.1:3000",
  "http://127.0.0.1:8080",
  "http://127.0.0.1:5500",
];

app.use(cors())
  // cors({
  //   origin: function (origin, callback) {
  //     if (!origin || allowedOrigins.includes(origin)) {
  //       return callback(null, true);
  //     }
  //     return callback(new Error("Not allowed by CORS"));
  //   },
  //   credentials: true,
  // })
// );
// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static serving for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));





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
module.exports = app;

// Server

