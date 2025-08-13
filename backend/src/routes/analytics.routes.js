import { Router } from "express";
import { supabase } from "../services/supabase.js";

const router = Router();

// POST /api/analytics/scan { storeId, sectionId?, userId?, scanType? }
router.post("/scan", async (req, res, next) => {
  try {
    const { storeId, sectionId, userId, scanType = 'store_entrance' } = req.body;
    if (!storeId) return res.status(400).json({ error: "storeId is required" });

    const payload = {
      store_id: storeId,
      section_id: sectionId || null,
      user_id: userId || null,
      scan_type: scanType,
      ip_address: req.ip || null,
      user_agent: req.get('User-Agent') || null,
    };

    const { data, error } = await supabase.from("qr_scans").insert(payload).select("*").single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/overview?storeId=...&from=...&to=...
router.get("/overview", async (req, res, next) => {
  try {
    const { storeId, from, to } = req.query;
    if (!storeId) return res.status(400).json({ error: "storeId is required" });

    // Simple aggregations. Add filters conditionally.
    let query = supabase
      .from("qr_scans")
      .select("id, scanned_at")
      .eq("store_id", storeId);

    if (from) query = query.gte("scanned_at", from);
    if (to) query = query.lte("scanned_at", to);

    const { data: scans, error: scansError } = await query;
    if (scansError) return res.status(400).json({ error: scansError.message });

    const totalScans = scans?.length || 0;

    // TODO: compute conversions and avg spend by joining with sales/orders table if available
    const conversions = Math.round(totalScans * 0.35);
    const avgSpend = 1200;

    res.json({ totalScans, conversions, conversionRate: totalScans ? conversions / totalScans : 0, avgSpend });
  } catch (err) {
    next(err);
  }
});

export default router;

// GET /api/analytics/daily-scans?storeId=...&from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/daily-scans", async (req, res, next) => {
  try {
    const { storeId, from, to } = req.query;
    if (!storeId || !from || !to) return res.status(400).json({ error: "storeId, from, to are required" });

    const { data, error } = await supabase.rpc("get_daily_scans", {
      store_id_param: storeId,
      start_date: from,
      end_date: to,
    });
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/feedback-summary?storeId=...&from=YYYY-MM-DD&to=YYYY-MM-DD
router.get("/feedback-summary", async (req, res, next) => {
  try {
    const { storeId, from, to } = req.query;
    if (!storeId) return res.status(400).json({ error: "storeId is required" });
    const args = { store_id_param: storeId };
    if (from) args.start_date = from;
    if (to) args.end_date = to;

    const { data, error } = await supabase.rpc("get_feedback_summary", args);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    next(err);
  }
});
