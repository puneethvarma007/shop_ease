import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Sample route
app.get("/", (req, res) => {
  res.json({ message: "ShopEase Backend API is running 🚀" });
});

// Example: Fetch offers
app.get("/offers", async (req, res) => {
  const { data, error } = await supabase.from("offers").select("*");
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
