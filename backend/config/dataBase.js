const mongoose = require("mongoose");
const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

// Cache the database connection across serverless requests
let cachedConnection = null;

const connectDatabase = async () => {
  // If already connected, reuse the existing connection
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // CRITICAL: Never use process.exit(1) in serverless, as it kills the container!
    throw error;
  }
};

module.exports = connectDatabase;