import type { NextApiRequest, NextApiResponse } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_DISEASE_API_URL || "http://127.0.0.1:8000";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const backendRes = await fetch(`${BACKEND_URL}/api/v1/devices/status`);
    if (!backendRes.ok) {
      return res.status(200).json({ online: false, devices: [] });
    }
    const data = await backendRes.json();
    return res.status(200).json({ 
      online: data.online === true,
      devices: data.devices || []
    });
  } catch (err: any) {
    console.error("[API/monitoring/status] Error:", err);
    return res.status(200).json({ online: false, devices: [] });
  }
}
