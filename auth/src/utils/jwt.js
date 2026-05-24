const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "24h" });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
    return console.error("Invalid token:", err);
  }
};

module.exports = {
  generateToken,
  verifyToken,
};