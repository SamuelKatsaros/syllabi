import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { university_id, department, course_code, sort } = req.query;

  if (typeof university_id !== 'string') {
    return res.status(400).json({ error: 'Invalid university id' });
  }

  // Build the query for the specified university only.
  let query = supabase
    .from('syllabi')
    .select('id, file_url, created_at, university_id, courses(id, name, department, course_code)')
    .eq('university_id', university_id);

  // Apply filters if provided.
  if (department && typeof department === 'string') {
    query = query.eq('courses.department', department);
  }
  if (course_code && typeof course_code === 'string') {
    query = query.eq('courses.course_code', course_code);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  // Apply sorting logic (assumes courses is an array)
  if (sort === 'alphabetical') {
    data.sort((a, b) => (a.courses?.[0]?.name ?? '').localeCompare(b.courses?.[0]?.name ?? ''));
  } else if (sort === 'latest') {
    data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return res.status(200).json(data);
}
