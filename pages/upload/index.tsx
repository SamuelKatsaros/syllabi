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

  // Auto-fill the universityId from the URL query parameter if available
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
      alert("Please enter all details.");
      return;
    }

    setUploading(true);
    try {
      let courseResponse = await fetch(
        `/api/course?name=${encodeURIComponent(courseName)}&department=${encodeURIComponent(department)}&course_code=${encodeURIComponent(courseCode)}&university_id=${universityId}`
      );
      let courseData = await courseResponse.json();
      let course_id = courseData?.id;

      if (!course_id) {
        const createCourseRes = await fetch("/api/course", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: courseName, department, course_code: courseCode, university_id: universityId }),
        });
        const newCourse = await createCourseRes.json();
        if (!createCourseRes.ok) {
          alert("Failed to create course: " + newCourse.error);
          setUploading(false);
          return;
        }
        course_id = newCourse.id;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("course_id", course_id);
      formData.append("university_id", universityId);
      // For now, user_id is fixed; replace with your auth mechanism when available
      formData.append("user_id", "TEMP_USER_ID");

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();
      if (uploadResponse.ok) {
        alert("Upload successful!");
        // Return to homepage with university query param preserved
        router.push(`/?university=${universityId}`);
      } else {
        alert("Upload failed: " + uploadData.error);
      }
    } catch (error) {
      console.error("Upload error", error);
      alert("Upload failed.");
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-center">📤 Upload Syllabus</h1>
        <label className="block mb-2 text-gray-700">University:</label>
        <select
          value={universityId}
          onChange={(e) => setUniversityId(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        >
          <option value="">Select University</option>
          <option value="3884b0da-b578-4e74-b921-e2d52dee1f71">Harvard</option>
          <option value="some-other-university-id">Stanford</option>
        </select>

        <label className="block mb-2 text-gray-700">Course Name:</label>
        <input
          type="text"
          placeholder="e.g., Systems Fundamentals"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        <label className="block mb-2 text-gray-700">Course Code:</label>
        <input
          type="text"
          placeholder="e.g., CSE 220"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        <label className="block mb-2 text-gray-700">Department:</label>
        <input
          type="text"
          placeholder="e.g., Computer Science"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
        />

        <input type="file" onChange={handleFileChange} className="mb-4" />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </main>
    </div>
  );
}
