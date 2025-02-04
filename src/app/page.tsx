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
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [department, setDepartment] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [professor, setProfessor] = useState('');
  const [semester, setSemester] = useState('');
  const [sort, setSort] = useState('latest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const theme = themes[universityId as keyof typeof themes] || themes.default;

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
      .then((data) => {
        setSyllabi(data || []);
        setCurrentPage(1); // reset pagination when new data is fetched
      })
      .catch((err) => console.error('Failed to fetch syllabi', err));
  }, [universityId, department, courseCode, professor, semester, sort, q]);

  const safeSyllabi = syllabi || [];

  // When filtering/search is active, ensure each syllabus has course info.
  const filtersActive = department || courseCode || professor || semester || q;
  const filteredSyllabi = filtersActive
    ? safeSyllabi.filter((s) => s.courses != null)
    : safeSyllabi;

  const totalPages = Math.ceil(filteredSyllabi.length / itemsPerPage);

  const displayedSyllabi = filteredSyllabi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Compute unique filter values based on the course properties
  const uniqueDepartments = [
    ...new Set(
      filteredSyllabi
        .map((s) => s.courses?.department)
        .filter((d): d is string => Boolean(d))
    ),
  ];
  const uniqueCourseCodes = [
    ...new Set(
      filteredSyllabi
        .map((s) => s.courses?.course_code)
        .filter((c): c is string => Boolean(c))
    ),
  ];
  const uniqueProfessors = [
    ...new Set(
      filteredSyllabi
        .map((s) => s.courses?.professor)
        .filter((p): p is string => Boolean(p))
    ),
  ];
  const uniqueSemesters = [
    ...new Set(
      filteredSyllabi
        .map((s) => s.courses?.semester)
        .filter((s): s is string => Boolean(s))
    ),
  ];

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

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <div className="join">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`join-item btn ${
                    currentPage === i + 1 ? "btn-active" : ""
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    backgroundColor: currentPage === i + 1 ? theme.primaryColor : 'white',
                    color: currentPage === i + 1 ? 'white' : theme.primaryColor,
                    borderColor: theme.primaryColor
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
