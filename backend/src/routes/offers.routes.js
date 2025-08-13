import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import { supabase } from "../services/supabase.js";
import { buildOffersTemplate } from "../utils/excel.js";


const router = Router();

// Simple UUID v4 format check
const isUuid = (v) => typeof v === 'string' && /^[0-9a-fA-F-]{36}$/.test(v);

const upload = multer({ storage: multer.memoryStorage() });

// GET /api/offers?storeId=...&sectionId=...&categoryId=...&preview=true&limit=6
router.get("/", async (req, res, next) => {
  try {
    const { storeId, sectionId, categoryId, preview, limit } = req.query;
    let query = supabase.from("offers").select("*").order("created_at", { ascending: false });

    // Validate IDs to avoid UUID cast errors
    if (storeId && !isUuid(storeId)) return res.status(400).json({ error: `Invalid storeId (must be UUID)` });
    if (categoryId && !isUuid(categoryId)) return res.status(400).json({ error: `Invalid categoryId (must be UUID)` });

    if (storeId) query = query.eq("store_id", storeId);
    if (sectionId && sectionId !== "main") query = query.eq("section_id", sectionId);
    if (categoryId) query = query.eq("category_id", categoryId);
    if (preview === "true") query = query.limit(Number(limit) || 6);

    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// POST /api/offers - create one
router.post("/", async (req, res, next) => {
  try {
    const payload = req.body;

    // Resolve slugs/names to UUIDs if provided
    const { store_slug, section_name, category_name } = payload;

    let store_id = payload.store_id;
    if (!store_id && store_slug) {
      const { data: s } = await supabase.from("stores").select("id").eq("slug", store_slug).single();
      store_id = s?.id || null;
    }

    let section_id = payload.section_id;
    if (!section_id && section_name && store_id) {
      const { data: sec } = await supabase.from("store_sections").select("id").eq("store_id", store_id).ilike("name", section_name).maybeSingle();
      section_id = sec?.id || null;
    }

    let category_id = payload.category_id;
    if (!category_id && category_name) {
      const { data: cat } = await supabase.from("categories").select("id").ilike("name", category_name).maybeSingle();
      category_id = cat?.id || null;
    }

    const toInsert = { ...payload, store_id, section_id, category_id };

    if (!toInsert.store_id) return res.status(400).json({ error: "store_id or store_slug is required" });

    const { data, error } = await supabase.from("offers").insert(toInsert).select("*").single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
});

// PUT /api/offers/:id
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { data, error } = await supabase.from("offers").update(payload).eq("id", id).select("*").single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/offers/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from("offers").delete().eq("id", id);
    if (error) return res.status(400).json({ error: error.message });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// POST /api/offers/bulk - XLSX upload
router.post("/bulk", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File is required" });

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: "" });

    // Map rows to offer schema. Expected columns (case-insensitive):
    // title, description, original_price, offer_price, discount_percentage, image_url, store_id, section_id, category_id, valid_from, valid_until, is_active
    const offers = rows.map((r) => ({
      title: String(r.title || r.Title || "").trim(),
      description: String(r.description || r.Description || "").trim(),
      // Allow either category_id or category_name
      category_name: String(r.category_name || r.Category || r.category || "").trim() || null,
      category_id: String(r.category_id || r.CategoryId || r.categoryID || r.CategoryID || "").trim() || null,
      original_price: r.original_price != null ? Number(r.original_price) : (r.price != null ? Number(r.price) : null),
      offer_price: r.offer_price != null ? Number(r.offer_price) : (r.sale_price != null ? Number(r.sale_price) : null),
      discount_percentage: r.discount_percentage != null ? Number(r.discount_percentage) : null,
      image_url: String(r.image_url || r.Image || "").trim(),
      // Allow either store_id or store_slug
      store_slug: String(r.store_slug || r.store || r.Store || "").trim() || null,
      store_id: String(r.store_id || r.StoreId || r.storeID || r.StoreID || "").trim() || null,
      // Allow either section_id or section_name
      section_name: (() => { const v = String(r.section_name || r.Section || r.section || "").trim(); return v && v.toLowerCase() !== 'main' ? v : null; })(),
      section_id: (() => { const v = String(r.section_id || r.SectionId || r.sectionID || r.SectionID || "").trim(); return v && v.toLowerCase() !== 'main' ? v : null; })(),
      valid_from: r.valid_from || r.ValidFrom || null,
      valid_until: r.valid_until || r.ValidUntil || null,
      is_active: r.is_active != null ? Boolean(r.is_active) : true,
    })).filter(o => o.title && (o.store_id || o.store_slug));


    // Resolve references in bulk
    const resolved = [];
    for (const o of offers) {
      let store_id = o.store_id;
      if (!store_id && o.store_slug) {
        const { data: s } = await supabase.from("stores").select("id").eq("slug", o.store_slug).single();
        store_id = s?.id || null;
      }
      let section_id = o.section_id;
      if (!section_id && o.section_name && store_id) {
        const { data: sec } = await supabase.from("store_sections").select("id").eq("store_id", store_id).ilike("name", o.section_name).maybeSingle();
        section_id = sec?.id || null;
      }
      let category_id = o.category_id;
      if (!category_id && o.category_name) {
        const { data: cat } = await supabase.from("categories").select("id").ilike("name", o.category_name).maybeSingle();
        category_id = cat?.id || null;
      }
      if (!store_id) continue;
      resolved.push({
        title: o.title,
        description: o.description,
        original_price: o.original_price,
        offer_price: o.offer_price,
        discount_percentage: o.discount_percentage,
        image_url: o.image_url,
        store_id,
        section_id,
        category_id,
        valid_from: o.valid_from,
        valid_until: o.valid_until,
        is_active: o.is_active,
      });
    }

    if (!resolved.length) return res.status(400).json({ error: "No valid rows found after resolving IDs" });

    if (!offers.length) return res.status(400).json({ error: "No valid rows found" });







    const { data, error } = await supabase.from("offers").insert(resolved).select("*");
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ inserted: data.length, items: data });
  } catch (err) {
    next(err);
  }
});

// GET /api/offers/template -> returns .xlsx template
router.get("/template", async (req, res) => {
  try {
    const { buffer, contentType, filename } = await buildOffersTemplate({ storeSlug: req.query.storeSlug });
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.send(buffer);
  } catch (e) {
    res.status(500).json({ error: "Could not generate template" });
  }
});

export default router;
