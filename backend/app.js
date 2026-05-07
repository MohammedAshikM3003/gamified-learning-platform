const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const corsConfig = require("./middleware/corsConfig");
const apiLimiter = require("./middleware/rateLimiter");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const env = require("./config/env");
const healthRoutes = require("./routes/healthRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

app.use(helmet());
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(corsConfig);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use(apiLimiter);

app.use("/", healthRoutes);
app.use("/", contactRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
