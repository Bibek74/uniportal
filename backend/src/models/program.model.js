const mongoose = require("mongoose");

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const programModel = mongoose.model("Program", programSchema);

module.exports = programModel;
