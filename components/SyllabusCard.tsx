import React from 'react';

interface Course {
  name: string;
  department: string;
  course_code?: string;
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
  const { courses, file_url, created_at } = syllabus;
  return (
    <div className="card card-side bg-base-100 shadow-xl mb-4">
      <div className="card-body">
        <h2 className="card-title">
          {courses?.course_code && <span>{courses?.course_code} </span>}
          {courses?.name || 'Course name not available'}
        </h2>
        <p className="text-sm text-gray-600">
          {courses?.department || 'Department not available'}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(created_at).toLocaleDateString()}
        </p>
        <div className="card-actions mt-4">
          <a
            href={file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-sm"
          >
            View Syllabus
          </a>
        </div>
      </div>
    </div>
  );
}