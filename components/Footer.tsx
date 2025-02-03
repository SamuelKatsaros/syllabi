import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
      <footer className="text-center p-4 bg-gray-200 mt-10">
        <p>© {new Date().getFullYear()} Syllabus Website | Built for Students</p>
        <Link href="/" className="text-blue-500 hover:underline">
          Home
        </Link>
      </footer>
    );
  }
  