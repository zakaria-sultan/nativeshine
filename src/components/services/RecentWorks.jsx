import React, { useMemo, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { resolveRecentWorkImages } from "../../lib/resolveRecentWorkImages";

/**
 * Per-service “Our Recent Works” grid (6 samples, 2×3 on large screens).
 * Images resolve from src/assets/{Folder}/{Prefix}{n}.{png|jpg|jpeg} when present.
 *
 * @param {string} serviceSlug — route slug, e.g. kitchen-cleaning
 * @param {string} serviceTitle — display name for accessible labels
 */
const RecentWorks = ({ serviceSlug, serviceTitle }) => {
  const images = useMemo(
    () => resolveRecentWorkImages(serviceSlug),
    [serviceSlug],
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!lightboxOpen || images.length === 0) return;

    const onKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, images.length, goNext, goPrev, closeLightbox]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [lightboxOpen]);

  const currentSrc =
    images.length > 0 ? images[lightboxIndex % images.length] : null;

  return (
    <section className="ns-page-last pt-8 pb-0 mb-0 bg-[#F9F9F9]">
      <div className="container mx-auto px-6 max-w-7xl pb-6">
        <div className="mb-10">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            OUR RECENT WORKS
          </h2>
          <p className="text-[#0ea5e9] font-black uppercase tracking-[0.2em] text-xs mt-4">
            Witness the transformation — {serviceTitle}
          </p>
          <div className="w-32 h-2 bg-[#00AEEF] mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((src, i) => (
            <figure
              key={`${serviceSlug}-rw-${i}`}
              className="aspect-[4/3] relative overflow-hidden border-4 border-white shadow-lg bg-slate-100 rounded-sm group"
            >
              <button
                type="button"
                className="absolute inset-0 z-20 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9] focus-visible:ring-offset-2 rounded-sm"
                onClick={() => openLightbox(i)}
                aria-label={`Open larger preview: ${serviceTitle} sample ${i + 1}`}
              />
              <img
                src={src}
                alt={`${serviceTitle}: recent work sample ${i + 1}`}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                loading="lazy"
              />
              <figcaption className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
            </figure>
          ))}
        </div>

        <p className="text-center mt-10 text-slate-500 text-xs font-medium">
          Tap or click an image for a full-size preview. Use arrows or ← → keys
          to browse.
        </p>
      </div>

      <AnimatePresence>
        {lightboxOpen && currentSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md px-12 sm:px-16 md:px-20 py-8"
            onClick={closeLightbox}
            role="presentation"
          >
            <button
              type="button"
              className="absolute left-2 sm:left-4 md:left-8 top-1/2 z-[110] -translate-y-1/2 rounded-full border border-white/30 bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-[#0ea5e9] hover:border-[#0ea5e9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9]"
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} strokeWidth={2.5} />
            </button>

            <button
              type="button"
              className="absolute right-2 sm:right-4 md:right-8 top-1/2 z-[110] -translate-y-1/2 rounded-full border border-white/30 bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-[#0ea5e9] hover:border-[#0ea5e9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0ea5e9]"
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next image"
            >
              <ChevronRight size={28} strokeWidth={2.5} />
            </button>

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative w-full max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute -top-10 sm:-top-12 right-0 text-white hover:text-[#0ea5e9] transition-colors flex items-center gap-2 z-10"
                onClick={closeLightbox}
                aria-label="Close preview"
              >
                <span className="text-xs font-black uppercase tracking-widest">
                  Close
                </span>
                <X size={22} />
              </button>
              <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                {serviceTitle} · Sample{" "}
                {String(lightboxIndex + 1).padStart(2, "0")} /{" "}
                {String(images.length).padStart(2, "0")}
              </p>

              <div className="relative flex min-h-[40vh] items-center justify-center overflow-hidden rounded-sm border-4 border-white bg-black/40 shadow-2xl">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={lightboxIndex}
                    src={currentSrc}
                    alt={`${serviceTitle} enlarged preview ${lightboxIndex + 1}`}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="max-h-[85vh] w-full object-contain"
                  />
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RecentWorks;
