const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
    },
  });
};

const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
      statusCode: 404,
    },
  });
};

module.exports = { errorHandler, notFound };
