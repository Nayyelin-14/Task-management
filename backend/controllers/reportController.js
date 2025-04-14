const Task = require("../models/Task");
const execelJS = require("exceljs");
const Users = require("../models/Users");
const exportTasksReport = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "name email");

    const workbook = new execelJS.Workbook();
    // excelJS.Workbook() creates a new Excel workbook (a .xlsx file).A workbook can contain multiple worksheets (like different tabs in an Excel file)You need to create at least one worksheet before adding data.
    const workSheet = workbook.addWorksheet("Tasks Report");
    // .addWorksheet("Tasks Report") creates a new worksheet inside the workbook."Tasks Report" is the name of the worksheet (it appears as a tab name in Excel).
    workSheet.columns = [
      {
        header: "Task ID",
        key: "_id",
        width: 25,
      },
      {
        header: "Title",
        key: "title",
        width: 30,
      },
      {
        header: "Description",
        key: "description",
        width: 50,
      },
      {
        header: "Priority",
        key: "priority",
        width: 15,
      },
      {
        header: "Status",
        key: "status",
        width: 20,
      },
      {
        header: "Due Date",
        key: "dueDate",
        width: 20,
      },
      {
        header: "Assigned To",
        key: "assignedTo",
        width: 30,
      },
    ];

    if (!tasks) {
      throw new Error("Tasks not found");
    }

    tasks.forEach((task) => {
      const assignedToUsers = task.assignedTo
        .map((user) => `${user.name} (${user.email})`)
        .join(", ");

      workSheet.addRow({
        _id: task._id,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status,
        priority: task.priority,
        assignedTo: assignedToUsers || "Unassigned",
      });
    });

    //     Why is this important?
    // Without this header, the browser may not recognize the file correctly.

    // Some browsers might try to display the raw binary data instead of treating it as an Excel file.

    // Setting this MIME type ensures that the file opens in Excel or compatible spreadsheet software.
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" /////MIME Type
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="tasks_report.xlsx"'
    );
    ///This tells the browser how to handle the file.

    // The attachment directive forces a download prompt instead of opening the file in the browser.

    // The filename="tasks_report.xlsx" suggests a default name for the downloaded fil
    return workbook.xlsx.write(res).then(() => {
      ///workbook.xlsx.write(res): Writes the Excel file directly into the HTTP response.

      // .then(() => res.end());: Ends the response when the file is fully written.
      res.end();
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
const exportUsersReport = async (req, res) => {
  try {
    const users = await Users.find().select("name  email  _id").lean(); //.lean() is used to return plain JavaScript objects instead of Mongoose documents (improves performance).
    const userTasks = await Task.find().populate(
      "assignedTo",
      "name email _id"
    );
    if (!users) {
      throw new Error("Users not found");
    }
    if (!userTasks) {
      throw new Error("Tasks for users not found");
    }
    const userTaskMap = {};

    users.forEach((user) => {
      userTaskMap[user._id] = {
        name: user.name,
        email: user.email,
        taskCount: 0,
        pendingTasks: 0,
        completedTasks: 0,
        inProgressTasks: 0,
      };
    });
    userTasks.forEach((task) => {
      if (task.assignedTo) {
        task.assignedTo.forEach((assignedUser) => {
          if (userTaskMap[assignedUser._id]) {
            userTaskMap[assignedUser._id].taskCount += 1;
          }
          if (task.status === "Pending") {
            userTaskMap[assignedUser._id].pendingTasks += 1;
          } else if (task.status === "In Progress") {
            userTaskMap[assignedUser._id].inProgressTasks += 1;
          } else if (task.status === "Completed") {
            userTaskMap[assignedUser._id].completedTasks += 1;
          }
        });
      }
    });
    const workbook = new execelJS.Workbook(); //creates a new Excel workbook using the exceljs library.
    const workSheet = workbook.addWorksheet("Users Report"); //Adds a new worksheet (a tab in Excel) named "Users Report" to the workbook.
    // This is where all the data will go—like rows and columns you see in an Excel table.

    workSheet.columns = [
      {
        header: "User Name",
        key: "name",
        width: 30,
      },
      {
        header: "Email",
        key: "email",
        width: 40,
      },
      {
        header: "Total assigned tasks",
        key: "taskCount",
        width: 20,
      },
      {
        header: "Pending Tasks",
        key: "pendingTasks",
        width: 20,
      },
      {
        header: "In Progress Tasks",
        key: "inProgressTasks",
        width: 20,
      },
      {
        header: "Completed Tasks",
        key: "completedTasks",
        width: 20,
      },
    ];
    Object.values(userTaskMap).forEach((user) => {
      workSheet.addRow(user); // Extracts all user objects into an array.
    }); ////Convert userTaskMap (which is an object) into an array of values and loop through each user.
    //////What Object.values(userTaskMap) does:It returns an array of values:Each user’s task data is added as a row in the Excel sheet.
    res.setHeader(
      "Content-Type", //: What kind of file this is (in this case, an Excel .xlsx file).
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" /////MIME Type
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="tasks_report.xlsx"' //That this is a file that should be downloaded instead of opened in the browser, and the filename should be "tasks_report.xlsx".
    );

    return (
      workbook.xlsx
        .write(res) ////writes the Excel workbook to the HTTP response stream (res).
        // It basically says: "Take the in-memory Excel file we built and stream it directly to the user as a downloadable file."
        .then(() => {
          res.end();
        })
    );
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports = { exportTasksReport, exportUsersReport };
