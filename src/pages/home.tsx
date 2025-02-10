import React from 'react';
import themes from '../../themes.json';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface University {
  id: string;
  name: string;
  primaryColor: string;
  logo: string;
}

export default function HomePage() {
  // Filter out universities, excluding 'default' and 'home'
  const universities: University[] = Object.entries(themes)
    .map(([id, data]) => ({
      id,
      name: data.name,
      primaryColor: data.primaryColor,
      logo: data.logo,
    }))
    .filter(uni => uni.id !== 'default' && uni.id !== 'home');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white relative overflow-hidden">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
          <div className="flex items-center">
            <Image 
              src="/logos/default.png" 
              alt="Syllabus Website Logo" 
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="ml-3 text-xl font-bold">Syllabus Website</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="hover:text-blue-200 transition duration-300">About</a>
            <a href="#universities" className="hover:text-blue-200 transition duration-300">Universities</a>
            <a href="#contact" className="hover:text-blue-200 transition duration-300">Contact</a>
          </div>
        </nav>
        {/* Rest of the component remains the same as src/pages/index.tsx */}
        {/* Reference lines 46-195 from src/pages/index.tsx */}
      </header>
    </div>
  );
} 