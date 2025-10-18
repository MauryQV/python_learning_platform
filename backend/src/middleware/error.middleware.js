export const errorHandler = (err, req, res) => {
  //console.error("[ERROR]", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Server error";

  res.status(statusCode).json({
    success: false,
    message,
  });
};
