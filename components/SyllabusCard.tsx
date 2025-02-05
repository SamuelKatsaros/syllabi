import React from 'react';
import { useSearchParams } from 'next/navigation';
import themes from '../themes.json';

interface Course {
  name: string;
  department: string;
  course_code?: string;
  professor?: string;
  semester?: string;
}

interface Syllabus {
  id: string;
  file_url: string;
  created_at: string;
  uploaded_by: string;
  courses?: Course;
}

interface Props {
  syllabus: Syllabus;
}

export default function SyllabusCard({ syllabus }: Props) {
  const { courses, file_url } = syllabus;
  const searchParams = useSearchParams();
  const universityId = searchParams?.get('university') ?? 'default';
  const theme = themes[universityId as keyof typeof themes] || themes.default;

  return (
    <div className="card card-side bg-base-100 shadow-md rounded-md relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: theme.primaryColor }}></div>
      <div className="card-body flex-row justify-between items-center py-4">
        <div>
          <h2 className="text-lg font-bold" style={{ color: theme.primaryColor }}>
            {courses?.department && courses?.course_code 
              ? `${courses.department}: ${courses.course_code}`
              : 'Course code not available'}
          </h2>
          <p className="text-md text-black">
            {courses?.name || 'Course name not available'}
          </p>
          <p className="text-md text-black">
            {courses?.professor || 'Professor not available'}
          </p>
          <p className="text-md text-black">
            {courses?.semester || 'Semester not available'}
          </p>
        </div>
        <div className="card-actions">
          <a
            href={file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm text-white"
            style={{ backgroundColor: theme.primaryColor }}
          >
            View Syllabus
          </a>
        </div>
      </div>
    </div>
  );
}