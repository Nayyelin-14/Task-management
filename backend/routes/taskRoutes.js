const express = require("express");
const {
  protect,
  adminOnly,
  allowRoles,
} = require("../middlewares/authMiddlware");
const {
  createTask,
  deleteTask,
  getDashboardData,

  getTasks,
  getTaskByID,
  updateTaskdetails,
  updateTaskStatus,
  updateTaskChecklist,

  userDashboardData,
} = require("../controllers/taskController");

const router = express.Router();

//admin
router.post("/", protect, adminOnly, createTask); //only admin can create tasks
router.delete("/:taskId", protect, adminOnly, deleteTask); // admin can delete task
router.get(
  "/dashboard-data",
  protect,
  allowRoles("admin"),
  adminOnly,
  getDashboardData
); //admin only

//for all and ///member
router.get("/", protect, allowRoles("member", "admin"), getTasks); //get all tasks  (admin will get all , user only get assigned task)

router.get(
  "/user-data-dashboard",
  protect,
  allowRoles("member"),
  userDashboardData
);
router.get("/:taskID", protect, allowRoles("member", "admin"), getTaskByID); ////get task by id //login to wiin ya ml , user ll ya admiin ll ya
router.put(
  "/:taskId",
  protect,
  allowRoles("member", "admin"),
  updateTaskdetails
); ///update task detail

router.put("/:taskid/status", protect, allowRoles("member"), updateTaskStatus); // update task status by user
router.put(
  "/:taskid/checklist",
  protect,
  allowRoles("member"),
  updateTaskChecklist
); // update task checklist

module.exports = router;
