"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import themes from "../themes.json";

interface Props {
  department: string;
  courseCode: string;
  professor: string;
  semester: string;
  sort: string;
  uniqueDepartments: string[];
  uniqueCourseCodes: string[];
  uniqueProfessors: string[];
  uniqueSemesters: string[];
  onDepartmentChange: (value: string) => void;
  onCourseCodeChange: (value: string) => void;
  onProfessorChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function SearchAndFilters({
  department,
  courseCode,
  professor,
  semester,
  sort,
  uniqueDepartments,
  uniqueCourseCodes,
  uniqueProfessors,
  uniqueSemesters,
  onDepartmentChange,
  onCourseCodeChange,
  onProfessorChange,
  onSemesterChange,
  onSortChange,
}: Props) {
  const searchParams = useSearchParams();
  const universityId = searchParams?.get("university") ?? "default";
  const theme = themes[universityId as keyof typeof themes] || themes.default;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {/* Department Dropdown */}
      <div className="dropdown dropdown-hover w-full">
        <div
          tabIndex={0}
          role="button"
          className="btn w-full bg-base-100 outline outline-1 rounded-md"
          style={{ outlineColor: theme.primaryColor }}
        >
          {department || "All Departments"}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full z-50 max-h-60 overflow-y-auto"
        >
          <li>
            <a onClick={() => onDepartmentChange("")}>All Departments</a>
          </li>
          {uniqueDepartments.map((dept) => (
            <li key={dept}>
              <a onClick={() => onDepartmentChange(dept)}>{dept}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Course Code Dropdown */}
      <div className="dropdown dropdown-hover w-full">
        <div
          tabIndex={0}
          role="button"
          className="btn w-full bg-base-100 outline outline-1 rounded-md text-black"
          style={{ outlineColor: theme.primaryColor }}
        >
          {courseCode || "All Courses"}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full text-black z-50 max-h-60 overflow-y-auto"
        >
          <li>
            <a onClick={() => onCourseCodeChange("")}>All Courses</a>
          </li>
          {uniqueCourseCodes.map((code) => (
            <li key={code}>
              <a onClick={() => onCourseCodeChange(code)}>{code}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Professor Dropdown */}
      <div className="dropdown dropdown-hover w-full">
        <div
          tabIndex={0}
          role="button"
          className="btn w-full bg-base-100 outline outline-1 rounded-md text-black"
          style={{ outlineColor: theme.primaryColor }}
        >
          {professor || "All Professors"}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full text-black z-50 max-h-60 overflow-y-auto"
        >
          <li>
            <a onClick={() => onProfessorChange("")}>All Professors</a>
          </li>
          {uniqueProfessors.map((prof) => (
            <li key={prof}>
              <a onClick={() => onProfessorChange(prof)}>{prof}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Semester Dropdown */}
      <div className="dropdown dropdown-hover w-full">
        <div
          tabIndex={0}
          role="button"
          className="btn w-full bg-base-100 outline outline-1 rounded-md text-black"
          style={{ outlineColor: theme.primaryColor }}
        >
          {semester || "All Semesters"}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full text-black z-50 max-h-60 overflow-y-auto"
        >
          <li>
            <a onClick={() => onSemesterChange("")}>All Semesters</a>
          </li>
          {uniqueSemesters.map((sem) => (
            <li key={sem}>
              <a onClick={() => onSemesterChange(sem)}>{sem}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Sorting Dropdown */}
      <div className="dropdown dropdown-hover w-full">
        <div
          tabIndex={0}
          role="button"
          className="btn w-full bg-base-100 outline outline-1 rounded-md text-black"
          style={{ outlineColor: theme.primaryColor }}
        >
          {sort === "latest" ? "Latest" : "Alphabetical"}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-full text-black z-50"
        >
          <li>
            <a onClick={() => onSortChange("latest")}>Latest</a>
          </li>
          <li>
            <a onClick={() => onSortChange("alphabetical")}>Alphabetical</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
