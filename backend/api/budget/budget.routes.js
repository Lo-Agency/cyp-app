import express from "express";
import {
  createBudget,
  getUserBudgets,
  updateBudget,
  deleteBudget,
} from "./budget.services.js";
import { verifyAccessToken } from "../../utils/jwt.js";

const router = express.Router();

router.use(verifyAccessToken);
router.post("/", async (req, res, next) => {
  try {
    const { amount, categoryId, spent, period } = req.body;
    const userId = req.user.id;

    const budget = await createBudget({
      amount,
      categoryId,
      userId,
      spent,
      period,
    });
    res.status(201).json(budget);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const budgets = await getUserBudgets(userId);
    res.json(budgets);
  } catch (err) {
    next(err);
  }
});
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, categoryId, spent, period } = req.body;
    const userId = req.user.id;

    const updatedBudget = await updateBudget(id, userId, {
      amount,
      categoryId,
      spent,
      period,
    });

    res.json(updatedBudget);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const budgetId = req.params.id;
    const userId = req.user.id;

    await deleteBudget(budgetId, userId);

    res.json({ message: "بودجه با موفقیت حذف شد" });
  } catch (err) {
    next(err);
  }
});

export default router;
