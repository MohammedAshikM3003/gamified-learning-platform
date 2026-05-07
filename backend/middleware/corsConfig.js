const cors = require("cors");
const env = require("../config/env");

const getAllowedOrigins = () => {
  if (!env.corsOrigin) {
    return [];
  }

  return env.corsOrigin.split(",").map((origin) => origin.trim());
};

const corsOptions = (req, callback) => {
  const origin = req.header("Origin");
  const allowList = getAllowedOrigins();

  if (env.nodeEnv !== "production") {
    callback(null, { origin: true, credentials: true });
    return;
  }

  if (!origin) {
    callback(null, { origin: false });
    return;
  }

  if (allowList.includes(origin)) {
    callback(null, { origin: true, credentials: true });
    return;
  }

  callback(null, { origin: false });
};

module.exports = cors(corsOptions);
