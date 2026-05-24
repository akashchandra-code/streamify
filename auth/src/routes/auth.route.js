const express = require("express");
const multer = require("multer");
const router = express.Router();
const authValidator = require("../validators/auth.validator");
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");
const validate = require("../middlewares/validate.middleware");
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

module.exports = router;
