import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { services } from '../../data/services';
import { useQuote } from '../../context/QuoteContext';
import logo from '../../assets/logo.png';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const { openQuote } = useQuote();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services', dropdown: services },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${isScrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-lg py-3'
                    : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center h-full">
                {/* Logo & Brand */}
                <Link to="/" className="flex items-center group h-full">
                    <div className="flex items-center gap-3 h-full">
                        <img
                            src={logo}
                            alt="NativeShine Logo"
                            className={`h-10 md:h-12 w-auto transition-all duration-300 ${isScrolled ? 'brightness-100' : 'brightness-0 invert'}`}
                        />
                        <div className={`text-xl md:text-2xl font-black tracking-tight transition-colors duration-300 ${isScrolled ? 'text-secondary-dark' : 'text-white'}`}>
                            NATIVESHINE <span className="text-primary">LTD</span>
                        </div>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-10 h-full">
                    {navLinks.map((link) => (
                        <div
                            key={link.name}
                            className="relative flex items-center h-full group"
                            onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                            onMouseLeave={() => link.dropdown && setActiveDropdown(null)}
                        >
                            <Link
                                to={link.path}
                                className={`text-sm font-bold uppercase tracking-widest flex items-center transition-all duration-300 py-2 ${isScrolled ? 'text-secondary hover:text-primary' : 'text-white/90 hover:text-white'
                                    }`}
                            >
                                {link.name}
                                {link.dropdown && (
                                    <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                                )}
                            </Link>

                            {/* Dropdown Indicator */}
                            <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full`}></div>

                            {link.dropdown && (
                                <AnimatePresence>
                                    {activeDropdown === link.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute left-0 top-full mt-0 w-64 bg-white rounded-b-lg shadow-2xl py-4 border-x border-b border-slate-100 overflow-hidden"
                                        >
                                            {link.dropdown.map((item) => (
                                                <Link
                                                    key={item.id}
                                                    to={`/services/${item.slug}`}
                                                    className="block px-6 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary transition-all duration-300 font-bold"
                                                >
                                                    {item.title}
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={openQuote}
                        className={`font-black py-2.5 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md uppercase tracking-widest text-xs ${isScrolled
                                ? 'bg-primary text-white hover:bg-primary-dark outline-none'
                                : 'bg-white text-primary hover:bg-slate-100 outline-none'
                            }`}
                    >
                        Get a Quote
                    </button>
                </nav>

                {/* Mobile menu button */}
                <div className="lg:hidden flex items-center h-full">
                    <button
                        onClick={toggleMenu}
                        className={`p-2 rounded-lg transition-colors duration-300 ${isScrolled ? 'text-secondary-dark bg-slate-100' : 'text-white bg-white/10'}`}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                            className="fixed inset-0 bg-secondary-dark/60 backdrop-blur-md z-40 lg:hidden"
                        ></motion.div>
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-50 shadow-2xl lg:hidden flex flex-col p-8 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <div className="h-10 flex items-center gap-2">
                                    <img src={logo} alt="Logo" className="h-full" />
                                    <span className="font-black text-secondary-dark tracking-tighter">NATIVESHINE</span>
                                </div>
                                <button onClick={toggleMenu} className="p-2 bg-slate-100 rounded-lg text-secondary-dark"><X className="w-6 h-6" /></button>
                            </div>
                            <nav className="flex flex-col space-y-6">
                                {navLinks.map((link) => (
                                    <div key={link.name}>
                                        <Link
                                            to={link.path}
                                            onClick={toggleMenu}
                                            className="text-lg font-black text-secondary-dark hover:text-primary transition-colors duration-300 flex justify-between items-center"
                                        >
                                            {link.name}
                                        </Link>
                                        {link.dropdown && (
                                            <div className="mt-4 ml-4 flex flex-col space-y-3 border-l-2 border-slate-100 pl-4">
                                                {link.dropdown.map((item) => (
                                                    <Link
                                                        key={item.id}
                                                        to={`/services/${item.slug}`}
                                                        onClick={toggleMenu}
                                                        className="text-sm font-bold text-slate-500 hover:text-primary transition-colors duration-300"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </nav>
                            <div className="mt-auto pt-12">
                                <button
                                    onClick={() => { openQuote(); toggleMenu(); }}
                                    className="w-full bg-primary text-white font-black py-5 rounded-lg mb-8 shadow-lg hover:bg-primary-dark transition-all duration-300 text-sm uppercase tracking-widest"
                                >
                                    Get a Quote
                                </button>
                                <div className="space-y-4">
                                    <div className="flex items-center text-slate-500 text-sm font-bold">
                                        <Phone className="w-5 h-5 mr-3 text-primary" />
                                        <span>020 1234 5678</span>
                                    </div>
                                    <div className="flex items-center text-slate-500 text-sm font-bold">
                                        <Mail className="w-5 h-5 mr-3 text-primary" />
                                        <span>info@nativeshine.co.uk</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
