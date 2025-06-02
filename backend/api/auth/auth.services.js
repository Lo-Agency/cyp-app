const bcrypt = require("bcryptjs");
const prisma = require("../../utils/db"); // مسیر درست با توجه به ساختار تو
const { createAccessToken, createRefreshToken } = require("../../utils/jwt");

exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // بررسی وجود کاربر
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: "کاربر قبلاً ثبت‌نام کرده است." });
    }

    // هش کردن پسورد
    const hashedPassword = await bcrypt.hash(password, 10);

    // ساخت کاربر
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // ساختن توکن‌ها
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // خروجی JSON به سمت فرانت
    res.status(201).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "خطای سرور در ثبت‌نام" });
  }
};
