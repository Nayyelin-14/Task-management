const Task = require("../models/Task");

//userside (user  - just assigned task , admin : all the tasks)
const getTasks = async (req, res) => {
  try {
    //params ka ny u tr
    const { status } = req.query;
    let filter = {};
    if (status) {
      filter.status = status;
    }
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find({ ...filter }).populate(
        //filter ka empty so a kone pya , filter mhr pending so pending pya, filter pr ll ya m pr ll ya
        "assignedTo",
        " name email profileImageUrl"
      );
    } else {
      tasks = await Task.find({ ...filter, assignedTo: req.user._id }).populate(
        //  status: "Pending" ,  priority: "High", filter 2 khu lr kht yin spread loke tr
        "assignedTo",
        " name email profileImageUrl"
      );
    }

    const allTasks = await Task.countDocuments(
      req.user.role === "admin" ? {} : { assignedTo: req.user._id } //If the user's role is "admin", the query will look for all tasks, meaning it will count all the documents in the Task collection. The condition is represented by {} (an empty object), which means no filtering (so all tasks are counted)If the user's role is not admin, the query will count only those tasks that are assigned to the current user, i.e., tasks with assignedTo equal to the req.user._id.
    );
    const pendingTasks = await Task.countDocuments({
      ...filter,
      status: "Pending",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
      // admin m hok yin assigned loke htr tk user
      ////admin so yin a kone myin ya ml
    });
    const inprogressTasks = await Task.countDocuments({
      ...filter,
      status: "In progress",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });
    const completedTasks = await Task.countDocuments({
      ...filter,
      status: "Completed",
      ...(req.user.role !== "admin" && { assignedTo: req.user._id }),
    });

    return res.status(200).json({
      tasks,
      statusSummary: {
        allTasks,
        inprogressTasks,
        completedTasks,
        pendingTasks,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Serversadfsadf error",
      error: error.message,
    });
  }
};

///compeleted  or not loke tr
const updateTaskStatus = async (req, res) => {
  const { taskid } = req.params;
  const { status } = req.body;
  if (!taskid) {
    throw new Error("Task id is required");
  }
  try {
    const task = await Task.findById(taskid);
    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    const isAssigned = task.assignedTo.some(
      (user) => user._id.toString() === req.user._id.toString() /// bl task mhr assign loke htr ll shr
    ); //The .some() method in JavaScript is used on arrays to check if at least one element in the array meets a given condition. It returns:

    if (!isAssigned && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not an unthorized user" });
    }

    task.status = status ? status : task.status;
    if (task.status === "Completed") {
      task.todoChecklist.forEach((item) => (item.completed = true));
      task.progress = 100;
    }
    await task.save();
    return res.status(200).json({ message: "Task status has updated", task });
  } catch (error) {
    return res.status(500).json({
      message: "Server asfdasddfasdferror",
      error: error.message,
    });
  }
};
///task ko edit tr
const updateTaskdetails = async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new Error("Task id is required");
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    task.title = req.body.title ?? task.title;
    task.description = req.body.description ?? task.description;
    task.priority = req.body.priority ?? task.priority;
    task.dueDate = req.body.dueDate ?? task.dueDate;
    task.todoChecklist = req.body.todoChecklist ?? task.todoChecklist;
    task.attachments = req.body.attachments ?? task.attachments;

    if (req.body.assignedTo) {
      if (!Array.isArray(req.body.assignedTo)) {
        return res.status(400).json({
          message: "Task must be assigned to an a rray of user",
        });
      }
      task.assignedTo = req.body.assignedTo;
    }

    const updatedTask = await task.save();
    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({
      message: "Server asdfasdferror",
      error: error.message,
    });
  }
};
//
const getTaskByID = async (req, res) => {
  const { taskID } = req.params;

  if (!taskID) {
    throw new Error("Task id is required");
  }
  try {
    const SingleTask = await Task.findById(taskID).populate(
      "assignedTo",
      "name  email profileImageUrl"
    );
    if (!SingleTask) {
      return res.status(400).json({ message: "Task not found" });
    }
    return res.status(200).json(SingleTask);
  } catch (error) {
    return res.status(500).json({
      message: "Serveasdfasfr error",
      error: error.message,
    });
  }
};
const updateTaskChecklist = async (req, res) => {
  const { taskid } = req.params;
  const { todoChecklist } = req.body;
  if (!taskid) {
    throw new Error("Task id is required");
  }
  try {
    const task = await Task.findById(taskid);
    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    if (!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
      //must be member and authorized
      return res.status(403).json({
        message: "Not authorized to update checklist",
      });
    }
    task.todoChecklist = todoChecklist; //add new checklist
    const completedCount = task.todoChecklist.filter(
      (item) => item.completed === true
    ).length;
    const totalItems = task.todoChecklist.length;
    task.progress =
      totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

    if (task.progress === 100) {
      task.status = "Completed";
    } else if (task.progress > 0) {
      task.status = "In progress";
    } else {
      task.status = "Pending";
    }

    await task.save();
    const updatedTask = await Task.findById(taskid).populate(
      "assignedTo",
      "name email profileImageUrl"
    );
    res.json({ message: "Task checklist updated", updatedTask });
  } catch (error) {
    return res.status(500).json({
      message: "Server eadsfafrror",
      error: error.message,
    });
  }
};

