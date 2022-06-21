const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [4, "The Full name should be at least 4 characters long"],
    validate: {
      validator: function (v) {
        return /^[آ-یA-z]{2,}( [آ-یA-z]{2,})+([آ-یA-z]|[ ]?)$/.test(v);
      },
      message: "Full name wrong format",
    },
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    minlength: [5, "The username should be at least 5 characters long"],
  },
  password: {
    type: String,
    required: [true, " Password is required"],
    minlength: [4, "The password should be at least 4 characters long"],
  },
  housings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Housing" }],
});

userSchema.pre("save", function (next) {
  bcrypt.hash(this.password, 10).then((hashedPassword) => {
    this.password = hashedPassword;

    next();
  });
});

const User = mongoose.model("User", userSchema);
module.exports = User;
