const mongoose = require("mongoose");

const housingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [6, "The Name should be at least 6 characters long"],
  },
  type: {
    type: String,
    requred: true,
    enum: ["Apartment", "Villa", "House"],
  },
  year: {
    type: Number,
    required: true,
    minlength: [1850, "The Year should be between 1850 and 2022"],
    maxlength: [2022, "The Year should be between 1850 and 2021"],
  },
  city: {
    type: String,
    required: true,
    minlength: [4, "The City should be at least 4 characters long"],
  },
  homeImg: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?/.test(v);
      },
      message: "The Art picture should start with http:// or https://",
    },
  },
  propertyDesc: {
    type: String,
    required: true,
    maxlength: [
      60,
      "The Property Description should be a maximum of 60 characters long",
    ],
  },
  availablePieces: {
    type: Number,
    required: true,
    minlength: [
      1,
      "The Available Pieces should be positive number (from 0 to 10)",
    ],
    maxlength: [
      10,
      "The Available Pieces should be positive number (from 0 to 10)",
    ],
  },
  rentedAhome: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  owner: { type: mongoose.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Housing", housingSchema);
