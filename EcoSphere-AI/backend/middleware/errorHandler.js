import ApiResponse from "../utils/apiResponse.js";
import Logger from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  Logger.error(err.message, err.stack || "");

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate field value entered";
  }

  return ApiResponse.error(res, message, statusCode);
};

export default errorHandler;
