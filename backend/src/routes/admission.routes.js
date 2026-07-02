const express = require("express");
const AdmissionController = require("../controllers/admission.controller");

const admissionRouter = express.Router();
const admissionController = new AdmissionController();

admissionRouter.post("/apply", admissionController.applyAdmission);
admissionRouter.get("/all", admissionController.getAllAdmission);
admissionRouter.get("/:admissionId", admissionController.getAllAdmissionByAdmissionId);
admissionRouter.put("/update/:admissionId", admissionController.updateAdmissionDetailByAdmissionID);
admissionRouter.delete("/delete/:admissionId", admissionController.deleteAdmissionByAdmissionID);

module.exports = admissionRouter;
