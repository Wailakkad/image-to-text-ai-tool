import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import ImageGenerator from './pages/ImageGenerator';
import './App.css';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/image' element={<ImageGenerator/>}/>
      </Routes>
    </Router>
  );
}

export default App;