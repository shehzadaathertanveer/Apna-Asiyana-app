const express = require("express");
const cors = require("cors"); // 1. Imported cors
const cookieparser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const userRouter = require("./routes/userRoutes.js");
const listingRouter = require("./routes/listingRoutes.js");
const contactRouter = require("./routes/contactRoutes.js")
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,               
  })
);

app.set("query parser", "extended");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser());

// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", listingRouter);
app.use("/api/v1",contactRouter)

// Error Middleware
app.use(errorMiddleware);

module.exports = app;