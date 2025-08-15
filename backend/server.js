const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");
const connectDB = require("./config/connectDB");
const errorHandler = require("./middlewares/Errorhandler");
dotenv.config();

const app = express();
//cors
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],

    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//middleware
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use(errorHandler);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use("/uploads", ...):

// This tells Express to use middleware for any HTTP request that matches the /uploads path. For example, if someone accesses /uploads/somefile.jpg, this middleware will handle it.

// express.static(...):

// express.static is a built-in middleware function in Express that serves static files (like images, CSS files, or JavaScript files) from a specified directory. In this case, it's serving files from the uploads directory.

// path.join(__dirname, "uploads"):

// __dirname is a special variable in Node.js that represents the current directory of the script being executed.

// path.join(__dirname, "uploads") combines the current directory path with the uploads folder name, creating the absolute path to the uploads directory where the files are stored.

const PORT = process.env.PORT || 5000;
connectDB()
  .then(() => {
    // Start the server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
    process.exit(1); // Exit if DB connection fails
  });
