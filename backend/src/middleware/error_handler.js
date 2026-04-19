function global_error_handler(err, req, res, next) {
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    ...(isDevelopment && { stack: err.stack }),
  });
}

function error_handler_404(req, res) {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The requested endpoint ${req.originalUrl} does not exist.`,
  });
}

module.exports = { global_error_handler, error_handler_404 };
