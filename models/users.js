const mongoose = require("mongoose");

const users = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

mongoose.model("users", users);

module.exports = mongoose.model("users");
