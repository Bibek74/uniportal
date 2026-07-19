const express = require("express");
const AuthController = require("../controllers/auth.controller");

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/signup", authController.signupUser);
authRouter.post("/login", authController.loginUser);
authRouter.post("/admin-login", authController.adminLoginUser);

module.exports = authRouter;
