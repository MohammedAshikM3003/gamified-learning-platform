const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      error: {
        message: "Validation failed",
        statusCode: 400,
        details: errors,
      },
    });
  }

  req.body = result.data;
  next();
};

module.exports = validate;
