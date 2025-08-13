import { Router } from "express";
import { supabase } from "../services/supabase.js";

const router = Router();

// GET /api/feedback/questions?storeId=... or ?storeSlug=...
router.get("/questions", async (req, res, next) => {
  try {
    const { storeId, storeSlug } = req.query;

    let query = supabase
      .from("feedback_questions")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (storeId) {
      query = query.eq("store_id", storeId);
    } else if (storeSlug) {
      // For backward compatibility, create a demo store if using storeSlug
      // In your schema, you might want to add a slug field to stores table
      // For now, we'll use a default store or create sample questions
      const demoQuestions = [
        { id: '1', question: 'How would you rate the product quality?', question_type: 'rating', order_index: 1 },
        { id: '2', question: 'How satisfied are you with our customer service?', question_type: 'rating', order_index: 2 },
        { id: '3', question: 'Would you recommend our store to friends?', question_type: 'rating', order_index: 3 },
        { id: '4', question: 'How easy was it to find what you were looking for?', question_type: 'rating', order_index: 4 },
        { id: '5', question: 'Any additional comments or suggestions?', question_type: 'text', order_index: 5 }
      ];
      return res.json(demoQuestions);
    } else {
      return res.status(400).json({ error: "storeId or storeSlug is required" });
    }

    const { data, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.json(data || []);
  } catch (err) {
    next(err);
  }
});

// POST /api/feedback/submit
// { storeId, userId?, responses: [{questionId, rating, text?}] }
router.post("/submit", async (req, res, next) => {
  try {
    const { storeId, userId, responses = [] } = req.body;
    if (!storeId || !responses.length) return res.status(400).json({ error: "storeId and responses are required" });

    const toInsert = responses.map((r) => ({
      store_id: storeId,
      user_id: userId || null,
      question_id: r.questionId,
      rating: r.rating ?? null,
      response_text: r.text ?? null,
    }));

    const { data, error } = await supabase.from("feedback_responses").insert(toInsert).select("*");
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ inserted: data.length });
  } catch (err) {
    next(err);
  }
});

export default router;
