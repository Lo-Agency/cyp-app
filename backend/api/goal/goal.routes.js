import express from "express";
import {
  createGoal,
  getUserGoals,
  updateGoal,
  deleteGoal,
} from "./goal.services.js";
import { verifyAccessToken } from "../../utils/jwt.js";

const router = express.Router();

router.use(verifyAccessToken);

router.post("/", async (req, res, next) => {
  try {
    const { title, targetAmount, currentAmount, deadline } = req.body;
    const userId = req.user.id;

    const goal = await createGoal({
      title,
      targetAmount,
      currentAmount,
      deadline,
      userId,
    });
    res.status(201).json(goal);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const userId = req.user.id;
    const goals = await getUserGoals(userId);
    res.json(goals);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, targetAmount, currentAmount, deadline } = req.body;
    const userId = req.user.id;

    const goal = await updateGoal(id, userId, {
      title,
      targetAmount,
      currentAmount,
      deadline,
    });
    res.json(goal);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await deleteGoal(id, userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;