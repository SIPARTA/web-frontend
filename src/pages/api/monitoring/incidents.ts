/**
 * Next.js API Route — /api/monitoring/incidents
 * ================================================
 * Proxy tipis antara frontend dan Supabase.
 * Frontend tidak memegang Supabase key; backend route ini yang memegang.
 *
 * Query: Ambil 100 insiden terbaru, diurutkan dari yang paling baru.
 */

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    // Kembalikan array kosong jika Supabase belum dikonfigurasi (dev mode)
    console.warn("[API/monitoring] Supabase env vars tidak diset. Returning empty array.");
    return res.status(200).json([]);
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data, error } = await supabase
      .from("incident_events")
      .select("id, incident_type, severity, sensor_data, image_url, ai_analysis_text, timestamp, is_anchored")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (error) {
      console.error("[API/monitoring] Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data ?? []);
  } catch (err: any) {
    console.error("[API/monitoring] Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
