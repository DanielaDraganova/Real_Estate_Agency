const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { SECRET } = require("../constants");
exports.create = (userData) => User.create(userData);

exports.login = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw { message: "Cannot find username or password" };
  }
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw { message: "Cannot find username or password" };
  }

  return user;
};

exports.createToken = (user) => {
  // Modify according to the requirements (for example: email, roles...)
  const payload = {
    _id: user._id,
    name: user.name,
    username: user.username,
  };

  const options = { expiresIn: "3d" };

  const tokenPromise = new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, options, (err, decodedToken) => {
      if (err) {
        return reject(err);
      }
      resolve(decodedToken);
    });
  });
  return tokenPromise;
};
