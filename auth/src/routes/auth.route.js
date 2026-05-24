const express = require("express");
const multer = require("multer");
const router = express.Router();
const authValidator = require("../validators/auth.validator");
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
const passport = require("passport");
const { generateToken } = require("../utils/jwt");


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post(
    "/register",
     validate(authValidator.registerSchema),
      authController.register
);

router.post(
    "/login",
     validate(authValidator.loginSchema),
      authController.login
);

router.get(
    "/profile",
      authMiddleware,
      authController.getprofile
);

router.patch(
  "/profile",
  authMiddleware,
  upload.single("avatar"),
  validate(authValidator.updateProfileSchema),
  authController.updateProfile,
);

router.get(
    "/logout",
     authController.logout
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),

  async (req, res) => {
    try {
      const token = generateToken(req.user);

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      res.status(200).json({
        message: "Google login successful",
        token,
        user: req.user,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);
module.exports = router;
