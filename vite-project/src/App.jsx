import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ImageGenerator from './pages/ImageGenerator';
import LoginPage from "./pages/LoginPage";
import RegisterPage from './pages/RegisterPage';
import Bulkpage from './pages/Bulkpage';
import Resources from './components/Ressources';
import TextToImage from './pages/TextToImage';
import HashtagGenerator from './pages/Hastags';
import './App.css';


function App() {
  
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/image' element={<ImageGenerator/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<RegisterPage/>}/>
        <Route path='/bulk' element={<Bulkpage/>}/>
        <Route path='/ressources' element={<Resources/>}/>
        <Route path='/imageGenerator' element={<TextToImage/>}/>
        <Route path='/hastags' element={<HashtagGenerator/>}/>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;