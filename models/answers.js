const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const answers = new mongoose.Schema(
  {
    question: { type: String, trim: true, required: true },
    questionId: { type: ObjectId, ref:"questions" },
    answerOptions: { type: Array, default: [], required: true },
    selectedAnswer: { type: String, trim: true, required: true },
    description: { type: String, trim: true, required: true },
    categories: { type: Array, required: true, default:[] },
    skills: { type: Array, required: true, default:[] },
    professionId: { type: ObjectId, ref: "profession" },
    ip: { type: String },
  },
  {
    timestamps: true,
  }
);

mongoose.model("answers", answers);

module.exports = mongoose.model("answers");
