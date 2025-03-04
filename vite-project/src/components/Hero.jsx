import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import IMG from '../images/photo.png';

const Hero = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/image');
    } else {
      navigate('/login');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };

  return (
    <section className="relative min-h-screen py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="w-full lg:w-1/2">
          <motion.h1
            className="text-6xl font-bold text-white mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            AI-Powered Image to Text
          </motion.h1>
          <motion.p
            className="text-xl text-gray-300 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            Transform images into accurate, editable text effortlessly.
          </motion.p>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 bg-black text-white font-bold rounded-lg hover:bg-blue-700"
              onClick={handleGetStarted}
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300"
            >
              Try Demo
            </motion.button>
          </div>
        </div>
        <div className="w-full lg:w-1/2 mt-10 lg:mt-0">
          <motion.img
            src={IMG}
            alt="App Preview"
            className="w-full h-auto rounded-lg "
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 text-center text-gray-400 text-sm">
        <p>Millions of images processed | AI-powered accuracy 98%</p>
      </div>
    </section>
  );
};

export default Hero;