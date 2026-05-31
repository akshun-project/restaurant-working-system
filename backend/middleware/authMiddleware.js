 const jwt = require("jsonwebtoken");


// VERIFY TOKEN
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization;

    // TOKEN CHECK
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Access denied",
      });
    }

    // FORMAT:
    // Bearer TOKEN
    const token =
      authHeader.split(" ")[1];

    // VERIFY JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // SAVE USER
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};


// VERIFY ADMIN
exports.verifyAdmin = (
  req,
  res,
  next
) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Admin access only",
      });
    }

    next();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};