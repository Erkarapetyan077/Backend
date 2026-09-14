const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: "Token is required",
    });
  }

  const token = authHeader.split(" ");

  try {
    const user = jwt.verify(token[1], "secret_key");
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}

function authorize(role) {
  return function (req, res, next) {
    if (req.user.role === role) {
      next();
    } else {
      res.status(403).json({
        message: "Forbidden",
      });
    }
  };
}

module.exports = { authenticate, authorize };
