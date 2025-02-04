"use client";

import React, { Suspense, useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import SyllabusCard from "../../components/SyllabusCard";
import SearchAndFilters from "../../components/SearchAndFilters";
import NotificationBar from "../../components/NotificationBar";
import themes from "../../themes.json";

interface Course {
  name: string;
  department: string;
  course_code?: string;
  professor?: string;
  semester?: string;
}

export interface Syllabus {
  id: string;
  file_url: string;
  created_at: string;
  uploaded_by: string;
  courses?: Course;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const [universityId, setUniversityId] = useState<string | null>(null);
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);

  useEffect(() => {
    fetch("/api/university")
      .then((res) => res.json())
      .then((data) => setUniversityId(data.universityId))
      .catch((err) => console.error("Failed to fetch university", err));
  }, []);

  useEffect(() => {
    if (!universityId) return;

    fetch(`/api/syllabi`)
      .then((res) => res.json())
      .then((data) => setSyllabi(data))
      .catch((err) => console.error("Failed to fetch syllabi", err));
  }, [universityId]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar universityId={universityId ?? "default"} />
      <NotificationBar />
      <main className="container mx-auto px-4 py-8">
        {syllabi.length === 0 ? (
          <p className="text-center text-gray-500">No syllabi found.</p>
        ) : (
          <ul className="space-y-4">
            {syllabi.map((syllabus) => (
              <li key={syllabus.id}>
                <SyllabusCard syllabus={syllabus} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
