import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="text-white flex items-center justify-between p-4 w-full">
      <div className="text-xl font-bold">
        <Link to="/">Benter</Link>
      </div>
      <ul className="flex space-x-6">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/ressources">Resource</Link></li>
        <li><Link to="/faq">FAQ</Link></li>
        <li><Link to="/protection">Protection</Link></li>
      </ul>
      <div className="flex space-x-4">
        <Link to="/ressources" className="bg-white px-4 py-2 text-black rounded">Try Now</Link>
      </div>
    </nav>
  );
};

export default Navbar;