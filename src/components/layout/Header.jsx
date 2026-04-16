import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { servicesData } from "../../data/servicesData";

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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/", hash: "#top" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/", hash: "#services", dropdown: true },
    { name: "Contact", path: "/contact" },
  ];

  const handleNavClick = (e, link) => {
    if (link.hash) {
      if (location.pathname === "/") {
        e.preventDefault();
        const element = document.querySelector(link.hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // If not on home, navigating to / + hash will work if we have smooth scroll in CSS
        // But specifically for 'Home' we might want to just go to /
        if (link.name === "Home") {
          navigate("/");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  const getLinkClass = (isActive) =>
    `text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] transition-all px-3 py-2 sm:px-4 rounded-md ${isActive ? "bg-[#f97316] text-white shadow-md shadow-orange-500/20" : "text-slate-600 hover:text-[#000]"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-slate-100 ${isScrolled ? "bg-white shadow-sm py-2" : "bg-white/95 py-3 md:py-4"
        }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 md:gap-4 group">
          <div className="h-10 w-10 md:h-16 md:w-16 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm transition-transform group-hover:scale-105 flex-shrink-0">
            <img
              src="/logo.jpeg"
              alt="NativeShine"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center border-l-2 border-slate-100 pl-2 md:pl-4 py-1">
            <span className="text-sm md:text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              NativeShine <span className="text-[#0ea5e9]">LTD</span>
            </span>
          </div>
        </Link>

        {/* Navigation - Always visible but adapted for mobile */}
        <nav className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <div className="flex items-center gap-1 sm:gap-3">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative group py-2"
                onMouseEnter={() => link.dropdown && setIsServicesOpen(true)}
                onMouseLeave={() => link.dropdown && setIsServicesOpen(false)}
              >
                <NavLink
                  to={link.path + (link.hash || "")}
                  onClick={(e) => handleNavClick(e, link)}
                  end={link.path === "/"}
                  className={({ isActive }) => {
                    const isHashMatch = link.hash
                      ? location.hash === link.hash
                      : !location.hash;
                    const trulyActive = isActive && isHashMatch;
                    return getLinkClass(trulyActive);
                  }}
                >
                  {link.name}
                </NavLink>

                {/* Dropdown Menu (Desktop focus, but works if clicked) */}
                {link.dropdown && (
                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 w-80 bg-white shadow-2xl border border-slate-100 mt-2 py-0 z-[60] hidden lg:block"
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
          </div>

          <button
            onClick={onOpenQuote}
            className="bg-[#0ea5e9] text-white px-3 py-2 sm:px-6 sm:py-3 rounded-md font-black text-[9px] sm:text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-cyan-500/10 active:scale-95 ml-1 sm:ml-2"
          >
            <span className="hidden xs:inline">Get a Quote</span>
            <span className="xs:hidden">Quote</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
