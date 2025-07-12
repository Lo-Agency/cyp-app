import express from "express";
import {
  createTransaction,
  getUserTransactions,
} from "./transaction.services.js";
import { verifyAccessToken } from "../../utils/jwt.js";
import { db } from "../../utils/db.js";

const router = express.Router();

router.use(verifyAccessToken); // می‌خوای همه تراکنش‌ها فقط با JWT باشن

router.post("/", async (req, res, next) => {
  try {
    const { title, date, amount, type, categoryId } = req.body;
    const userId = req.user.id;

    const transaction = await createTransaction({
      title,
      amount,
      type,
      categoryId,
      userId,
      date,
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

// DELETE /api/transaction/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionId = Number(req.params.id);

    const transaction = await db.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction || transaction.userId !== userId) {
      return res.status(404).json({ error: "تراکنش پیدا نشد" });
    }

    await db.transaction.delete({
      where: { id: transactionId },
    });

    res.json({ message: "تراکنش با موفقیت حذف شد." });
  } catch (err) {
    next(err);
  }
});

// GET /api/transaction/:id
router.get("/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionId = Number(req.params.id);

    const transaction = await db.transaction.findUnique({
      where: { id: transactionId },
      include: {
        category: true,
      },
    });

    if (!transaction || transaction.userId !== userId) {
      return res.status(404).json({ error: "تراکنش پیدا نشد" });
    }

    res.json(transaction);
  } catch (err) {
    next(err);
  }
});
// PUT /api/transaction/:id
router.put("/:id", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactionId = Number(req.params.id);
    const { title, amount, type, categoryId, date } = req.body;

    const transaction = await db.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction || transaction.userId !== userId) {
      return res.status(404).json({ error: "تراکنش پیدا نشد" });
    }

    const updated = await db.transaction.update({
      where: { id: transactionId },
      data: {
        title,
        amount,
        type,
        categoryId,
        date: new Date(date),
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
