import { Router } from "express";
import { supabase } from "../services/supabase.js";

const router = Router();

// POST /api/auth/signup { name, email, phone }
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body || {};
    if (!name || !email || !phone) return res.status(400).json({ error: "name, email, phone are required" });

    const otp = "123456"; // mock for demo
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Use service role client to bypass RLS
    const { data, error } = await supabase
      .from("users")
      .upsert({
        name,
        email,
        phone,
        otp_code: otp,
        otp_expires_at: expires,
        is_verified: false
      }, { onConflict: "email" })
      .select("id, name, email, phone, is_verified")
      .single();

    if (error) {
      console.error("/auth/signup upsert error:", { message: error.message, details: error.details, hint: error.hint, code: error.code });

      // If it's an RLS error, provide helpful message
      if (error.code === "42501") {
        return res.status(400).json({
          error: "Database permission error. Please run the SQL fix in SUPABASE_FIX.sql",
          details: "Row Level Security is blocking user registration. Disable RLS on users table or add proper policies.",
          sqlFix: "ALTER TABLE users DISABLE ROW LEVEL SECURITY;"
        });
      }

      return res.status(400).json({ error: error.message, details: error.details, hint: error.hint, code: error.code });
    }

    res.json({ user: data, message: "OTP sent (mock)", otp });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/verify { email, otp }
router.post("/verify", async (req, res, next) => {
  try {
    const { email, otp } = req.body || {};
    if (!email || !otp) return res.status(400).json({ error: "email and otp are required" });

    // For demo, accept 123456
    if (otp !== "123456") return res.status(400).json({ error: "Invalid OTP" });

    const { data, error } = await supabase
      .from("users")
      .update({ is_verified: true, otp_code: null, otp_expires_at: null })
      .eq("email", email)
      .select("id, name, email, phone, is_verified")
      .single();

    if (error) {
      console.error("/auth/verify update error:", { message: error.message, details: error.details, hint: error.hint, code: error.code });

      // If it's an RLS error, provide helpful message
      if (error.code === "42501") {
        return res.status(400).json({
          error: "Database permission error. Please run the SQL fix in SUPABASE_FIX.sql",
          details: "Row Level Security is blocking user update. Disable RLS on users table or add proper policies."
        });
      }

      return res.status(400).json({ error: error.message, details: error.details, hint: error.hint, code: error.code });
    }

    // Return a minimal session token (mock) for demo purposes
    const token = Buffer.from(`${data.id}:${Date.now()}`).toString("base64");
    res.json({ user: data, token });
  } catch (err) {
    next(err);
  }
});

export default router;
