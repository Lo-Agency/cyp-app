const express = require("express");
const bcrypt = require("bcrypt");
const { generateTokens } = require("../../utils/jwt");
const {
  addRefreshTokenToWhitelist,
  findRefreshToken,
  deleteRefreshTokenById,
  revokeTokens,
} = require("./auth.services");

const router = express.Router();
const {
  findUserByEmail,
  createUserByEmailAndPassword,
  findUserById,
} = require("../user/user.services");

router.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("You must provide an email and a password.");
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      res.status(400);
      throw new Error("Email already in use.");
    }

    const user = await createUserByEmailAndPassword({ email, password });
    const { accessToken, refreshToken } = generateTokens(user);
    await addRefreshTokenToWhitelist({ refreshToken, userId: user.id });

    res.json({
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
