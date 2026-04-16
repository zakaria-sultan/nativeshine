import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";

import { servicesData } from "../../data/servicesData";

const Header = ({ onOpenQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  }, [location]);

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
        const el = document.querySelector(link.hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else if (link.name === "Home") {
        navigate("/");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    if (!link.dropdown) setIsMobileMenuOpen(false);
  };

  const getDesktopLinkClass = (isActive) =>
    `text-xs font-black uppercase tracking-[0.2em] transition-all px-4 py-2.5 rounded-md whitespace-nowrap flex items-center gap-1 ${isActive
      ? "bg-[#0ea5e9] text-white shadow-md shadow-cyan-500/20"
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;

  const getMobileLinkClass = (isActive) =>
    `block w-full text-left text-xs font-black uppercase tracking-[0.2em] transition-all px-6 py-4 border-b border-slate-50 ${isActive
      ? "bg-[#0ea5e9] text-white"
      : "text-slate-700 hover:bg-slate-50 hover:text-[#0ea5e9]"
    }`;

  return (
    <>
      {/* ── HEADER BAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-slate-100 ${isScrolled ? "bg-white shadow-md py-3" : "bg-white/96 py-4"
          }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 group flex-shrink-0">
            <div className="h-16 w-16 aspect-square rounded-full overflow-hidden border-2 border-slate-100 shadow-sm flex-shrink-0 transition-transform group-hover:scale-105">
              <img
                src="/logo.jpeg"
                alt="NativeShine"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="border-l-2 border-slate-100 pl-4 flex flex-col justify-center">
              <span className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                NativeShine <span className="text-[#0ea5e9]">LTD</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
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
                    return getDesktopLinkClass(isActive && isHashMatch);
                  }}
                >
                  {link.name}
                  {link.dropdown && (
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </NavLink>

                {/* Desktop Dropdown */}
                {link.dropdown && (
                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 w-72 bg-white shadow-2xl border border-slate-100 mt-1 z-[60] rounded-sm overflow-hidden"
                      >
                        {servicesData.map((service) => (
                          <Link
                            key={service.slug}
                            to={`/services/${service.slug}`}
                            className="block px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-[#0ea5e9] hover:text-white transition-all duration-150 border-b border-slate-50 last:border-0"
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
          </nav>

          {/* Desktop CTA */}
          <button
            onClick={onOpenQuote}
            className="hidden md:block bg-[#0ea5e9] text-white px-7 py-3 rounded-md font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-cyan-500/10 active:scale-95 flex-shrink-0"
          >
            Get a Quote
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen((p) => !p)}
            className="md:hidden p-2 text-slate-700 hover:text-[#0ea5e9] transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.28 }}
              className="fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl md:hidden flex flex-col"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-slate-100 flex-shrink-0">
                    <img src="/logo.jpeg" alt="NativeShine" className="h-full w-full object-cover" />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tighter text-slate-900">
                    NativeShine <span className="text-[#0ea5e9]">LTD</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Nav Links */}
              <nav className="flex-1 overflow-y-auto">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.dropdown ? (
                      <>
                        <button
                          onClick={() => setIsMobileServicesOpen((p) => !p)}
                          className="w-full flex items-center justify-between text-xs font-black uppercase tracking-[0.2em] text-slate-700 hover:bg-slate-50 hover:text-[#0ea5e9] px-6 py-4 transition-all border-b border-slate-50"
                        >
                          {link.name}
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 ${isMobileServicesOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence>
                          {isMobileServicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-slate-50"
                            >
                              {servicesData.map((service) => (
                                <Link
                                  key={service.slug}
                                  to={`/services/${service.slug}`}
                                  className="block pl-10 pr-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#0ea5e9] hover:bg-white transition-all border-b border-slate-100 last:border-0"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  {service.title}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <NavLink
                        to={link.path + (link.hash || "")}
                        onClick={(e) => handleNavClick(e, link)}
                        end={link.path === "/"}
                        className={({ isActive }) => {
                          const isHashMatch = link.hash
                            ? location.hash === link.hash
                            : !location.hash;
                          return getMobileLinkClass(isActive && isHashMatch);
                        }}
                      >
                        {link.name}
                      </NavLink>
                    )}
                  </div>
                ))}
              </nav>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-slate-100">
                <button
                  onClick={() => { onOpenQuote(); setIsMobileMenuOpen(false); }}
                  className="w-full bg-[#0ea5e9] text-white py-3.5 rounded-md font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-cyan-500/10"
                >
                  Get a Quote
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
