import { Router } from "express";
import { supabase } from "../services/supabase.js";

const router = Router();

// GET /api/stores?search=
router.get("/", async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = supabase.from("stores").select("id,name,slug,created_at").order("name");
    if (search) {
      // case-insensitive ilike search on name or slug
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
    }
    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

export default router;

