const mongoose = require("mongoose");

exports.connect = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/realEstateAgency");
    console.log("Connected to mongoDB");
  } catch (err) {
    console.log("DB error", err);
  }
};
