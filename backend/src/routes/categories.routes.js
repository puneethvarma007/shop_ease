import { Router } from "express";
import { supabase } from "../services/supabase.js";

const router = Router();

// GET /api/categories
router.get("/", async (req, res, next) => {
  try {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

export default router;
