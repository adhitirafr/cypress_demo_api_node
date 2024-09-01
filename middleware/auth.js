import jwt from "jsonwebtoken";

export function authenticateToken(req, res, next) {
  const token = req.cookies.authToken; // Access the HttpOnly cookie

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized. No token provided.",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err); // Log the error for debugging
      return res.status(403).json({
        status: "error",
        message: "Forbidden. Invalid token.",
      });
    }
    req.user = user; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
  });
}
