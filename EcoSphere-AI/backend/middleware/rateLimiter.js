const ipRequests = new Map();

const rateLimiter = (limit = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const now = Date.now();

    if (!ipRequests.has(ip)) {
      ipRequests.set(ip, []);
    }

    const requests = ipRequests.get(ip).filter((timestamp) => now - timestamp < windowMs);
    requests.push(now);
    ipRequests.set(ip, requests);

    if (requests.length > limit) {
      return res.status(429).json({
        success: false,
        message: "Too many requests from this IP, please try again later",
      });
    }

    next();
  };
};

export default rateLimiter;
