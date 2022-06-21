const Housing = require("../models/Housing");
const User = require("../models/User");

exports.create = (housingData) => Housing.create(housingData);
exports.getAll = () => Housing.find();
exports.getOneWithOwner = (housingId) =>
  Housing.findById(housingId).populate("owner").populate("rentedAhome");
exports.getOne = (housingId) => Housing.findById(housingId);
exports.getPeopleRented = (housingId) =>
  Housing.findById(housingId).populate("rentedAhome.list");
exports.getLastThree = () => Housing.find().limit(3);
exports.deleteOne = (housingId) => Housing.deleteOne({ _id: housingId });
exports.updateOne = (housingId, housingData) => {
  return Housing.updateOne(
    { _id: housingId },
    { $set: housingData },
    { runValidators: true }
  );
};
