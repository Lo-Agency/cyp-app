import express from "express";
import { getReportData } from "./report.services.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const reportData = await getReportData();
    res.json(reportData);
  } catch (error) {
    console.error("Report Error:", error);
    res.status(500).json({ error: "خطا در دریافت گزارش‌ها" });
  }
});

export default router;
