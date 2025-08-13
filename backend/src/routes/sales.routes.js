import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import { supabase } from "../services/supabase.js";
import { buildSalesTemplate } from "../utils/excel.js";


const router = Router();

const isUuid = (v) => typeof v === 'string' && /^[0-9a-fA-F-]{36}$/.test(v);

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/sales/upload (multipart: file) -> inserts into sales_data
router.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "file is required" });
    const buf = req.file.buffer;
    const wb = xlsx.read(buf, { type: "buffer" });
    const rows = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });

    // Expected columns (case-insensitive): store_id, sale_date, total_amount, customer_count, items_sold
    const entries = rows
      .map((r) => ({
        store_id: String(r.store_id || r.StoreId || r.storeID || r.StoreID || "").trim(),
        sale_date: (r.sale_date || r.SaleDate || null) ? new Date(r.sale_date || r.SaleDate).toISOString().slice(0,10) : null,
        total_amount: r.total_amount != null ? Number(r.total_amount) : null,
        customer_count: r.customer_count != null ? Number(r.customer_count) : 1,
        items_sold: r.items_sold != null ? Number(r.items_sold) : 1,
      }))
      .filter((e) => isUuid(e.store_id) && e.sale_date && e.total_amount != null);

    if (rows.length && entries.length === 0) {
      return res.status(400).json({ error: "No valid rows found. Ensure store_id is a UUID and sale_date is a valid date (YYYY-MM-DD)." });
    }

    if (!entries.length) return res.status(400).json({ error: "No valid rows found" });

    const { data, error } = await supabase.from("sales_data").insert(entries).select("id");
    if (error) return res.status(400).json({ error: error.message });

    res.json({ inserted: data?.length || 0 });
  } catch (err) {
    next(err);
  }
});

// GET /api/sales/template -> returns .xlsx template
router.get("/template", async (req, res) => {
  try {
    const { buffer, contentType, filename } = await buildSalesTemplate({ storeSlug: req.query.storeSlug });
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.send(buffer);
  } catch (e) {
    res.status(500).json({ error: "Could not generate template" });
  }
});


export default router;
