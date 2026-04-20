import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { servicesData } from "../../data/servicesData";

const Header = ({ onOpenQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsServicesOpen(false);
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
  };

  const getDesktopLinkClass = (isActive) =>
    `text-[11px] font-black uppercase tracking-[0.12em] transition-all px-3 py-2.5 rounded-md whitespace-nowrap flex items-center gap-0.5 shrink-0 ${isActive
      ? "bg-[#0ea5e9] text-white shadow-md shadow-cyan-500/20"
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-24 flex items-center border-b border-slate-100 bg-white transition-all duration-300 ${isScrolled ? "shadow-md" : ""
        }`}
    >
      <div className="container mx-auto max-w-[1280px] w-full h-full px-6 sm:px-8 flex flex-row flex-nowrap items-center justify-between gap-4 min-w-0">
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0 max-w-[45%]"
        >
          <div className="h-12 w-12 aspect-square rounded-full overflow-hidden border-2 border-slate-100 shadow-sm flex-shrink-0 transition-transform group-hover:scale-105">
            <img
              src="/logo.jpeg"
              alt="NativeShine"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="border-l-2 border-slate-100 pl-2 sm:pl-3 flex flex-col justify-center min-w-0">
            <span className="text-sm sm:text-base font-black text-slate-900 tracking-tighter uppercase leading-none truncate">
              NativeShine <span className="text-[#0ea5e9]">LTD</span>
            </span>
          </div>
        </Link>

        <nav className="!flex flex-row flex-nowrap items-center justify-center gap-8 min-w-0 flex-1">
          {navLinks.map((link) => (
            <div
              key={link.name}
              className="relative shrink-0"
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
                    size={12}
                    className={`transition-transform duration-200 shrink-0 ${isServicesOpen ? "rotate-180" : ""}`}
                  />
                )}
              </NavLink>

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

        <button
          type="button"
          onClick={onOpenQuote}
          className="shrink-0 bg-[#0ea5e9] text-white px-6 py-3 rounded-md font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-cyan-500/10 active:scale-95 whitespace-nowrap ml-2"
        >
          Get a Quote
        </button>
      </div>
    </header>
  );
};

export default Header;
