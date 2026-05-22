import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X, Phone } from "lucide-react";

import { servicesData } from "../../data/servicesData";

const Header = ({ onOpenQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsServicesOpen(false);
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  }, [location]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

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
    `text-[11px] font-black uppercase tracking-[0.12em] transition-all px-3 py-2.5 rounded-md whitespace-nowrap flex items-center gap-0.5 shrink-0 ${isActive
      ? "bg-[#0ea5e9] text-white shadow-md shadow-cyan-500/20"
      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;

  const getMobileLinkClass = (isActive) =>
    `block w-full text-left text-sm font-black uppercase tracking-[0.15em] transition-all px-5 py-4 border-b border-slate-100 ${isActive
      ? "bg-[#0ea5e9] text-white"
      : "text-slate-700 hover:bg-slate-50 hover:text-[#0ea5e9]"
    }`;

  const openQuoteMobile = () => {
    setIsMobileMenuOpen(false);
    onOpenQuote();
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 w-full">
        {/* Mobile / tablet contact strip — desktop unchanged (hidden lg+) */}
        <div className="lg:hidden bg-emerald-900 text-white border-b border-emerald-950/40">
          <div className="flex flex-col items-center justify-center gap-1.5 py-2 px-4 text-center">
            <a
              href="tel:02036421152"
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-wide hover:text-emerald-100 transition-colors"
            >
              <Phone size={14} className="shrink-0 opacity-90" aria-hidden />
              020 3642 1152
            </a>
            <a
              href="tel:07777143488"
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-wide hover:text-emerald-100 transition-colors"
            >
              <Phone size={14} className="shrink-0 opacity-90" aria-hidden />
              07777 143488
            </a>
          </div>
        </div>

        <div
          className={`flex items-center border-b border-slate-100 bg-white transition-all duration-300 h-20 lg:h-24 ${isScrolled ? "shadow-md" : ""
            }`}
        >
          <div className="container mx-auto max-w-[1280px] w-full h-full px-4 md:px-6 lg:px-8 flex flex-row flex-nowrap items-center justify-between gap-3 lg:gap-4 min-w-0">
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 group shrink-0 min-w-0 max-w-[72%] lg:max-w-[45%]"
            >
              <div className="h-11 w-11 lg:h-12 lg:w-12 aspect-square rounded-full overflow-hidden border-2 border-slate-100 shadow-sm flex-shrink-0 transition-transform group-hover:scale-105">
                <img
                  src="/logo.jpeg"
                  alt="NativeShine"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="border-l-2 border-slate-100 pl-2 sm:pl-3 flex flex-col justify-center min-w-0">
                <span className="text-xs sm:text-sm lg:text-base font-black text-slate-900 tracking-tighter uppercase leading-none truncate">
                  NativeShine <span className="text-[#0ea5e9]">LTD</span>
                </span>
              </div>
            </Link>

            <nav className="hidden lg:!flex flex-row flex-nowrap items-center justify-center gap-8 min-w-0 flex-1">
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
                    end={link.name === "Home"}
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
              className="hidden lg:flex shrink-0 bg-[#0ea5e9] text-white px-6 py-3 rounded-md font-black text-[11px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-cyan-500/10 active:scale-95 whitespace-nowrap ml-2"
            >
              Get a Quote
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-800 hover:text-[#0ea5e9] transition-colors shrink-0"
              aria-label="Open menu"
            >
              <Menu size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[60] bg-black/50 lg:hidden"
              aria-label="Close menu backdrop"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-slate-100 flex-shrink-0">
                    <img
                      src="/logo.jpeg"
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tighter text-slate-900 truncate">
                    NativeShine <span className="text-[#0ea5e9]">LTD</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={26} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto overscroll-contain py-2">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.dropdown ? (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setIsMobileServicesOpen((p) => !p)
                          }
                          className="w-full flex items-center justify-between text-sm font-black uppercase tracking-[0.15em] text-slate-700 hover:bg-slate-50 hover:text-[#0ea5e9] px-5 py-4 transition-all border-b border-slate-100"
                        >
                          {link.name}
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 shrink-0 ${isMobileServicesOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                        <AnimatePresence>
                          {isMobileServicesOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22 }}
                              className="overflow-hidden bg-slate-50 border-b border-slate-100"
                            >
                              {servicesData.map((service) => (
                                <Link
                                  key={service.slug}
                                  to={`/services/${service.slug}`}
                                  className="block pl-10 pr-5 py-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-[#0ea5e9] hover:bg-white transition-all border-b border-slate-100 last:border-0"
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
                        end={link.name === "Home"}
                        className={({ isActive }) => {
                          const isHashMatch = link.hash
                            ? location.hash === link.hash
                            : !link.hash;
                          return getMobileLinkClass(isActive && isHashMatch);
                        }}
                      >
                        {link.name}
                      </NavLink>
                    )}
                  </div>
                ))}
              </nav>

              <div className="p-5 border-t border-slate-100 shrink-0 pb-8">
                <button
                  type="button"
                  onClick={openQuoteMobile}
                  className="w-full rounded-full bg-[#0ea5e9] text-white py-4 font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-cyan-500/15"
                >
                  Get a Free Quote
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
