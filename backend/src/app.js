const express = require("express");
const admissionRouter = require("./routes/admission.routes");
const authRouter = require("./routes/auth.route");
const programRouter = require("./routes/program.routes");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/pdfs", express.static("src/pdfs"));
app.use("/api/admission", admissionRouter);
app.use("/api/auth", authRouter);
app.use("/api/programs", programRouter);

module.exports = app;
