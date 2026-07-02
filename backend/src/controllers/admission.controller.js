const admissionModel = require("../models/admission.model");
const { ageCalculator } = require("../utils/common");

class AdmissionController {
  applyAdmission = async (req, res) => {
    try {
      const admissionExist = await admissionModel.findOne({ email: req.body.email });

      if (admissionExist) {
        return res.status(409).send({
          message: "Admission already applied!",
          success: false,
        });
      }

      const { firstName, lastName, dob, gender, email, phone, address, schoolName, passedYear, gpa, appliedFor, termsAgreed } = req.body;
      const calculatedAge = ageCalculator(dob);

      await admissionModel.create({
        firstName,
        lastName,
        dob,
        age: calculatedAge,
        gender,
        email,
        phone,
        address,
        schoolName,
        passedYear,
        gpa,
        appliedFor,
        termsAgreed,
      });

      res.status(201).send({
        message: "Admission applied successfully!",
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.response?.message ? `Internal server error: ${err.message}` : "Internal server error.",
        success: false,
      });
    }
  };

  getAllAdmission = async (req, res) => {
    try {
      const result = await admissionModel.find();

      res.status(200).send({
        message: result.length ? "Admissions fetched successfully!" : "No admission found!",
        result,
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.response?.message ? `Internal server error: ${err.message}` : "Internal server error.",
        success: false,
      });
    }
  };

  getAllAdmissionByAdmissionId = async (req, res) => {
    try {
      const result = await admissionModel.findOne({ _id: req.params.admissionId });

      if (!result) {
        return res.status(404).send({
          message: "Admission not found!",
          success: false,
        });
      }

      res.status(200).send({
        message: "Admission fetched successfully!",
        result,
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.response?.message ? `Internal server error: ${err.message}` : "Internal server error.",
        success: false,
      });
    }
  };

  updateAdmissionDetailByAdmissionID = async (req, res) => {
    try {
      const admissionExist = await admissionModel.findOne({ _id: req.params.admissionId });

      if (!admissionExist) {
        return res.status(404).send({
          message: "Admission not found!",
          result: false,
        });
      }

      const { firstName, lastName, dob, gender, email, phone, address, schoolName, passedYear, gpa, appliedFor } = req.body;
      let calculatedAge;

      if (dob) {
        calculatedAge = ageCalculator(dob);
      }

      const result = await admissionModel.findOneAndUpdate(
        { _id: req.params.admissionId },
        {
          $set: {
            firstName,
            lastName,
            dob,
            age: calculatedAge,
            gender,
            email,
            phone,
            address,
            schoolName,
            passedYear,
            gpa,
            appliedFor,
          },
        },
        { new: true }
      );

      res.status(200).send({
        message: "Admission detail updated successfully!",
        result,
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.response?.message ? `Internal server error: ${err.message}` : "Internal server error!",
        success: false,
      });
    }
  };

  deleteAdmissionByAdmissionID = async (req, res) => {
    try {
      const admissionExist = await admissionModel.findOne({ _id: req.params.admissionId });

      if (!admissionExist) {
        return res.status(404).send({
          message: "Admission not found!",
          result: false,
        });
      }

      await admissionModel.findOneAndDelete({ _id: req.params.admissionId });

      res.status(200).send({
        message: "Admission deleted successfully!",
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: err.response?.message ? `Internal server error: ${err.message}` : "Internal server error!",
        success: false,
      });
    }
  };
}

module.exports = AdmissionController;
