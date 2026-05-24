const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const { uploadImage } = require("../utils/imageKit");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const emailExists = await userModel.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const user = new userModel({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role,
      provider: "local",
    });
    await user.save();

    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res
      .status(201)
      .json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }
    if (user.provider !== "local") {
      return res.status(400).json({ message: `Please login with ${user.provider}` });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res
      .status(200)
      .json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  } catch (error) {
    console.log("login error:", error);
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, role } = req.body;
    const file = req.file;
    let avatarUrl = null;

    if (file) {
      const image = await uploadImage({ buffer: file.buffer, folder: "/pfp" });
      avatarUrl = image.url;
    }
    const user = req.user;
    if (name) user.name = name;
    if (role) user.role = role;
    if (avatarUrl) user.profilePic = avatarUrl;
    await user.save();
    res
      .status(200)
      .json({
        message: "Profile updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profilePic: user.profilePic,
        },
      });
  } catch (error) {
    console.log("updateProfile error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getprofile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    console.log("getprofile error:", error);
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("logout error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, updateProfile, getprofile, logout };    