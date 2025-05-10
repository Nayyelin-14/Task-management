const Task = require("../models/Task");
const Users = require("../models/Users");

//get user by admin
const getUsers = async (req, res) => {
  try {
    //get member first
    const users = await Users.find({ role: "member" }).select("-password");
    if (!users) {
      res.status(404).json({
        message: "User not found",
      });
    }
    //all pendening , completed , progress tasks that are asigned to each user
    const UserswithTaskCounts = await Promise.all(
      users.map(async (user) => {
        const PendingTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Pending",
        });
        const InProgressTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Progress",
        });
        const CompletedTasks = await Task.countDocuments({
          assignedTo: user._id,
          status: "Completed",
        });
        // _doc removes Mongoose-specific functions and returns only the actual data from the database.
        //lean() or _doc ka mongoose methods twy 3 loh  m ya tok pl plain json object twy pyn pyyy tr
        // It is just a normal JavaScript object, making it easier to manipulate or return as JSON.
        return {
          ...user._doc, // Spread the raw user data
          PendingTasks,
          InProgressTasks,
          CompletedTasks,
        };
      })
    );

    return res.status(200).json(UserswithTaskCounts);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { userid } = req.params;

  try {
    const userDoc = await Users.findById(userid);
    if (!userDoc) {
      res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json(userDoc);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};
const removeUser = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

module.exports = { getUsers, getUserById, removeUser };
