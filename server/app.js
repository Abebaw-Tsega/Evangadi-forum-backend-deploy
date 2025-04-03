const express = require("express");
const app = express();

// Use the PORT environment variable provided by Render
const port = process.env.PORT || 5555; // Fallback to 5555 for local development
require('dotenv').config();

// DB connection
const dbConnection = require("./db/dbConfig");

// User routes middleware file
const userRoutes = require("./routes/userRoute");

// Question routes middleware file
const questionRoutes = require("./routes/questionRoute");
const { authMiddleware } = require("./Middleware/authMiddleware");

// Answer routes middleware file
const answerRoutes = require("./routes/answerRoute");

// JSON middleware
app.use(express.json());

// CORS middleware
const cors = require("cors");
app.use(cors());

// User routes middleware
app.use("/api/users", userRoutes);

// Question routes middleware
app.use("/api/questions", authMiddleware, questionRoutes);

// Answer routes middleware
app.use("/api/answer", authMiddleware, answerRoutes);

// Add a root route for testing
app.get('/', (req, res) => {
  res.send("Welcome to Evangadi Forum API!");
});

async function start() {
  try {
    // Start the server first
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Then try to connect to the database
    const result = await dbConnection.execute("select 'test'");
    console.log("Database successfully connected");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    // Server is already running, so no need to stop
  }
}

start();