const userDashboardData = async (req, res) => {
  console.log("hi");
  console.log("req user ", req.user);
  const userId = req.user._id.toString();

  // if (!userId) {
  //   return res.status(400).json({ message: "User not found" });
  // }
  // try {
  //   const userExisted = await User.findById(userId);
  //   console.log(userExisted);
  //   const totalTasks = await Task.countDocuments({
  //     assignedTo: userExisted._id,
  //   });
  //   const PendingTasks = await Task.countDocuments({
  //     assignedTo: userExisted._id,
  //     status: "Pending",
  //   });
  //   const InprogressTasks = await Task.countDocuments({
  //     assignedTo: userExisted._id,
  //     status: "In progress",
  //   });
  //   const CompletedTasks = await Task.countDocuments({
  //     assignedTo: userExisted._id,
  //     status: "Completed",
  //   });
  //   const overDueTasks = await Task.countDocuments({
  //     assignedTo: userExisted._id,
  //     status: { $ne: "Completed" }, ///→ Finds tasks that are NOT completed ($ne means "not equal").
  //     dueDate: { $lt: new Date() }, /// Finds tasks with past due dates ($lt means "less than").
  //   });
  //   //task distribution statistics for a specific user.
  //   const taskStatuses = ["Pending", "In progress", "Completed"];
  //   const taskDistributionRaw = await Task.aggregate([
  //     { $match: { assignedTo: userExisted._id } },
  //     {
  //       $group: {
  //         _id: "$status",
  //         count: { $sum: 1 },
  //       },
  //       //  example output  [  { "_id": "Pending", "count": 40 },
  //       //    { "_id": "In progress", "count": 30 },
  //       //     { "_id": "Completed", "count": 30 }
  //       //   ]
  //     },
  //   ]);
  //   const taskDistribution = taskStatuses.reduce((acc, status) => {
  //     const formattedKey = status.replace(/\s+/g, ""); /// remove space
  //     acc[formattedKey] =
  //       taskDistributionRaw.find((item) => item._id === status)?.count || 0;
  //     return acc;
  //   }, {});
  //   taskDistribution["All"] = totalTasks;
  //   const taskPriorites = ["Low", "Medium", "High"];
  //   const taskPrioritesLevelRaw = await Task.aggregate([
  //     { $match: { assignedTo: userExisted._id } },
  //     {
  //       $group: {
  //         _id: "$priority",
  //         count: { $sum: 1 },
  //       },
  //     },
  //   ]);
  //   const taskPrioritesLevel = taskPriorites.reduce((acc, priority) => {
  //     acc[priority] =
  //       taskPrioritesLevelRaw.find((item) => item._id === priority)?.count || 0;
  //     return acc;
  //   }, {});
  //   //recent 10 tasks
  //   const recentTasks = await Task.find({ assignedTo: userId })
  //     .sort({ createdAt: -1 })
  //     .limit(10)
  //     .select("title status priority dueDate createdAt");
  //   res.status(200).json({
  //     statistics: {
  //       totalTasks,
  //       PendingTasks,
  //       InprogressTasks,
  //       CompletedTasks,
  //       overDueTasks,
  //     },
  //     charts: {
  //       taskDistribution,
  //       taskPrioritesLevel,
  //     },
  //     recentTasks,
  //   });
  // } catch (error) {
  //   console.log(error);
  //   return res.status(500).json({
  //     message: "Server edfgdfgrror",
  //     error: error.message,
  //   });
  // }
};
///admin side
const createTask = async (req, res) => {
  const {
    title,
    description,
    priority,
    dueDate,
    attachments,
    todoChecklist,
    assignedTo,
  } = req.body;

  if (!Array.isArray(assignedTo)) {
    return res.status(400).json({
      message: "Task must be assigned to an group of users",
    });
  }
  try {
    let task;
    if (!title || !description || !priority || !dueDate || !todoChecklist) {
      throw new Error("Something went wrong");
    } else {
      task = await Task.create({
        title,
        description,
        priority,
        dueDate,
        attachments,
        assignedTo,
        todoChecklist,
        createdBy: req.user._id,
      });
      return res.status(200).json({
        message: "New Task has created successfully ",
        task,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server easdfrror",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  const { taskId } = req.params;
  if (!taskId) {
    throw new Error("Task id is required");
  }
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }
    await task.deleteOne();
    return res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "sadasfd",
      error: error.message,
    });
  }
};

