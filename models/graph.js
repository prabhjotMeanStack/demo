const mongoose = require("mongoose");

const { ObjectId } = mongoose.Types;

const graph = new mongoose.Schema(
  {
    professionId: { type: ObjectId },
    graphData: { type: Object },
    strengths: { type: Object },
    improvements: { type: Object }
  },
  {
    timestamps: true,
  }
);

mongoose.model("graph", graph);

module.exports = mongoose.model("graph");
