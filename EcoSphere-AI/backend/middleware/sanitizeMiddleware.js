const cleanInput = (obj) => {
  if (typeof obj === "string") {
    return obj.replace(/<[^>]*>/g, "").trim();
  }
  if (Array.isArray(obj)) {
    return obj.map(cleanInput);
  }
  if (obj !== null && typeof obj === "object") {
    const cleaned = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        cleaned[key] = cleanInput(obj[key]);
      }
    }
    return cleaned;
  }
  return obj;
};

const sanitizeMiddleware = (req, res, next) => {
  if (req.body) req.body = cleanInput(req.body);
  if (req.query) req.query = cleanInput(req.query);
  if (req.params) req.params = cleanInput(req.params);
  next();
};

export default sanitizeMiddleware;
