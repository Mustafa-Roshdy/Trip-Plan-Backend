const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  // -----------------------------
  // Guest House fields
  // -----------------------------
  arrivalDate: {
    type: Date,
    required: function () {
      return this.bookingType === "guest_house";
    },
  },
  leavingDate: {
    type: Date,
    required: function () {
      return this.bookingType === "guest_house";
    },
    validate: {
      validator: function (v) {
        if (this.bookingType !== "guest_house") return true;
        return v > this.arrivalDate;
      },
      message: "Leaving date must be after arrival date",
    },
  },

  // Number of rooms (guest house only)
  numberOfRooms: {
    type: Number,
    min: 1,
    required: function () {
      return this.bookingType === "guest_house";
    },
  },

  // Guest types (adults & children)
  guestTypes: {
    adults: {
      type: Number,
      min: 1,
      required: function () {
        return this.bookingType === "guest_house";
      },
    },
    children: {
      type: Number,
      min: 0,
      default: 0,
      required: function () {
        return this.bookingType === "guest_house";
      },
    },
  },

  // -----------------------------
  // Restaurant fields
  // -----------------------------
  bookingDay: {
    type: Date,
    required: function () {
      return this.bookingType === "restaurant";
    },
  },
  bookingTime: {
    type: String,
    required: function () {
      return this.bookingType === "restaurant";
    },
  },

  // -----------------------------
  // Shared fields
  // -----------------------------
  memberNumber: {
    type: Number,
    required: true,
    min: 1,
  },

  roomNumber: {
    type: Number,
    min: 1,
  },

  // Total Price (Guest house or restaurant)
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },

  bookingType: {
    type: String,
    enum: ["guest_house", "restaurant"],
    required: true,
  },

  place: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Place",
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  admin: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Booking", bookingSchema);
