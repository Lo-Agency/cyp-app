import express, { Request, Response, Router } from "express";
import { prisma } from "../prisma";
import bcrypt from "bcrypt";

const router: Router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "همه فیلدها الزامی هستند." });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(400).json({ message: "این ایمیل قبلاً ثبت شده است." });
      return;
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
    console.error(err);
    res.status(500).json({ message: "خطا در سرور" });
  }
});

export default router;
