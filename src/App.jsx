import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ServiceDetail from './pages/ServiceDetail';
import QuoteModal from './components/ui/QuoteModal';

const Services = () => (
  <div className="w-full py-32 container mx-auto px-6 text-center">
    <h1 className="text-6xl font-black text-primary mb-12 uppercase tracking-tighter">Our Specialist Services</h1>
    <p className="text-2xl text-slate-500 mb-20 max-w-3xl mx-auto font-light">Explore our range of professional cleaning and restoration solutions.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact-us" element={<Contact />} />
          <Route path="*" element={<div className="py-40 text-center text-4xl font-black text-primary">404: Page Not Found</div>} />
        </Routes>
      </Layout>
      <QuoteModal />
    </Router>
  );
}

export default App;
