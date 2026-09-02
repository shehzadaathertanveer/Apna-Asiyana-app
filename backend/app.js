const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const userRouter = require("./routes/userRoutes.js");
const listingRouter = require("./routes/listingRoutes.js");
const contactRouter = require("./routes/contactRoutes.js");

const app = express();

// Allowed origins list (Local Vite + Live Netlify URL)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // e.g. https://apna-ashiyana.netlify.app
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: Origin not allowed"));
      }
    },
    credentials: true, // Allows HTTP-only cookies across domains
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.set("query parser", "extended");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieparser());

// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", listingRouter);
app.use("/api/v1", contactRouter);

// Root endpoint check for Vercel deployment verification
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Apna Ashiyana API is Running Live!" });
});

// Error Middleware
app.use(errorMiddleware);

module.exports = app;