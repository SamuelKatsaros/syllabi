import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Check if course exists
    const { name, department, university_id } = req.query;
    const { data, error } = await supabase
      .from("courses")
      .select("id")
      .eq("name", name as string)
      .eq("department", department as string)
      .eq("university_id", university_id as string)
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    // Create a new course
    const { name, department, course_code, university_id } = req.body;

    // Validate required fields
    if (!name || !department || !course_code || !university_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("courses")
      .insert([{ name, department, course_code, university_id }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: `Failed to create course: ${error.message}` });
    }

    return res.status(201).json(data);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
