import express from "express";
import {
  createTransaction,
  getUserTransactions,
} from "./transaction.services.js";
import { verifyAccessToken } from "../../utils/jwt.js";

const router = express.Router();

router.use(verifyAccessToken); // می‌خوای همه تراکنش‌ها فقط با JWT باشن

router.post("/", async (req, res, next) => {
  try {
    const { title, amount, type, category, date } = req.body;
    const userId = req.user.id;

    const transaction = await createTransaction({
      title,
      amount,
      type,
      categoryId: category,
      date,
      userId,
      ...(date && { createdAt: new Date(date) }),
    });
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactions = await getUserTransactions(userId);
    res.json(transactions);
  } catch (err) {
    next(err);
  }
});

export default router;
