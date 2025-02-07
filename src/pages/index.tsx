'use client';

import React from 'react';
import themes from '../../themes.json';
import Link from 'next/link';
import Image from 'next/image';

interface University {
  id: string;
  name: string;
  primaryColor: string;
  logo: string;
}

export default function HomePage() {
  const universities: University[] = Object.entries(themes).map(([id, data]) => ({
    id,
    name: data.name,
    primaryColor: data.primaryColor,
    logo: data.logo,
  })).filter(uni => uni.id !== 'default');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 to-blue-700 text-white">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
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
            <a href="#about" className="hover:text-blue-200">About</a>
            <a href="#universities" className="hover:text-blue-200">Universities</a>
          </div>
        </nav>
        
        <div className="container mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Your Syllabus, Your Future
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Access and share course syllabi from top universities. Making education more transparent and accessible.
          </p>
          <a 
            href="#universities"
            className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
          >
            Explore Universities
          </a>
        </div>
      </header>

      {/* Universities Grid */}
      <section id="universities" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Participating Universities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {universities.map((university) => (
              <Link 
                key={university.id}
                href={`/?university=${university.id}`}
                className="transform hover:scale-105 transition duration-300"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div 
                    className="h-2" 
                    style={{ backgroundColor: university.primaryColor }}
                  />
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <Image 
                        src={university.logo}
                        alt={`${university.name} logo`}
                        width={48}
                        height={48}
                        className="h-12 w-12 object-contain"
                      />
                      <h3 
                        className="ml-4 text-xl font-semibold"
                        style={{ color: university.primaryColor }}
                      >
                        {university.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">About Syllabus Website</h2>
            <div className="prose lg:prose-lg mx-auto">
              <p className="text-gray-600 mb-6">
                Syllabus Website is a platform dedicated to making course information more accessible to students. 
                We believe that transparent access to course syllabi helps students make informed decisions about 
                their education and academic journey.
              </p>
              <p className="text-gray-600 mb-6">
                Our mission is to create a centralized repository of course syllabi from leading universities, 
                making it easier for students to plan their academic careers and understand course expectations 
                before enrollment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Syllabus Website</h3>
              <p className="text-gray-400">
                Making education transparent and accessible.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#universities" className="text-gray-400 hover:text-white">Universities</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Syllabus Website. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
