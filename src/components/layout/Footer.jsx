import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { servicesData } from "../../data/servicesData";

const Footer = ({ className = "" }) => {
  const siteMap = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      url: "#",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      url: "https://wa.me/447477134380",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M17.47 14.39c-.29-.15-1.74-.86-2.02-.96-.28-.1-.48-.15-.68.15-.2.3-.77.96-.94 1.15-.17.2-.34.22-.63.07a9.03 9.03 0 01-2.63-1.62 9.9 9.9 0 01-1.82-2.27c-.17-.29-.02-.45.13-.59.13-.13.3-.34.45-.51.15-.17.2-.34.3-.5.1-.2.05-.38-.02-.53-.07-.15-.68-1.64-.93-2.25-.24-.6-.49-.52-.68-.53-.18-.01-.38-.01-.58-.01-.2 0-.52.07-.79.37-.27.3-1.03 1-1.03 2.45s1.06 2.85 1.2 3.05c.15.19 2.09 3.19 5.07 4.48.71.3 1.26.48 1.69.62.71.22 1.36.19 1.87.11.57-.08 1.74-.71 1.99-1.4.25-.7.25-1.29.17-1.4-.07-.12-.27-.19-.56-.34z M12.01 3.63c4.6 0 8.34 3.75 8.34 8.35s-3.75 8.34-8.34 8.34c-1.42 0-2.8-.35-4.01-1.02l-4.33 1.14 1.16-4.22a8.32 8.32 0 01-1.15-4.24c0-4.6 3.75-8.35 8.33-8.35z" />
        </svg>
      ),
    },
    {
      name: "Website",
      url: "/",
      svg: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93c0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41c0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      className={`bg-white border-t border-gray-100 font-inter ${className}`.trim()}
    >
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
          {/* Column 1: Branding */}
          <div className="flex flex-col space-y-6">
            <Link to="/" className="flex items-center gap-4 group">
              <img
                src="/logo.jpeg"
                alt="NativeShine"
                className="h-16 w-auto transition-transform group-hover:scale-105"
              />
              <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase border-l-2 border-slate-100 pl-4 py-1">
                NativeShine <span className="text-[#0ea5e9]">LTD</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-xs transition-opacity hover:opacity-80">
              Founded in 2025, delivering architectural restoration excellence
              backed by experience since 2004.
            </p>
          </div>

          {/* Column 2: Site Map */}
          <div className="flex flex-col">
            <h4 className="text-slate-900 text-xs font-black uppercase tracking-[0.2em] mb-8">
              Site Map
            </h4>
            <ul className="space-y-4">
              {siteMap.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-[#0ea5e9] text-sm font-bold transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#0ea5e9]"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col">
            <h4 className="text-slate-900 text-xs font-black uppercase tracking-[0.2em] mb-8">
              Services
            </h4>
            <ul className="space-y-4">
              {servicesData.map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-slate-400 hover:text-[#0ea5e9] text-sm font-bold transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#0ea5e9]"
                    />
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div className="flex flex-col">
            <h4 className="text-slate-900 text-xs font-black uppercase tracking-[0.2em] mb-8">
              Follow Us
            </h4>
            <div className="flex gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target={social.url.startsWith("http") ? "_blank" : "_self"}
                  rel={
                    social.url.startsWith("http") ? "noopener noreferrer" : ""
                  }
                  className="text-slate-400 hover:text-[#0ea5e9] transition-all duration-300 transform hover:scale-110"
                  title={social.name}
                >
                  {social.svg}
                </a>
              ))}
            </div>
            <div className="mt-8 p-6 bg-[#FAFAFA] rounded-sm border border-gray-100">
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest mb-2">
                Office Hours
              </p>
              <p className="text-xs text-slate-500 font-bold">
                Mon - Fri: 08:00 - 18:00
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-[#FAFAFA] py-8 border-t border-gray-100 text-center">
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
          © 2026 NativeShine Services LTD. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
