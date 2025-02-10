import React from 'react';
import themes from '../../themes.json';
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

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6 py-24 text-center relative z-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Your Academic Journey Starts Here
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Access and share course syllabi from leading universities. Making education more transparent and accessible for everyone.
          </p>
          <motion.a 
            href="#universities"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300 inline-block"
          >
            Explore Universities
          </motion.a>
        </motion.div>

        {/* Abstract background shapes */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-white"></div>
        </div>
      </header>

      {/* Universities Grid */}
      <section id="universities" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Participating Universities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {universities.map((university) => (
              <motion.div
                key={university.id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <a 
                  href={`http://${university.id.toLowerCase()}.syllabus.website`}
                  className="block"
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
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rest of the sections remain the same */}
      {/* Reference lines 134-195 from src/pages/index.tsx */}
    </div>
  );
} 