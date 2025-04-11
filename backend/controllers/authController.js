const User = require("../models/Users");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//generate Token
const generateToken = (userID) => {
  return jwt.sign({ id: userID }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

//registerUser
const registerUser = async (req, res) => {
  try {
    const { name, password, email, profileImageUrl, adminToken } = req.body;

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //check admin or member
    let role = "member";
    if (adminToken && adminToken === process.env.ADMIN_TOKEN) {
      role = "admin";
    }
    ///hashpassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //add new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      profileImageUrl,
      role,
    });
    res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      profileImageUrl: newUser.profileImageUrl,
      role: newUser.role,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, userDoc.password);
    if (!isMatch) {
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }
    return res.status(200).json({
      _id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      profileImageUrl: userDoc.profileImageUrl,
      role: userDoc.role,
      token: generateToken(userDoc._id),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

//userprofile
const getUserProfile = async (req, res) => {
  const userID = req.user._id;

  try {
    const userDoc = await User.findById(userID);
    if (!userDoc) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      _id: userDoc._id,
      name: userDoc.name,
      email: userDoc.email,
      profileImageUrl: userDoc.profileImageUrl,
      role: userDoc.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

///updateProfile
const updateUserprofile = async (req, res) => {
  const userID = req.user._id;
  const { email, password, name } = req.body;
  try {
    const userDoc = await User.findById(userID);
    if (!userDoc) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    userDoc.name = name;
    userDoc.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      userDoc.password = await bcrypt.hash(password, salt);
    }
    const updatedUser = await userDoc.save();

    return res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = { loginUser, registerUser, getUserProfile, updateUserprofile };
