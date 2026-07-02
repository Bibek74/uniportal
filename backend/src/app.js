const express = require("express");
const admissionRouter = require("./routes/admission.routes");
const authRouter = require("./routes/auth.route");
const { CLIENT_URL } = require("./config/config");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));

app.use("/api/pdfs", express.static("src/pdfs"));
app.use("/api/admission", admissionRouter);
app.use("/api/auth", authRouter);

module.exports = app;
