import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Maximize2 } from "lucide-react";
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
  const [lightboxSrc, setLightboxSrc] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (src, index) => {
    setLightboxSrc(src);
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightboxSrc(null);

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
                onClick={() => openLightbox(src, i)}
                aria-label={`Open larger preview: ${serviceTitle} sample ${i + 1}`}
              />
              <img
                src={src}
                alt={`${serviceTitle}: recent work sample ${i + 1}`}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                loading="lazy"
              />
              <figcaption className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <span className="pointer-events-none absolute bottom-4 left-4 text-white text-[10px] font-black uppercase tracking-[0.2em] drop-shadow-md z-10 flex items-center gap-2">
                <Maximize2 size={14} className="opacity-90" />
                Sample {String(i + 1).padStart(2, "0")}
              </span>
            </figure>
          ))}
        </div>

        <p className="text-center mt-10 text-slate-500 text-xs font-medium">
          Tap or click an image for a full-size preview.
        </p>
      </div>

      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
            onClick={closeLightbox}
            role="presentation"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative max-w-5xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute -top-11 right-0 text-white hover:text-[#0ea5e9] transition-colors flex items-center gap-2 z-10"
                onClick={closeLightbox}
                aria-label="Close preview"
              >
                <span className="text-xs font-black uppercase tracking-widest">
                  Close
                </span>
                <X size={22} />
              </button>
              <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                {serviceTitle} · Sample {String(lightboxIndex + 1).padStart(2, "0")}
              </p>
              <img
                src={lightboxSrc}
                alt={`${serviceTitle} enlarged preview`}
                className="w-full h-auto max-h-[85vh] object-contain border-4 border-white shadow-2xl rounded-sm bg-black/40"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RecentWorks;
