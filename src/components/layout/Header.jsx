import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

import { servicesData } from '../../data/servicesData';

const Header = ({ onOpenQuote }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', hash: '#top' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/', hash: '#services', dropdown: true },
        { name: 'Contact', path: '/contact' }
    ];

    const handleNavClick = (e, link) => {
        if (link.hash) {
            if (location.pathname === '/') {
                e.preventDefault();
                const element = document.querySelector(link.hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // If not on home, navigating to / + hash will work if we have smooth scroll in CSS
                // But specifically for 'Home' we might want to just go to /
                if (link.name === 'Home') {
                    navigate('/');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        }
        setIsMobileMenuOpen(false);
    };

    const getLinkClass = (isActive) =>
        `text-[11px] font-black uppercase tracking-[0.2em] transition-all px-4 py-2 rounded-md ${isActive
            ? 'bg-[#0ea5e9] text-white'
            : 'text-slate-600 hover:text-[#000]'
        }`;

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 py-4'}`}>
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-4 group">
                    <img src="/logo.png" alt="NativeShine" className="h-16 w-auto transition-transform group-hover:scale-105" />
                    <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase border-l-2 border-slate-100 pl-4 py-1">
                        NativeShine <span className="text-[#0ea5e9]">LTD</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            className="relative group py-2"
                            onMouseEnter={() => link.dropdown && setIsServicesOpen(true)}
                            onMouseLeave={() => link.dropdown && setIsServicesOpen(false)}
                        >
                            <NavLink
                                to={link.path + (link.hash || '')}
                                onClick={(e) => handleNavClick(e, link)}
                                end={link.path === '/'}
                                className={({ isActive }) => {
                                    // For Home and Services which share the same path but have different hashes
                                    const isHashMatch = link.hash ? location.hash === link.hash : !location.hash;
                                    const trulyActive = isActive && isHashMatch;
                                    return getLinkClass(trulyActive);
                                }}
                            >
                                {link.name}
                            </NavLink>

                            {/* Dropdown Menu */}
                            {link.dropdown && (
                                <AnimatePresence>
                                    {isServicesOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 w-80 bg-white shadow-2xl border border-slate-100 mt-2 py-0 z-[60]"
                                        >
                                            {servicesData.map((service) => (
                                                <Link
                                                    key={service.slug}
                                                    to={`/services/${service.slug}`}
                                                    className="block px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-[#0ea5e9] hover:text-white transition-all duration-200 border-b border-slate-50 last:border-0"
                                                    onClick={() => setIsServicesOpen(false)}
                                                >
                                                    {service.title}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={onOpenQuote}
                        className="bg-[#0ea5e9] text-white px-8 py-3 rounded-md font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 ml-4"
                    >
                        Get a Quote
                    </button>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="lg:hidden p-2 text-slate-900"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-white border-t border-slate-100 p-6 lg:hidden shadow-xl"
                    >
                        <nav className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path + (link.hash || '')}
                                    onClick={(e) => handleNavClick(e, link)}
                                    end={link.path === '/'}
                                    className={({ isActive }) => {
                                        const isHashMatch = link.hash ? location.hash === link.hash : !location.hash;
                                        const trulyActive = isActive && isHashMatch;
                                        return `text-sm font-black uppercase tracking-widest p-4 rounded-md transition-all ${trulyActive
                                                ? 'bg-[#0ea5e9] text-white shadow-lg'
                                                : 'text-slate-900 hover:text-[#000]'
                                            }`;
                                    }}
                                >
                                    {link.name}
                                </NavLink>
                            ))}
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    onOpenQuote();
                                }}
                                className="bg-[#0ea5e9] text-white py-4 text-center font-black uppercase tracking-widest text-xs rounded-md shadow-lg shadow-cyan-500/20 mt-2"
                            >
                                Get a Quote
                            </button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
