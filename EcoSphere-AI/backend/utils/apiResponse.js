class ApiResponse {
  static success(res, message, data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(res, message, statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}

export const getPaginationOptions = (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const getSortOptions = (query, defaultField = "createdAt") => {
  const sortField = query.sortBy || defaultField;
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;
  return { [sortField]: sortOrder };
};

export const getFilterOptions = (query, allowedFields = []) => {
  const filters = {};
  for (const field of allowedFields) {
    if (query[field] !== undefined && query[field] !== null && query[field] !== "") {
      filters[field] = query[field];
    }
  }
  return filters;
};

export default ApiResponse;
