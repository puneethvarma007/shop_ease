import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Load .env first
dotenv.config();
// Then try to load .env.local if present (without overriding already-set vars)
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: false });
}

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Safe diagnostic: decode JWT payload (if present) to check role claim
try {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("[Supabase] SUPABASE_SERVICE_ROLE_KEY is not set");
  } else {
    const parts = SUPABASE_SERVICE_ROLE_KEY.split(".");
    if (parts.length >= 2) {
      const payloadJson = Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
      const payload = JSON.parse(payloadJson);
      const roleClaim = payload?.role || payload?.["https://supabase.io/roles"] || payload?.app_metadata?.provider || "unknown";
      console.log("[Supabase] Service key detected role:", roleClaim, "token_prefix:", SUPABASE_SERVICE_ROLE_KEY.slice(0, 8) + "…");
    } else {
      console.log("[Supabase] Service key format not JWT-like; cannot inspect role claim");
    }
  }
} catch (e) {
  console.warn("[Supabase] Could not decode service key payload:", e?.message);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "[ERROR] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to backend .env or .env.local"
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
