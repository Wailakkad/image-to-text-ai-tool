import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Import Link for navigation


const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };

  return (
    <section className="bg-white py-20"> {/* Changed background to white */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl font-bold mb-6 text-center text-gray-800" 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          Revolutionizing Image-to-Text with AI
        </motion.h2>
        <motion.p
          className="text-lg mb-8 text-center text-gray-600" 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          Our SaaS platform leverages advanced AI models to transform images into highly accurate text descriptions in seconds.  Simply upload an image, and our AI will handle the rest, benefiting content creators, businesses, e-commerce sellers, and digital marketers alike.
        </motion.p>
        <div className="flex justify-center"> {/* Center the buttons */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 mr-4"
          >
            <Link to="/image">Try it Now</Link> {/* Call to action button */}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-4 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300"
          >
            Learn More
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default About;
