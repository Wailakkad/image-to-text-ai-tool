import React from 'react';
import Hero from './hero';
import About from './About';
import Features from './Features';
const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center overflow-hidden gap-8   p-2">
      <Hero />
      <About/>
      <Features/>
    </div>
  );
};

export default Home;