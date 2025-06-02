const jwt = require("jsonwebtoken");

const ACCESS_SECRET = "your_access_secret"; // حتماً از .env بگیر بعداً
const REFRESH_SECRET = "your_refresh_secret";

exports.createAccessToken = (user) => {
  return jwt.sign({ userId: user.id }, ACCESS_SECRET, { expiresIn: "15m" });
};

exports.createRefreshToken = (user) => {
  return jwt.sign({ userId: user.id }, REFRESH_SECRET, { expiresIn: "7d" });
};
