import ApiResponse from "../utils/apiResponse.js";

const notFound = (req, res, next) => {
  return ApiResponse.error(res, "Resource not found", 404);
};

export default notFound;