const getDashboardData = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const PendingTasks = await Task.countDocuments({ status: "Pending" });
    const InprogressTasks = await Task.countDocuments({
      status: "In progress",
    });
    const CompletedTasks = await Task.countDocuments({ status: "Completed" });

    const overDueTasks = await Task.countDocuments({
      status: { $ne: "Completed" }, ///→ Finds tasks that are NOT completed ($ne means "not equal").
      dueDate: { $lt: new Date() }, /// Finds tasks with past due dates ($lt means "less than").
    });

    const taskStatuses = ["Pending", "In progress", "Completed"];
    const taskDistributionRaw = await Task.aggregate([
      //     MongoDB Aggregation ($group):
      // Groups tasks by status (_id: "$status").
      // Counts how many tasks exist in each status.
      // ✅ Raw Output Example (taskDistributionRaw):
      // [
      //   { "_id": "Pending", "count": 40 },
      //   { "_id": "In progress", "count": 30 },
      //   { "_id": "Completed", "count": 30 }
      // ]
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
      const formattedKey = status.replace(/\s+/g, ""); /// remove space

      acc[formattedKey] =
        taskDistributionRaw.find((item) => item._id === status)?.count || 0;
      return acc;
      // {
      //   Pending: 2,
      //   Inprogress: 0,
      //   Completed: 3
      // }
    }, {});
    taskDistribution["All"] = totalTasks;

    const taskPriorites = ["Low", "Medium", "High"];
    const taskPrioritesLevelRaw = await Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);
    const taskPrioritesLevel = taskPriorites.reduce((acc, priority) => {
      acc[priority] =
        taskPrioritesLevelRaw.find((item) => item._id === priority)?.count || 0;
      return acc;
    }, {});

    //fetch recent 10 tasks
    const recentTasks = await Task.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title status priority dueDate createdAt");

    res.status(200).json({
      statistics: {
        totalTasks,
        PendingTasks,
        InprogressTasks,
        CompletedTasks,
        overDueTasks,
      },
      charts: {
        taskDistribution,
        taskPrioritesLevel,
      },
      recentTasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server asfdasdfaferror",
      error: error.message,
    });
  }
};

module.exports = {
  getTaskByID,
  getTasks,
  updateTaskChecklist,
  updateTaskdetails,
  updateTaskStatus,
  createTask,
  deleteTask,
  userDashboardData,
  getDashboardData,
};
