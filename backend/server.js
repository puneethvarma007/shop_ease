import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import offersRouter from "./src/routes/offers.routes.js";
import feedbackRouter from "./src/routes/feedback.routes.js";
import analyticsRouter from "./src/routes/analytics.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import salesRouter from "./src/routes/sales.routes.js";
import categoriesRouter from "./src/routes/categories.routes.js";
import storesRouter from "./src/routes/stores.routes.js";
import sectionsRouter from "./src/routes/sections.routes.js";
// Supabase service (ensures single client)
import { supabase } from "./src/services/supabase.js";

dotenv.config();
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Touch supabase to ensure envs are present (logs warning in service if missing)
if (!supabase) {
  console.error("Supabase client failed to initialize. Check backend .env variables.");
}

// Sample route
app.get("/", (req, res) => {
  res.json({ message: "ShopEase Backend API is running 🚀" });
});

// API routes
app.use("/api/offers", offersRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/auth", authRouter);
app.use("/api/sales", salesRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/stores", storesRouter);
app.use("/api/sections", sectionsRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({ error: err.message || "Server Error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
