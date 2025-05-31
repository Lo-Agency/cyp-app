import express from "express";
import { prisma } from "../prisma.ts";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "همه فیلدها الزامی هستند." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "این ایمیل قبلاً ثبت شده است." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({
      message: "ثبت‌نام با موفقیت انجام شد",
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "خطا در سرور", error: err });
  }
});

export default router;
