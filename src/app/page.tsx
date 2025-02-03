'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import SyllabusCard from '../../components/SyllabusCard';
import SearchAndFilters from '../../components/SearchAndFilters';
import NotificationBar from '../../components/NotificationBar';
import themes from '../../themes.json';

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
  const searchParams = useSearchParams();
  const universityId =
    searchParams?.get('university') || '3884b0da-b578-4e74-b921-e2d52dee1f71';
  const q = searchParams?.get('q') || '';
  const theme = themes[universityId as keyof typeof themes] || themes.default;
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [department, setDepartment] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [professor, setProfessor] = useState('');
  const [semester, setSemester] = useState('');
  const [sort, setSort] = useState('latest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!universityId) return;

    let url = `/api/syllabi/${universityId}?sort=${sort}`;
    if (department) url += `&department=${encodeURIComponent(department)}`;
    if (courseCode) url += `&course_code=${encodeURIComponent(courseCode)}`;
    if (professor) url += `&professor=${encodeURIComponent(professor)}`;
    if (semester) url += `&semester=${encodeURIComponent(semester)}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setSyllabi(data || []))
      .catch((err) => console.error('Failed to fetch syllabi', err));
  }, [universityId, department, courseCode, professor, semester, sort, q]);

  const safeSyllabi = syllabi || [];
  const displayedSyllabi = safeSyllabi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const uniqueDepartments = [
    ...new Set(safeSyllabi.map((s) => s.courses?.department).filter(Boolean)),
  ];
  const uniqueCourseCodes = [
    ...new Set(safeSyllabi.map((s) => s.courses?.course_code).filter(Boolean)),
  ] as string[];
  const uniqueProfessors = [
    ...new Set(safeSyllabi.map((s) => s.courses?.professor).filter(Boolean)),
  ] as string[];
  const uniqueSemesters = [
    ...new Set(safeSyllabi.map((s) => s.courses?.semester).filter(Boolean)),
  ] as string[];

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar universityId={universityId} />
      <NotificationBar />
      <main className="container mx-auto px-4 py-8">
        <SearchAndFilters
          department={department}
          courseCode={courseCode}
          professor={professor}
          semester={semester}
          sort={sort}
          uniqueDepartments={uniqueDepartments}
          uniqueCourseCodes={uniqueCourseCodes}
          uniqueProfessors={uniqueProfessors}
          uniqueSemesters={uniqueSemesters}
          onDepartmentChange={setDepartment}
          onCourseCodeChange={setCourseCode}
          onProfessorChange={setProfessor}
          onSemesterChange={setSemester}
          onSortChange={setSort}
        />
        {displayedSyllabi.length === 0 ? (
          <p className="text-center text-gray-500">No syllabi found.</p>
        ) : (
          <ul className="space-y-4">
            {displayedSyllabi.map((syllabus) => (
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
