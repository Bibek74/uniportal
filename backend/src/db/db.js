const mongoose = require("mongoose");
const { MONGO_DB_URL } = require("../config/config");

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_DB_URL);
    console.log("✅ Database connected successfully!");
  } catch (err) {
    console.log("❌ Database connection failed!", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
