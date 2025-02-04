import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const universityId = req.headers["x-university-id"] as string;

  if (!universityId) {
    return res.status(400).json({ error: "University ID is required" });
  }

  const query = supabase
    .from("syllabi")
    .select("id, file_url, created_at, university_id, courses(id, name, department, course_code, professor, semester)")
    .eq("university_id", universityId);

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json(data);
}
