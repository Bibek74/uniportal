const programModel = require("../models/program.model");

class ProgramController {
  getPrograms = async (req, res) => {
    try {
      let programs = await programModel.find().sort({ name: 1 });

      if (!programs.length) {
        const defaultPrograms = [
          { name: "Science", description: "Science programs covering STEM fields." },
          { name: "Management", description: "Leadership and business management programs." },
          { name: "Law", description: "Legal studies and law practice programs." },
        ];

        await programModel.insertMany(defaultPrograms);
        programs = await programModel.find().sort({ name: 1 });
      }

      res.status(200).send({
        message: "Programs fetched successfully!",
        programs,
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal server error.",
        success: false,
      });
    }
  };

  createProgram = async (req, res) => {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).send({
          message: "Program name is required.",
          success: false,
        });
      }

      const existingProgram = await programModel.findOne({ name: name.trim() });
      if (existingProgram) {
        return res.status(409).send({
          message: "Program already exists.",
          success: false,
        });
      }

      const program = await programModel.create({
        name: name.trim(),
        description: description ?? "",
      });

      res.status(201).send({
        message: "Program created successfully!",
        program,
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal server error.",
        success: false,
      });
    }
  };

  updateProgram = async (req, res) => {
    try {
      const { programId } = req.params;
      const { name, description } = req.body;

      if (!name?.trim()) {
        return res.status(400).send({
          message: "Program name is required.",
          success: false,
        });
      }

      const existingProgram = await programModel.findOne({
        _id: { $ne: programId },
        name: name.trim(),
      });

      if (existingProgram) {
        return res.status(409).send({
          message: "Program already exists.",
          success: false,
        });
      }

      const program = await programModel.findByIdAndUpdate(
        programId,
        {
          name: name.trim(),
          description: description?.trim() ?? "",
        },
        { new: true, runValidators: true },
      );

      if (!program) {
        return res.status(404).send({
          message: "Program not found.",
          success: false,
        });
      }

      res.status(200).send({
        message: "Program updated successfully!",
        program,
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal server error.",
        success: false,
      });
    }
  };

  deleteProgram = async (req, res) => {
    try {
      const program = await programModel.findByIdAndDelete(req.params.programId);

      if (!program) {
        return res.status(404).send({
          message: "Program not found.",
          success: false,
        });
      }

      res.status(200).send({
        message: "Program deleted successfully!",
        program,
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({
        message: "Internal server error.",
        success: false,
      });
    }
  };
}

module.exports = ProgramController;
