const dotenv = require("dotenv");

// Load local env file ONLY if not in production (Vercel uses its own dashboard env vars)
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: "config/config.env" });
}

const app = require("./app");
const connectToDataBase = require("./config/dataBase");
const connectToCloudinary = require("./config/cloudinary");

// Initialize database and cloudinary connections
connectToDataBase();
connectToCloudinary();

// Uncaught exception handler
process.on("uncaughtException", (err) => {
  console.log("crash Details: ", err);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

// Root check route
app.get('/', (req, res) => {
  res.send('Backend is alive and working!');
});

// CRITICAL FOR VERCEL: Only use app.listen locally. Export app for Vercel.
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`server started at port: ${PORT}`);
  });

  // Unhandled rejection handler (Local only)
  process.on("unhandledRejection", (err) => {
    console.log("crash Details: ", err);
    console.log("Shutting down the server due to Unhandled Rejection");
    server.close(() => {
      process.exit(1);
    });
  });
}

// Export the app so Vercel's serverless function can use it
module.exports = app;