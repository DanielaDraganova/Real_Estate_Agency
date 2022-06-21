const User = require("../models/User");

exports.addHousing = (userId, housingId) => {
  return User.updateOne({ _id: userId }, { $push: { housings: housingId } });
};
