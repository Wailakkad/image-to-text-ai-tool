import React from 'react';
import { motion } from 'framer-motion';
import ai from '../images/artificial-intelligence.png';
import multilingual from '../images/foreign-language.png';
import seo from '../images/seo.png';
import ecommerce from '../images/shopping.png';
import bulk from '../images/bulk-buying.png';
import customize from '../images/customize.png';
import fast from '../images/arrows.png';

const features = [
  {
    icon: ai,
    title: 'AI-Powered Accuracy',
    description: 'Generates precise text from images using cutting-edge NLP.'
  },
  {
    icon: multilingual,
    title: 'Multilingual Support',
    description: 'Supports multiple languages for global reach.'
  },
  {
    icon: seo,
    title: 'SEO-Optimized Descriptions',
    description: 'AI-crafted text designed to improve search rankings.'
  },
  {
    icon: ecommerce,
    title: 'E-Commerce Ready',
    description: 'Generates product descriptions for online stores (e.g., Shopify, Amazon).'
  },
  {
    icon: bulk,
    title: 'Bulk Processing',
    description: 'Upload multiple images and process them simultaneously.'
  },
  {
    icon: customize,
    title: 'Customization Options',
    description: 'Users can refine AI-generated text to match their brand voice.'
  },
  {
    icon: fast,
    title: 'Fast & Secure',
    description: 'Lightning-fast processing with end-to-end encryption for privacy.'
  }
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };

  return (
    <section className=" py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <motion.h2
          className="text-4xl font-bold mb-6 text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          AI-Powered Features to Elevate Your Workflow
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="bg-gray-700 p-6 rounded-2xl shadow-lg border border-gray-600"  
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center mb-4">
                <img src={feature.icon} alt={feature.title} className="w-10 h-10 mr-4" /> {/* Display icons */}
                <h3 className="text-xl font-bold">{feature.title}</h3>
              </div>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;