"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';
import NewUniModal from '../../../components/NewUniModal';
interface University {
  id: string;
  name: string;
  primaryColor: string;
  logo: string;
  subdomain: string;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const universities: University[] = [
    {
      id: "3884b0da-b578-4e74-b921-e2d52dee1f71",
      name: "Stony Brook University",
      primaryColor: "#990000",
      logo: "/logos/sbu.png",
      subdomain: "stonybrook"
    },
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "New York University",
      primaryColor: "#57068C",
      logo: "/logos/nyu.png",
      subdomain: "nyu"
    },
    {
      id: "ebd6ad52-dedd-4381-be9f-f16fa0686fe0",
      name: "Harvard College",
      primaryColor: "#A51C30",
      logo: "/logos/harvard.png",
      subdomain: "harvard"
    },
    {
      id: "83705fa6-af38-4e4d-9a72-6115befd90a1",
      name: "SUNY New Paltz",
      primaryColor: "#003e7d",
      logo: "/logos/newpaltz.png",
      subdomain: "newpaltz"
    },
    {
      id: "937be84f-c8df-40ea-9fc2-e4493d627206",
      name: "Suffolk County Community College",
      primaryColor: "#001489",
      logo: "/logos/sccc.png",
      subdomain: "sccc"
    }
  ].filter(uni => 
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
    <div className="min-h-screen bg-base-200">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Image 
              src="/logos/default.png"
              alt="Syllabus Website Logo"
              width={40}
              height={40}
              className="h-8 w-8"
              priority
            />
            <div className="relative">
              <svg 
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-500"
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
                className="pl-10 pr-4 py-2 rounded-full border border-gray-300
                         focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-gray-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              className="btn btn-primary text-white" 
              style={{backgroundColor: "#89CFF0", borderColor: "#89CFF0"}}
              onClick={() => (document.getElementById('new_uni_modal') as HTMLDialogElement)?.showModal()}
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Request University
            </button>
            <NewUniModal />
          </div>
        </div>
      </nav>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-24 pb-12 text-center"
      >
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Syllabus Website
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse and access syllabi from universities across the country.
        </p>
      </motion.div>

      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((university) => (
            <motion.div
              key={university.id}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md 
                       transition-all duration-300 overflow-hidden"
            >
              <div className="h-2" style={{ backgroundColor: university.primaryColor }} />
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative h-12 w-12 rounded-md" style={{ backgroundColor: university.primaryColor }}>
                      <Image 
                        src={university.logo}
                        alt={`${university.name} logo`}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                        priority
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {university.name}
                      </h3>
                    </div>
                  </div>
                  <Link
                    href={`${process.env.NODE_ENV === 'development' 
                      ? `http://${university.subdomain}.localhost:3000` 
                      : `https://${university.subdomain}.syllabus.website`}`}
                    className="btn btn-sm text-white"
                    style={{ backgroundColor: university.primaryColor }}
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