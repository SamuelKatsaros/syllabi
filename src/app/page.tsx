'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface Syllabus {
  id: string;
  file_url: string;
  created_at: string;
  uploaded_by: string;
  courses: {
    name: string;
    department: string;
    course_code?: string;
  };
}

export default function Home() {
  const searchParams = useSearchParams();
  const universityId = searchParams?.get('university') || '3884b0da-b578-4e74-b921-e2d52dee1f71'; // Default to Harvard
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [department, setDepartment] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    if (!universityId) return;
    
    let url = `/api/syllabi/${universityId}?sort=${sort}`;
    if (department) url += `&department=${department}`;
    if (courseCode) url += `&course_code=${courseCode}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setSyllabi(data || []))
      .catch((err) => console.error("Failed to fetch syllabi", err));
  }, [universityId, department, courseCode, sort]);

  // Prevent the error by ensuring syllabi is always an array
  const safeSyllabi = Array.isArray(syllabi) ? syllabi : [];

  // Get unique departments from syllabi
  const uniqueDepartments = [...new Set(safeSyllabi
    .filter((s) => s?.courses?.department)
    .map((s) => s.courses.department)
  )];

  // Get unique course codes from syllabi
  const uniqueCourseCodes = [...new Set(safeSyllabi
    .filter((s) => s?.courses?.course_code)
    .map((s) => s.courses.course_code!)
  )];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">📄 University Syllabi</h1>
        <a 
          href={`/upload?university=${universityId}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Upload Syllabus
        </a>
      </div>

      {/* Filtering & Sorting Options */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select 
          value={department} 
          onChange={(e) => setDepartment(e.target.value)} 
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
        >
          <option value="">All Departments</option>
          {uniqueDepartments.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <select 
          value={courseCode} 
          onChange={(e) => setCourseCode(e.target.value)} 
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
        >
          <option value="">All Courses</option>
          {uniqueCourseCodes.map((code) => (
            <option key={code} value={code}>{code}</option>
          ))}
        </select>

        <select 
          value={sort} 
          onChange={(e) => setSort(e.target.value)} 
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
        >
          <option value="latest">Latest</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      {/* Display Syllabi */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeSyllabi.map((syllabus) => (
          <div key={syllabus.id} className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-lg font-semibold">
              📚 {syllabus.courses?.name || "Course name not available"}
            </p>
            <p className="text-gray-500">
              🗂 {syllabus.courses?.department || "Department not available"}
            </p>
            <p className="text-gray-500">
              📅 {new Date(syllabus.created_at).toLocaleDateString()}
            </p>
            <a 
              href={syllabus.file_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View Syllabus
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
