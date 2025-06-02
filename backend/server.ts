// server.ts یا server.js در حالت ESM یا TypeScript

import express from "express";
import cors from "cors";
import authRoutes from "./api/auth/auth.routes"; // باید export default داشته باشه

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
