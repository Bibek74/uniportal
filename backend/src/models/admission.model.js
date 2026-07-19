const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
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
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed"],
    default: "pending",
  },
  nationality: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    streetAddress: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  previousSchool: {
    type: String,
    required: true,
  },
  graduationYear: {
    type: Number,
    required: true,
  },
  gpa: {
    type: Number,
    required: true,
    min: 0,
  },
  program: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Program",
    required: true,
  },
  emergencyContact: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    relationship: {
      type: String,
      required: true,
    },
  },
  termsAgreed: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true });

const admissionModel = mongoose.model("Admission", admissionSchema);

module.exports = admissionModel;
