const mongoose = require("mongoose");

// const { ObjectId } = mongoose.Types;

const questions = new mongoose.Schema(
  {
    question: { type: String, trim: true, required: true },
    answerOptions: { type: Array, default: [], required: true },
    description: { type: String, trim: true, required: true },
    categories: { type: Array, required: true, default:[] },
    skills: { type: Array, required: true, default:[] },
    professionId: { type: String },
    status: { type: String, default: "Active" },
  },
  {
    timestamps: true,
  }
);

mongoose.model("questions", questions);

module.exports = mongoose.model("questions");
