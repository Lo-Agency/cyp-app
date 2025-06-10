import express from "express";
import cors from "cors";
import authRoutes from "./api/auth/auth.routes";
import transactionRoutes from "./api/transaction/transaction.routes";
import categoryRoutes from "./api/category/category.routes"
import budgetRoutes from "./api/budget/budget.routes"
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);
app.use ("/api/budget" , budgetRoutes)
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
app.use("/api/category", categoryRoutes)
