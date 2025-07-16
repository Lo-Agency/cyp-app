import express from "express";
import {
    createDebt,
    getUserDebts,
    updateDebt,
    deleteDebt,
} from "./debt.services.js";
import { verifyAccessToken } from "../../utils/jwt.js";

const router = express.Router();

router.use(verifyAccessToken);


router.post("/", async (req, res, next) => {
    try {
        const { title, amount, interestRate, dueDate, creditor } = req.body;
        const userId = req.user.id;

        const debt = await createDebt({
            title,
            amount,
            interestRate,
            dueDate,
            creditor,
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
        const debts = await getUserDebts(userId);
        res.json(debts);
    } catch (err) {
        next(err);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, amount, interestRate, dueDate, creditor } = req.body;
        const userId = req.user.id;

        const goal = await updateDebt(id, userId, {
            title, amount, interestRate, dueDate, creditor
        });
        res.json(debt);
    } catch (err) {
        next(err);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        await deleteDebt(id, userId);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});

export default router;