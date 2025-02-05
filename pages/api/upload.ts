import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Disable Next.js default body parsing
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log("Incoming file upload request...");

    const form = new IncomingForm({
      keepExtensions: true,
      multiples: false,
    });

    return new Promise((resolve, reject) => {
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Formidable parsing error:", err);
          reject(res.status(500).json({ error: 'Error parsing file' }));
          return;
        }

        try {
          console.log("Parsed form data:", fields, files);

          // Extract single values from arrays and ensure they're strings
          const course_name = Array.isArray(fields.course_name) ? fields.course_name[0] : fields.course_name;
          const department = Array.isArray(fields.department) ? fields.department[0] : fields.department;
          const course_code = Array.isArray(fields.course_code) ? fields.course_code[0] : fields.course_code;
          const professor = Array.isArray(fields.professor) ? fields.professor[0] : fields.professor;
          const semester = Array.isArray(fields.semester) ? fields.semester[0] : fields.semester;
          const university_id = Array.isArray(fields.university_id) ? fields.university_id[0] : fields.university_id;

          if (!university_id) {
            reject(res.status(400).json({ error: "University ID is required." }));
            return;
          }

          // Handle file upload
          const fileObj = files.file;
          const uploadedFile = Array.isArray(fileObj) ? fileObj[0] : fileObj;

          if (!uploadedFile || !course_name || !department || !course_code) {
            reject(res.status(400).json({ error: 'Missing required fields' }));
            return;
          }

          // Create course first with separate name and code
          const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .insert([
              {
                name: course_name, // Store only the course title
                department,
                course_code,
                professor,
                semester,
                university_id
              }
            ])
            .select()
            .single();

          if (courseError) {
            reject(res.status(500).json({ error: courseError.message }));
            return;
          }

          // Upload file to Supabase Storage
          const fileData = fs.readFileSync(uploadedFile.filepath);
          const fileExt = uploadedFile.originalFilename?.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `syllabi/${fileName}`;

          const { error: storageError } = await supabase.storage
            .from('syllabi')
            .upload(filePath, fileData, {
              contentType: uploadedFile.mimetype || 'application/pdf',
            });

          if (storageError) {
            reject(res.status(500).json({ error: storageError.message }));
            return;
          }

          // Get public URL
          const publicUrl = supabase.storage
            .from('syllabi')
            .getPublicUrl(filePath).data.publicUrl;

          // Create syllabus record
          const { error: syllabusError } = await supabase
            .from('syllabi')
            .insert([
              {
                course_id: courseData.id,
                university_id,
                file_url: publicUrl,
              }
            ]);

          if (syllabusError) {
            reject(res.status(500).json({ error: syllabusError.message }));
            return;
          }

          resolve(res.status(200).json({ 
            message: 'Upload successful', 
            file_url: publicUrl 
          }));
        } catch (error) {
          console.error("Processing error:", error);
          reject(res.status(500).json({ error: 'Error processing upload' }));
        }
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
