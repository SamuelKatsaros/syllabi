"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import themes from "../themes.json";

interface UploadModalProps {
  universityId?: string;
}

export default function UploadModal({ universityId: initialUniversityId = "" }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [courseName, setCourseName] = useState("");
  const [department, setDepartment] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [uploading, setUploading] = useState(false);
  const [universityId, setUniversityId] = useState(initialUniversityId);

  const router = useRouter();
  const theme = themes[universityId as keyof typeof themes] || themes.default;

  useEffect(() => {
    if (initialUniversityId) {
      setUniversityId(initialUniversityId);
    }
  }, [initialUniversityId]);

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
        (document.getElementById("upload_modal") as HTMLDialogElement | null)?.close();
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
    <>
      <dialog id="upload_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4" style={{ color: theme.primaryColor }}>Upload a Syllabus</h3>
          <div className="space-y-4">
            <div className="form-control">
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="file-input file-input-bordered w-full text-gray-800 bg-white" 
              />
            </div>
            <div className="form-control">
              <input 
                type="text" 
                placeholder="Course Name" 
                value={courseName} 
                onChange={(e) => setCourseName(e.target.value)}
                className="input input-bordered w-full text-gray-800 bg-white placeholder-gray-500" 
              />
            </div>
            <div className="form-control">
              <input 
                type="text" 
                placeholder="Department" 
                value={department} 
                onChange={(e) => setDepartment(e.target.value)}
                className="input input-bordered w-full text-gray-800 bg-white placeholder-gray-500" 
              />
            </div>
            <div className="form-control">
              <input 
                type="text" 
                placeholder="Course Code" 
                value={courseCode} 
                onChange={(e) => setCourseCode(e.target.value)}
                className="input input-bordered w-full text-gray-800 bg-white placeholder-gray-500" 
              />
            </div>
          </div>
          <div className="modal-action">
            <button 
              onClick={handleUpload} 
              disabled={uploading}
              className="btn"
              style={{ backgroundColor: theme.primaryColor, color: 'white', borderColor: theme.primaryColor }}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button className="btn" onClick={() => (document.getElementById("upload_modal") as HTMLDialogElement | null)?.close()}>
              Close
            </button>
          </div>
        </div>
      </dialog>
      <button className="btn btn-ghost" onClick={() => (document.getElementById("upload_modal") as HTMLDialogElement | null)?.showModal()}>
        <div className="indicator">
          Upload
        </div>
      </button>
    </>
  );
} 