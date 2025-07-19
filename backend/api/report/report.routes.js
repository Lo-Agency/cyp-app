import express from "express";
import { getReportData } from "./report.services.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { filter = "monthly" } = req.query; // پیش‌فرض ماهانه
    const reportData = await getReportData(filter);
    res.json(reportData);
  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ error: "خطا در دریافت گزارش‌ها" });
  }
});

export default router;
