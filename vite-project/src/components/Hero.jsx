import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen ">
      <h1 className="text-5xl font-bold text-white mb-4">
        Investments/Cypris Finance
      </h1>
      <p className="text-xl text-white mb-8 text-center">
        Innovative Crypto Financial Solutions For Any Investment Challenge
      </p>
      <p className="text-lg text-white mb-8 text-center">
        We Bank Just Focus On Investments. We Cover Your Estate Financial
        Songvision, From Resigning To Statements.
      </p>
      <div className="flex space-x-4">
        <button  className=" px-4 py-2 rounded border-[3px] border-white font-bold text-white">
          <Link to="/image">Get Started</Link>
        </button>
      
      </div>
      <p className="text-sm text-gray-500 mt-8 text-center">
        We Use Cookies And Other Technology to Provide You With Our Services Part for Functional
        Decline Except Accepted and Advertising purposes. Please Read Our Privacy Policy for More Information
      </p>
    </div>
  );
};

export default Hero;