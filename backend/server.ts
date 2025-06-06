import express from "express";
import cors from "cors";
import authRoutes from "./api/auth/auth.routes";
import transactionRoutes from "./api/transaction/transaction.routes";

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
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
