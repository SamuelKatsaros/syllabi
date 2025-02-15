"use client";

import React, { useState, useEffect } from 'react';
import themes from '../../../themes.json';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface University {
  id: string;
  name: string;
  primaryColor: string;
  logo: string;
  syllabusCount?: number;
}

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const universities: University[] = Object.entries(themes)
    .map(([id, data]) => ({
      id,
      name: data.name,
      primaryColor: data.primaryColor,
      logo: data.logo,
      syllabusCount: Math.floor(Math.random() * 100) + 20,
    }))
    .filter(uni => uni.id !== 'default' && uni.id !== 'home')
    .filter(uni => 
      uni.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Image 
              src="/logos/default.png"
              alt="Syllabus Website Logo"
              width={40}
              height={40}
              className="h-8 w-8"
            />
            <div className="relative">
              <svg 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search universities..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white/90 dark:bg-gray-800/90"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="btn btn-ghost btn-circle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <button className="btn btn-primary">
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload Syllabus
            </button>
          </div>
        </div>
      </nav>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-24 pb-12 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 dark:text-white">
          Syllabus Website
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Browse and access syllabi from universities across the country.
        </p>
      </motion.div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((university) => (
            <motion.div
              key={university.id}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md 
                       transition-all duration-300 overflow-hidden"
            >
              <div className="h-2" style={{ backgroundColor: university.primaryColor }} />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Image 
                      src={university.logo}
                      alt={`${university.name} logo`}
                      width={48}
                      height={48}
                      className="h-12 w-12 object-contain rounded-full bg-gray-50 p-1"
                    />
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold dark:text-white">
                        {university.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {university.syllabusCount} syllabi available
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`${process.env.NODE_ENV === 'development' 
                      ? `http://${university.id.toLowerCase()}.localhost:3000` 
                      : `https://${university.id.toLowerCase()}.syllabus.website`}`}
                    className="btn btn-sm btn-primary"
                  >
                    Visit
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 