import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ServicePageTemplate from './pages/ServicePageTemplate';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/services" element={<HomePage />} />
          <Route path="/services/:slug" element={<ServicePageTemplate />} />
          <Route path="*" element={<div className="py-40 text-center text-4xl font-black text-[#00AEEF] uppercase tracking-tighter">404: Page Not Found</div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
