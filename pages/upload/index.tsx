"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

export default function UploadSyllabus() {
  const [file, setFile] = useState<File | null>(null);
  const [courseName, setCourseName] = useState("");
  const [department, setDepartment] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [uploading, setUploading] = useState(false);
  const [universityId, setUniversityId] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (router.query.university) {
      setUniversityId(router.query.university as string);
    }
  }, [router.query.university]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !courseName || !department || !courseCode || !universityId) {
      alert("Please fill all fields and upload a file.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("course_name", courseName);
      formData.append("department", department); 
      formData.append("course_code", courseCode);
      formData.append("university_id", universityId);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Syllabus uploaded successfully!");
        router.push(`/?university=${universityId}`);
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error", error);
      alert("Upload failed.");
    }
    setUploading(false);
  };

  return (
    <div>
      <Navbar universityId={universityId} />
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Upload a Syllabus</h2>
        <input 
          type="file" 
          onChange={handleFileChange} 
          className="border p-2 mb-2 w-full" 
        />
        <input 
          type="text" 
          placeholder="Course Name" 
          value={courseName} 
          onChange={(e) => setCourseName(e.target.value)} 
          className="border p-2 mb-2 w-full" 
        />
        <input 
          type="text" 
          placeholder="Department" 
          value={department} 
          onChange={(e) => setDepartment(e.target.value)} 
          className="border p-2 mb-2 w-full" 
        />
        <input 
          type="text" 
          placeholder="Course Code" 
          value={courseCode} 
          onChange={(e) => setCourseCode(e.target.value)} 
          className="border p-2 mb-2 w-full" 
        />
        <button 
          onClick={handleUpload} 
          disabled={uploading}
          className="bg-blue-500 text-white px-4 py-2 mt-2 hover:bg-blue-600 disabled:bg-blue-300"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
}
