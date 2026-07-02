const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET || "ops-dashboard-secret";

// Check if user is logged in
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Access Denied. No Token Provided."
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid Token"
    });
  }
}

// Check user role
function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden. You don't have permission."
      });
    }
    next();
  };
}

module.exports = {
  authenticateToken,
  allowRoles,
};