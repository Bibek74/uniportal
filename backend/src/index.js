const app = require("./app");
const { PORT } = require("./config/config");
const connectDB = require("./db/db");

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`✅ Server is running at the port ${PORT}.`);
    });
  } catch (err) {
    console.log("❌ Failed to start server: ", err.message);
    process.exit(1);
  }
};

startServer();
