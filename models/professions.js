const mongoose = require("mongoose");

const profession = new mongoose.Schema(
  {
    professionName: { type: String, trim: true },
    description: { type: String, trim: true },
    status: { type: String, trim: true, default: "Active" },
  },
  {
    timestamps: true,
  }
);

mongoose.model("profession", profession);

module.exports = mongoose.model("profession");
