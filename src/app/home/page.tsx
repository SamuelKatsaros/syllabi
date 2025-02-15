"use client";

import React, { useState, useEffect } from 'react';
import themes from '../../../themes.json';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Upload, Moon, Sun } from 'lucide-react';

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

  // Filter universities and add mock syllabus count
  const universities: University[] = Object.entries(themes)
    .map(([id, data]) => ({
      id,
      name: data.name,
      primaryColor: data.primaryColor,
      logo: data.logo,
      syllabusCount: Math.floor(Math.random() * 100) + 20, // Mock data
    }))
    .filter(uni => uni.id !== 'default' && uni.id !== 'home')
    .filter(uni => 
      uni.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sticky Navigation */}
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
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button className="btn btn-primary">
              <Upload className="h-4 w-4 mr-2" />
              Upload Syllabus
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-24 pb-12 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 dark:text-white">
          University Directory
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Browse and access syllabi from leading universities across the country.
        </p>
      </motion.div>

      {/* University Grid */}
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
                  <a
                    href={`${window.location.protocol}//${university.id.toLowerCase()}${
                      window.location.host.includes('localhost') ? '.localhost:3000' : '.syllabus.website'
                    }`}
                    className="btn btn-sm btn-primary"
                  >
                    Visit
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 