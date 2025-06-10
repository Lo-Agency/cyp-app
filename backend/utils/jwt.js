import jwt from "jsonwebtoken";
import crypto from "crypto";

// Usually I keep the token between 5 minutes - 15 minutes
function generateAccessToken(user) {
  return jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });
}

// Generate a random string as refreshToken
function generateRefreshToken() {
  const token = crypto.randomBytes(16).toString("base64url");
  return token;
}

function generateTokens(user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();
  return { accessToken, refreshToken };
}
function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "توکن وجود ندارد" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = { id: decoded.userId }; // اینجا مهمه!
    next();
  } catch (err) {
    return res.status(401).json({ message: "توکن نامعتبر است" });
  }
}

export {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyAccessToken,
};
