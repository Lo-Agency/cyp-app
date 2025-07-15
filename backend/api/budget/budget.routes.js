import express from "express";
import {
  createBudget,
  getUserBudgets
} from "./budget.services.js";
import { verifyAccessToken } from "../../utils/jwt.js";

const router = express.Router();

router.use(verifyAccessToken); 
router.post("/", async (req, res, next) => {
  try {
    const { amount, categoryId, spent, period} = req.body;
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
    const budget = await db.budget.update({
      where: { id, userId },
      data: {
        amount,
        spent,
        period,
        category: { connect: { id: parseInt(categoryId) } },
      },
    });
    res.json(budget);
  } catch (err) {
    next(err);
  }
});

export default router;