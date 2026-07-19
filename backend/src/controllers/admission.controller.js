const admissionModel = require("../models/admission.model");
const programModel = require("../models/program.model");
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

      const {
        firstName,
        middleName,
        lastName,
        dob,
        gender,
        nationality,
        email,
        phone,
        streetAddress,
        city,
        state,
        country,
        previousSchool,
        graduationYear,
        gpa,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelationship,
        termsAgreed,
        programId,
        status,
      } = req.body;

      const program = await programModel.findById(programId);
      if (!program) {
        return res.status(400).send({
          message: "Selected program is not valid.",
          success: false,
        });
      }

      const calculatedAge = ageCalculator(dob);

      await admissionModel.create({
        firstName,
        middleName,
        lastName,
        dob,
        age: calculatedAge,
        gender,
        nationality,
        email,
        phone,
        address: {
          streetAddress,
          city,
          state,
          country,
        },
        previousSchool,
        graduationYear,
        gpa,
        program: program._id,
        emergencyContact: {
          name: emergencyContactName,
          phone: emergencyContactPhone,
          relationship: emergencyContactRelationship,
        },
        termsAgreed,
        status: status || "pending",
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
      const result = await admissionModel.find().populate("program");

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
      const result = await admissionModel.findOne({ _id: req.params.admissionId }).populate("program");

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

      const {
        firstName,
        middleName,
        lastName,
        dob,
        gender,
        nationality,
        email,
        phone,
        streetAddress,
        city,
        state,
        country,
        previousSchool,
        graduationYear,
        gpa,
        emergencyContactName,
        emergencyContactPhone,
        emergencyContactRelationship,
        termsAgreed,
        programId,
        status,
      } = req.body;
      let calculatedAge;

      if (dob) {
        calculatedAge = ageCalculator(dob);
      }

      const updateData = {
        firstName,
        middleName,
        lastName,
        dob,
        gender,
        nationality,
        email,
        phone,
        previousSchool,
        graduationYear,
        gpa,
        termsAgreed,
      };

      if (status) {
        updateData.status = status;
      }

      if (programId) {
        const program = await programModel.findById(programId);
        if (!program) {
          return res.status(400).send({
            message: "Selected program is not valid.",
            success: false,
          });
        }
        updateData.program = program._id;
      }

      if (typeof calculatedAge === "number") {
        updateData.age = calculatedAge;
      }

      if (streetAddress || city || state || country) {
        updateData.address = {
          streetAddress,
          city,
          state,
          country,
        };
      }

      if (emergencyContactName || emergencyContactPhone || emergencyContactRelationship) {
        updateData.emergencyContact = {
          name: emergencyContactName,
          phone: emergencyContactPhone,
          relationship: emergencyContactRelationship,
        };
      }

      const result = await admissionModel.findOneAndUpdate(
        { _id: req.params.admissionId },
        {
          $set: updateData,
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

  applyAdmissionByProgramId = async (req, res) => {
    try {
      req.body.programId = req.params.programId;
      return this.applyAdmission(req, res);
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal server error.",
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
