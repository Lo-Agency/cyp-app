import express from "express";
import { getAllCategories } from "./category.services";
const router = express.Router();


router.get("/", async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        res.json(categories);
    } catch (err) {
        next(err);
    }
});
export default router;