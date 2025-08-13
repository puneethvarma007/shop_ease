import { Router } from "express";
import { supabase } from "../services/supabase.js";

const router = Router();

// GET /api/sections?storeId=... (list sections for a store)
router.get("/", async (req, res, next) => {
  try {
    const { storeId } = req.query;
    if (!storeId) return res.status(400).json({ error: "storeId is required" });
    const { data, error } = await supabase
      .from("store_sections")
      .select("id,name,store_id,created_at")
      .eq("store_id", storeId)
      .order("name");
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

export default router;

