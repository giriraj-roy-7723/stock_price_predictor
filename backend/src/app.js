// for singel exports dont use {} only use for multi exports
const express = require("express");
const compression = require("compression");
// const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const securityMiddleware = require("./middleware/security");
const rateLimiter = require("./middleware/rate_limiter");
const {
  global_error_handler,
  error_handler_404,
} = require("./middleware/error_handler");
const connectDB = require("./config/db");
const gracefulShutdown = require("./utils/graceful_shutdown");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

// Middleware
app.use("/api/", rateLimiter);
app.use(securityMiddleware);
app.use(compression()); // compresses(reduces size) HTTP responses before sending them
// app.use(morgan("combined")); // logs every incoming HTTP request
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// When HTML forms send data, they often use url-encoading
// It converts the request into a JavaScript object you can access in req.body

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/profile.routes"));

app.use(error_handler_404);
app.use(global_error_handler);

const PORT = process.env.PORT || 3001;
// Store server reference for graceful shutdown
let server;

process.on("SIGTERM", () => gracefulShutdown(server, "SIGTERM"));
process.on("SIGINT", () => gracefulShutdown(server, "SIGINT"));

connectDB()
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });
