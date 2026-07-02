const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("../config/config");

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 3000 });
};

const jwtAuthMiddleware = (req, res, next) => {
  const token = req.cookies?.auth_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      message: "Unauthorized: No token provided!",
      success: false,
    });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET_KEY);
    req.user = data;
    next();
  } catch (err) {
    res.status(401).send({
      message: "Unauthorized: Invalid or expired token!",
      success: false,
    });
  }
};

module.exports = { generateToken, jwtAuthMiddleware };
