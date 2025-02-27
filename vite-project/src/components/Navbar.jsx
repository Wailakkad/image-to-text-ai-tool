import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between p-4  text-white flex items-center justify-between p-4  text-white w-full">
      <div className="text-xl font-bold">
        <Link to="/">Benter</Link>
      </div>
      <ul className="flex space-x-6">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/resource">Resource</Link></li>
        <li><Link to="/deli-app">Deli App</Link></li>
        <li><Link to="/assets">Assets</Link></li>
        <li><Link to="/pricing">Pricing</Link></li>
        <li><Link to="/faq">FAQ</Link></li>
        <li><Link to="/protection">Protection</Link></li>
      </ul>
      <div className="flex space-x-4">
        <Link to="/signup" className="bg-white px-4 py-2 text-black rounded">Sign Up</Link>
        <Link to="/login" className=" px-4 py-2 rounded border-[3px] border-white">Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;