"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import themes from '../../../themes.json';

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
        </nav>
      </header>

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">University Directory</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {universities.map((university) => (
            <motion.div
              key={university.id}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <a 
                href={`https://${university.id.toLowerCase()}.syllabus.website`}
                className="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div 
                  className="h-2" 
                  style={{ backgroundColor: university.primaryColor }}
                />
                <div className="p-6">
                  <div className="flex items-center">
                    <Image 
                      src={university.logo}
                      alt={`${university.name} logo`}
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain"
                    />
                    <h2 className="ml-4 text-lg font-semibold text-gray-900">
                      {university.name}
                    </h2>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
} 