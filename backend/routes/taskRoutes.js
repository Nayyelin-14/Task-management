const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddlware");
const {
  createTask,
  deleteTask,
  getDashboardData,

  getTasks,
  getTaskByID,
  updateTaskdetails,
  updateTaskStatus,
  updateTaskChecklist,
  UserData,
} = require("../controllers/taskController");

const router = express.Router();

//admin
router.post("/", protect, adminOnly, createTask); //only admin can create tasks
router.delete("/:taskId", protect, adminOnly, deleteTask); // admin can delete task
router.get("/dashboard-data", protect, adminOnly, getDashboardData); //admin only

//for all and ///member
router.get("/", protect, getTasks); //get all tasks  (admin will get all , user only get assigned task)
router.get("/:taskID", protect, getTaskByID); ////get task by id //login to wiin ya ml , user ll ya admiin ll ya
router.put("/:taskId", protect, updateTaskdetails); ///update task detail
router.get("/userdashboard", protect, UserData);

router.put("/:taskid/status", protect, updateTaskStatus); // update task status by user
router.put("/:taskid/checklist", protect, updateTaskChecklist); // update task checklist

module.exports = router;
