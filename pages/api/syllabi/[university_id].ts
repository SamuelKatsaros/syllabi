import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { university_id, sort } = req.query;

  if (!university_id || typeof university_id !== "string") {
    return res.status(400).json({ error: "Missing or invalid university ID" });
  }

  let query = supabase
    .from("syllabi")
    .select("id, file_url, created_at, university_id, courses(id, name, department, course_code, professor, semester)")
    .eq("university_id", university_id);

  if (sort === "alphabetical") {
    query = query.order("name", { ascending: true });
  } else if (sort === "latest") {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
