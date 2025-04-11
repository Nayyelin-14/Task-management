const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddlware");
const {
  getUsers,
  getUserById,
  removeUser,
} = require("../controllers/userController");
const router = express.Router();

router.get("/", protect, adminOnly, getUsers); ///get all user for admin only
router.get("/:userid", protect, getUserById); //get a specifi user (for user)
router.delete("/:userid", protect, adminOnly, removeUser); /// remove user , admin only

module.exports = router;
