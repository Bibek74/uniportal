const express = require("express");
const ProgramController = require("../controllers/program.controller");
const { adminAuthMiddleware } = require("../utils/jwt");

const programRouter = express.Router();
const programController = new ProgramController();

programRouter.get("/", programController.getPrograms);
programRouter.post("/", adminAuthMiddleware, programController.createProgram);
programRouter.put("/:programId", adminAuthMiddleware, programController.updateProgram);
programRouter.delete("/:programId", adminAuthMiddleware, programController.deleteProgram);

module.exports = programRouter;
