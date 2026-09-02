// Handler for uncaught exceptions

process.on("uncaughtException", (err) => {
  console.log("crash Details: ", err);
  console.log("Shutting down the server due to Uncaught Exception");
  process.exit(1);
});

const dotenv = require("dotenv");
const app = require("./app");
const connectToDataBase = require("./config/dataBase");
const connectToCloudinary = require("./config/cloudinary");

// starting services
dotenv.config({ path: "config/config.env" });
connectToDataBase();
connectToCloudinary();

app.get('/', (req, res) => {
  res.send('Backend is alive and working!');
});
//starting server
const server = app.listen(process.env.PORT, () => {
  console.log(`server started at port: ${process.env.PORT}`);
});

// handler for unhandled rejection
process.on("unhandledRejection", (err) => {
  console.log("crash Details: ", err);
  console.log("Shutting down the server due to Uncaught Exception");
  server.close (()=>{
    process.exit(1)
  })
});

