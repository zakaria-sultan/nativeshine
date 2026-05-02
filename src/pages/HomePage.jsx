import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { servicesData } from "../data/servicesData";
import {
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  X,
  Maximize2,
} from "lucide-react";
import { getHomeHeroFromAssets } from "../lib/resolveServiceImages";

const HERO_IMAGES = getHomeHeroFromAssets();

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  const slides = [
    {
      title: "BRINGING NEW LIFE TO YOUR FLOORS AND WALLS",
      subtitle: "FLOOR RESTORATION",
      image: HERO_IMAGES.slide1,
      description:
        "Our extensive knowledge and experience in floor restoration, combined with advanced tools and modern techniques, ensure your floors and walls look as good as new.",
    },
    {
      title: "PRESERVING LONDON'S ARCHITECTURAL HERITAGE",
      subtitle: "FACADE CLEANING",
      image: HERO_IMAGES.slide2,
      description:
        "Specialist steam cleaning and restoration services for commercial and residential properties across the capital.",
    },
  ];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const marqueeText =
    "STRATEGIC PARTNERSHIPS COMING SOON  • NEW COLLABORATIONS UNDERWAY • ";

  return (
    <div className="flex w-full flex-col bg-white">
      {/* Hero: fixed height (550px) for all viewports — avoids vh/md blowups with width=1280 meta */}
      <section
        id="top"
        className="!h-[500px] relative bg-slate-900 overflow-hidden flex flex-col mt-0"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 h-full w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10"></div>
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="ns-hero-bg w-full h-full object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-20 h-full flex flex-col justify-center py-8 container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-2xl bg-white/10 backdrop-blur-md p-5 sm:p-6 md:p-10 border-l-4 md:border-l-8 border-[#0ea5e9] w-full"
          >
            <h4 className="text-[#0ea5e9] font-black uppercase tracking-[0.2em] text-[10px] md:text-sm mb-3 md:mb-4">
              {slides[currentSlide].subtitle}
            </h4>
            <h1 className="text-[1.65rem] leading-snug sm:text-3xl md:text-6xl font-black text-white mb-3 sm:mb-4 md:mb-6 uppercase tracking-tighter font-montserrat">
              {slides[currentSlide].title}
            </h1>
            <p className="text-sm md:text-lg text-slate-200 mb-5 sm:mb-6 md:mb-8 leading-relaxed font-medium sm:line-clamp-4 md:line-clamp-none">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === i ? "bg-[#00AEEF] w-10" : "bg-white/50"}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={prevSlide}
          className="hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-[#00AEEF] text-white rounded-full backdrop-blur-md transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          onClick={nextSlide}
          className="hidden sm:flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-[#00AEEF] text-white rounded-full backdrop-blur-md transition-all"
          aria-label="Next slide"
        >
          <ChevronRight />
        </button>
      </section>

      {/* Infinite Text Marquee — flush to hero (no top margin)
      <section className="mt-0 py-4 bg-white border-y border-slate-100 overflow-hidden flex items-center">
        <div className="relative flex whitespace-nowrap">
          <motion.div
            className="flex items-center"
            animate={{ x: [0, -1000] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
          >
            <span
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter mx-4 select-none opacity-20 pointer-events-none"
              style={{
                color: "#0ea5e9",
                WebkitTextStroke: "2px #000",
                WebkitTextFillColor: "transparent",
              }}
            >
              {marqueeText} {marqueeText} {marqueeText}
            </span>
          </motion.div>
          <motion.div
            className="flex items-center absolute left-full"
            animate={{ x: [0, -1000] }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear",
            }}
          >
            <span
              className="text-4xl md:text-6xl font-black uppercase tracking-tighter mx-4 select-none opacity-20 pointer-events-none"
              style={{
                color: "#00AEEF",
                WebkitTextStroke: "2px #00AEEF",
                WebkitTextFillColor: "transparent",
              }}
            >
              {marqueeText} {marqueeText} {marqueeText}
            </span>
          </motion.div>
        </div>
      </section> */}

      {/* OUR SERVICES - 4 COLUMN GRID */}
      <section
        id="services"
        className="ns-page-last pt-6 pb-0 mb-0 bg-white w-full px-4 sm:px-6 md:px-12"
      >
        <div className="mb-8 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-tight px-4">
            OUR SPECIALIST SERVICES
          </h2>
          <p className="text-[#f97316] font-black uppercase tracking-[0.2em] text-[10px] md:text-xs mt-4 italic">
            EXCELLENCE IS THE STANDARD
          </p>
          <div className="w-20 md:w-32 h-1.5 md:h-2 bg-[#f97316] mt-6 md:mt-8 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          {servicesData.map((service, i) => (
            <Link
              key={service.slug}
              to={`/services/${service.slug}`}
              aria-label={`${service.title} — open service page`}
              className="aspect-[3/4] relative overflow-hidden group cursor-pointer bg-slate-900 rounded-sm shadow-xl block"
            >
              <img
                src={service.imageThumbnail}
                alt=""
                className="w-full h-full object-cover object-center opacity-85 group-hover:opacity-70 transition-all duration-700 transform group-hover:scale-105"
              />

              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10"
                aria-hidden
              />

              <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-6 md:p-7 z-10">
                <span className="text-white/70 text-[10px] font-black uppercase tracking-[0.25em] mb-2 block drop-shadow-md">
                  Service {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="text-white text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight mb-3 group-hover:text-[#0ea5e9] transition-colors duration-300 leading-snug max-w-[95%] text-balance drop-shadow-lg">
                  {service.title}
                </h4>
                <div className="w-12 h-1 bg-[#0ea5e9] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 mb-3" />

                <div className="flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 drop-shadow-md">
                  View service{" "}
                  <ArrowRight size={14} className="text-[#0ea5e9] shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Lightbox Modal - Medium Centered */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-2xl w-full bg-white rounded-sm overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-slate-900 hover:text-[#00AEEF] transition-colors p-2 z-[110] bg-white/80 backdrop-blur-sm rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>

              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-[400px] object-cover"
              />
              <div className="p-8">
                <span className="text-[#00AEEF] text-xs font-black uppercase tracking-widest mb-2 block">
                  {selectedImage.category}
                </span>
                <h4 className="text-slate-900 text-3xl font-black uppercase tracking-tighter">
                  {selectedImage.title}
                </h4>
                <p className="text-slate-500 mt-4 font-medium leading-relaxed italic">
                  Professional restoration and maintenance services for
                  prestigious architectural landmarks across London.
                </p>
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-xs font-black uppercase tracking-widest px-6 py-3 border-2 border-slate-100 hover:border-[#00AEEF] text-slate-400 hover:text-[#00AEEF] transition-all"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
