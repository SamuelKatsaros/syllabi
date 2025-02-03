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

  // Reset page to 1 whenever filters or search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [department, courseCode, professor, semester, sort, q]);

  const safeSyllabi = Array.isArray(syllabi) ? syllabi : [];

  // When a search query is present, continue to filter out any syllabus that
  // doesn't have a course, and then sort by relevance—i.e. courses that contain the query earlier.
  let displayedSyllabi = safeSyllabi;
  if (q) {
    displayedSyllabi = safeSyllabi.filter((syllabus) => 
      syllabus.courses &&
      typeof syllabus.courses.name === 'string' &&
      syllabus.courses.name.toLowerCase().includes(q.toLowerCase())
    );
    displayedSyllabi.sort((a, b) => {
      const aName = a.courses?.name.toLowerCase() || '';
      const bName = b.courses?.name.toLowerCase() || '';
      const aIndex = aName.indexOf(q.toLowerCase());
      const bIndex = bName.indexOf(q.toLowerCase());
      return aIndex - bIndex;
    });
  }

  const totalPages = Math.ceil(displayedSyllabi.length / itemsPerPage);
  const paginatedSyllabi = displayedSyllabi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const uniqueDepartments = [
    ...new Set(safeSyllabi.map((s) => s.courses?.department).filter(Boolean)),
  ] as string[];
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
    <Suspense fallback={<div>Loading...</div>}>
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
            <>
              <div className="flex flex-col gap-4">
                {paginatedSyllabi.map((syllabus) => (
                  <SyllabusCard key={syllabus.id} syllabus={syllabus} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <div className="join">
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNumber = index + 1;
                      const isActive = pageNumber === currentPage;
                      return (
                        <button
                          key={pageNumber}
                          className={`join-item btn ${isActive ? "btn-active" : ""}`}
                          onClick={() => setCurrentPage(pageNumber)}
                          style={
                            isActive
                              ? {
                                  backgroundColor: theme.primaryColor,
                                  color: "white",
                                  borderColor: theme.primaryColor,
                                }
                              : {
                                  backgroundColor: "white",
                                  color: theme.primaryColor,
                                  borderColor: theme.primaryColor,
                                }
                          }
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </Suspense>
  );
}
