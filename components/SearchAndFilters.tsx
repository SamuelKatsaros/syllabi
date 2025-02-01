import React from 'react';

interface Props {
  department: string;
  courseCode: string;
  sort: string;
  uniqueDepartments: string[];
  uniqueCourseCodes: string[];
  onDepartmentChange: (value: string) => void;
  onCourseCodeChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function SearchAndFilters({
  department,
  courseCode,
  sort,
  uniqueDepartments,
  uniqueCourseCodes,
  onDepartmentChange,
  onCourseCodeChange,
  onSortChange
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <select
        value={department}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
      >
        <option value="">All Departments</option>
        {uniqueDepartments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      <select
        value={courseCode}
        onChange={(e) => onCourseCodeChange(e.target.value)}
        className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
      >
        <option value="">All Courses</option>
        {uniqueCourseCodes.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
      >
        <option value="latest">Latest</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  );
} 