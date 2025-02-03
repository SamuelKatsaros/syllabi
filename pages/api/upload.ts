import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import formidable from 'formidable';
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

    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Formidable parsing error:", err);
        return res.status(500).json({ error: 'Error parsing file' });
      }

      console.log("Parsed form data:", fields, files);

      // Extract single values from arrays
      const course_id = Array.isArray(fields.course_id) ? fields.course_id[0] : fields.course_id;
      const university_id = Array.isArray(fields.university_id) ? fields.university_id[0] : fields.university_id;

      if (!university_id) {
        console.error("University ID is required.");
        return res.status(400).json({ error: "University ID is required." });
      }

      const fileObj = files.file;
      // Fix: if fileObj is an array, get the first file
      const uploadedFile = Array.isArray(fileObj) ? fileObj[0] : fileObj;

      if (!uploadedFile || !course_id) {
        console.error("Missing required fields:", { file: uploadedFile, course_id, university_id });
        return res.status(400).json({ error: 'Missing file or course_id' });
      }

      console.log("Uploading file to Supabase...");

      const fileData = fs.readFileSync(uploadedFile.filepath);
      const fileExt = uploadedFile.originalFilename?.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `syllabi/${fileName}`;

      const { data, error } = await supabase.storage.from('syllabi').upload(filePath, fileData, {
        contentType: uploadedFile.mimetype || 'application/pdf',
      });

      if (error) {
        console.error("Supabase Storage upload error:", error.message);
        return res.status(500).json({ error: error.message });
      }

      console.log("File uploaded successfully:", data);

      const publicUrl = supabase.storage.from('syllabi').getPublicUrl(filePath).data.publicUrl;

      console.log("Inserting into database...");

      const { error: dbError } = await supabase.from('syllabi').insert([
        { course_id, university_id, file_url: publicUrl },
      ]);

      if (dbError) {
        console.error("Supabase DB insert error:", dbError.message);
        return res.status(500).json({ error: dbError.message });
      }

      console.log("Upload completed successfully.");
      return res.status(200).json({ message: 'Upload successful', file_url: publicUrl });
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ error: 'Unexpected error' });
  }
}
