import { useEffect, useState } from "react";

interface Course {
  id: string;
  name: string;
  department: string;
}

interface Syllabus {
  id: string;
  file_url: string;
  created_at: string;
  uploaded_by: string;
  university_id: string;
  courses?: Course | null; // Ensure this matches the API response
}

export default function Home() {
  const universityId = "3884b0da-b578-4e74-b921-e2d52dee1f71";
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSyllabi = async () => {
      try {
        const response = await fetch(`/api/syllabi/${universityId}`);
        const data = await response.json();
        console.log("📢 API Response:", data); // Debugging
        setSyllabi(data);
      } catch (error) {
        console.error("Error fetching syllabi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabi();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">📄 University Syllabi</h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading syllabi...</p>
      ) : (
        <ul className="space-y-4">
          {syllabi.map((syllabus) => (
            <li key={syllabus.id} className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-lg font-semibold">
                📚 {syllabus.courses?.name ?? "Unknown Course"}
              </p>
              <p className="text-gray-500">
                🗂 {syllabus.courses?.department ?? "Unknown Department"}
              </p>
              <p className="text-gray-500">
                📅 {new Date(syllabus.created_at).toLocaleDateString()}
              </p>
              <a
                href={syllabus.file_url}
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                View Syllabus
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
