import React from 'react';

import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  // Add other Lucide icons as needed
} from 'lucide-react';


const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <img  alt="Your Logo" className="h-8 mr-4" />
          <p className="text-lg font-medium">Your Company Name</p>
        </div>
        <div className="flex space-x-4">
          <a href="/about" className="text-gray-400 hover:text-white">About Us</a>
          <a href="/features" className="text-gray-400 hover:text-white">Features</a>
          <a href="/contact" className="text-gray-400 hover:text-white">Contact</a>
          <a href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</a>
        </div>
        <div className="flex space-x-4">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
            <Github className="h-6 w-6 hover:text-red-500" />
          </a>
          <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">
            <Twitter className="h-6 w-6 hover:text-blue-400" />
          </a>
          <a href="https://www.linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-6 w-6 hover:text-blue-600" />
          </a>
          <a href="https://www.instagram.com/yourusername" target="_blank" rel="noopener noreferrer">
            <Instagram className="h-6 w-6 hover:text-pink-500" />
          </a>
          <a href="https://www.facebook.com/yourusername" target="_blank" rel="noopener noreferrer">
            <Facebook className="h-6 w-6 hover:text-blue-600" />
          </a>
        </div>
      </div>
      <div className="text-center mt-4 text-sm text-gray-400">
        © {new Date().getFullYear()} Your Company Name. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;