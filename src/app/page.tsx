'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/Navbar';
import SyllabusCard from '../../components/SyllabusCard';
import SearchAndFilters from '../../components/SearchAndFilters'; // ✅ Ensure this is actually used
import NotificationBar from '../../components/NotificationBar';
import themes from '../../themes.json'; // ✅ Ensure this is actually used
import { subdomainToUniversityId } from '@/utils/universityMappings';
import { pageview } from '@/utils/analytics';

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
  const host = typeof window !== "undefined" ? window.location.host : "";
  const subdomain = host.split(".")[0];
  
  const universityId = subdomainToUniversityId(subdomain) || searchParams?.get('university') || 'default';
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

  const theme = themes[universityId as keyof typeof themes] || themes.default; // ✅ Ensure usage

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
        // Ensure data is always an array
        setSyllabi(Array.isArray(data) ? data : []);
        setCurrentPage(1); // Reset pagination when new data is fetched
      })
      .catch((err) => {
        console.error("Failed to fetch syllabi", err);
        setSyllabi([]); // Default to empty array if fetch fails
      });
  }, [universityId, department, courseCode, professor, semester, sort, q]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.host;
      const subdomain = host.split('.')[0];
      pageview(window.location.pathname + window.location.search, subdomain);
    }
  }, []);

  const safeSyllabi = syllabi || [];

  // Ensure each syllabus has course info when filters are active
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
              <button
                className="join-item btn"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                style={{
                  backgroundColor: currentPage === 1 ? theme.primaryColor : 'white',
                  color: currentPage === 1 ? 'white' : theme.primaryColor,
                  borderColor: theme.primaryColor
                }}
              >
                1
              </button>
              
              {currentPage > 3 && <span className="join-item btn">...</span>}
              
              {currentPage > 2 && (
                <button
                  className="join-item btn"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  style={{
                    backgroundColor: 'white',
                    color: theme.primaryColor,
                    borderColor: theme.primaryColor
                  }}
                >
                  {currentPage - 1}
                </button>
              )}
              
              {currentPage !== 1 && currentPage !== totalPages && (
                <button
                  className="join-item btn btn-active"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: 'white',
                    borderColor: theme.primaryColor
                  }}
                >
                  {currentPage}
                </button>
              )}
              
              {currentPage < totalPages - 1 && (
                <button
                  className="join-item btn"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  style={{
                    backgroundColor: 'white',
                    color: theme.primaryColor,
                    borderColor: theme.primaryColor
                  }}
                >
                  {currentPage + 1}
                </button>
              )}
              
              {currentPage < totalPages - 2 && <span className="join-item btn">...</span>}
              
              {currentPage !== totalPages && (
                <button
                  className="join-item btn"
                  onClick={() => setCurrentPage(totalPages)}
                  style={{
                    backgroundColor: currentPage === totalPages ? theme.primaryColor : 'white',
                    color: currentPage === totalPages ? 'white' : theme.primaryColor,
                    borderColor: theme.primaryColor
                  }}
                >
                  {totalPages}
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
