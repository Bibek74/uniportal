const express = require("express");
const ProgramController = require("../controllers/program.controller");

const programRouter = express.Router();
const programController = new ProgramController();

programRouter.get("/", programController.getPrograms);
programRouter.post("/", programController.createProgram);

module.exports = programRouter;
