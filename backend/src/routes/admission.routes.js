const express = require("express");
const AdmissionController = require("../controllers/admission.controller");
const { adminAuthMiddleware } = require("../utils/jwt");

const admissionRouter = express.Router();
const admissionController = new AdmissionController();

admissionRouter.post("/apply", admissionController.applyAdmission);
admissionRouter.post("/apply/:programId", admissionController.applyAdmissionByProgramId);
admissionRouter.get("/all", adminAuthMiddleware, admissionController.getAllAdmission);
admissionRouter.get("/:admissionId", adminAuthMiddleware, admissionController.getAllAdmissionByAdmissionId);
admissionRouter.put("/update/:admissionId", adminAuthMiddleware, admissionController.updateAdmissionDetailByAdmissionID);
admissionRouter.delete("/delete/:admissionId", adminAuthMiddleware, admissionController.deleteAdmissionByAdmissionID);

module.exports = admissionRouter;
