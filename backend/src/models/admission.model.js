const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
    default: "male",
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  passedYear: {
    type: String,
    required: true,
  },
  gpa: {
    type: Number,
    required: true,
    min: 0,
  },
  appliedFor: {
    type: String,
    enum: ["science", "management", "law"],
    default: "science",
  },
  termsAgreed: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true });

const admissionModel = mongoose.model("Admission", admissionSchema);

module.exports = admissionModel;
