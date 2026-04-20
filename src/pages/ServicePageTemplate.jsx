import React, { useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Star,
    CheckCircle2,
    X,
    Maximize2
} from 'lucide-react';
import { servicesData } from '../data/servicesData';

// Example gallery images (using the same local assets for demonstration)
import n1 from '../assets/n1.jpeg';
import n2 from '../assets/n2.jpeg';
import n3 from '../assets/n3.jpeg';
import n4 from '../assets/n4.jpeg';
import n5 from '../assets/n5.jpeg';
import n6 from '../assets/n6.jpeg';
import n7 from '../assets/n7.jpeg';
import n8 from '../assets/n8.jpeg';

const ServicePageTemplate = () => {
    const { slug } = useParams();
    const [selectedImage, setSelectedImage] = useState(null);

    const service = servicesData.find(s => s.slug === slug);

    if (!service) {
        return <Navigate to="/services" replace />;
    }

    const galleryImages = [n1, n2, n3, n4, n5, n6];

    const testimonials = [
        {
            text: "The level of service provided to us by NativeShine Services is second to none and is the main reason why our customers love to stay here.",
            client: "Hotel Services Client",
            initials: "HS"
        },
        {
            text: "We have recently changed over to NativeShine Services. We needed a seamless transition. They were very helpful and efficient during this process.",
            client: "Floor Restoration Client",
            initials: "FR"
        }
    ];

    return (
        <div className="flex w-full flex-1 flex-col bg-white">
            {/* Hero Header — short fixed block on mobile/tablet; taller from md up */}
            <section className="ns-service-hero -mt-24 md:-mt-32 relative bg-slate-900 overflow-hidden flex items-end md:items-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src={service.image}
                        alt={service.title}
                        className="ns-service-hero-img w-full h-full object-cover opacity-40 transform scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-white/20"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full py-6 pt-20 sm:pt-20 md:py-0 md:pb-0 md:pt-28 lg:pt-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="border-l-4 md:border-l-8 border-[#0ea5e9] pl-4 md:pl-8"
                    >
                        <h4 className="text-[#0ea5e9] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm mb-2 md:mb-4 italic">
                            Specialist Services
                        </h4>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter font-montserrat leading-tight">
                            {service.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="ns-service-body py-8 md:py-16 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-10 md:gap-16 lg:gap-20">

                        {/* Left Column: Testimonials */}
                        <aside className="lg:w-1/3">
                            <div className="sticky top-40 space-y-8">
                                <div className="bg-[#F9F9F9] p-10 border border-slate-100 rounded-sm">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#0ea5e9] mb-10 border-b-2 border-[#00AEEF]/10 pb-4">
                                        TESTIMONIALS
                                    </h3>
                                    <div className="space-y-12">
                                        {testimonials.map((t, i) => (
                                            <div key={i} className="relative">
                                                <div className="absolute -left-4 -top-4 text-6xl text-slate-100 font-serif opacity-50">"</div>
                                                <p className="text-slate-600 italic leading-relaxed mb-6 font-medium relative z-10">
                                                    "{t.text}"
                                                </p>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white border border-slate-100 rounded-sm flex items-center justify-center font-black text-[#0ea5e9] text-xs">
                                                        {t.initials}
                                                    </div>
                                                    <p className="font-bold text-sm text-slate-900">{t.client}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Excellence Badge */}
                                <div className="bg-[#0ea5e9] p-8 text-white rounded-sm shadow-xl shadow-cyan-500/10">
                                    <CheckCircle2 size={40} className="mb-6 opacity-40" />
                                    <h4 className="text-xl font-black uppercase tracking-tight mb-4">Excellence as Standard</h4>
                                    <p className="text-sm font-medium text-white/80 leading-relaxed">
                                        We deliver services that are not just compliant, but consistently exceptional.
                                    </p>
                                </div>
                            </div>
                        </aside>

                        {/* Right Column: Dynamic Content */}
                        <div className="lg:w-2/3">
                            <div className="prose prose-slate prose-lg max-w-none">
                                <div className="text-slate-600 leading-[1.8] font-medium space-y-8 whitespace-pre-line">
                                    {service.content}
                                </div>
                            </div>

                            {/* Action Bar */}
                            <div className="mt-16 pt-12 border-t border-slate-100 flex flex-wrap gap-6 items-center">
                                <Link to="/contact" className="bg-[#0ea5e9] text-white px-10 py-4 font-black text-sm uppercase tracking-widest hover:bg-slate-900 transition-all flex items-center gap-3">
                                    Request a Quote <ArrowRight size={18} />
                                </Link>
                                <Link to="/services" className="text-slate-400 hover:text-slate-900 font-black text-sm uppercase tracking-widest transition-colors">
                                    View All Services
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Our Works Gallery Section */}
            <section className="ns-service-gallery ns-page-last py-8 md:py-16 lg:py-24 bg-[#F9F9F9]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="mb-16">
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">OUR RECENT WORKS</h2>
                        <p className="text-[#0ea5e9] font-black uppercase tracking-[0.2em] text-xs mt-4">Witness the transformation</p>
                        <div className="w-32 h-2 bg-[#00AEEF] mt-8"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {galleryImages.map((img, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                onClick={() => setSelectedImage(img)}
                                className="aspect-[4/3] relative overflow-hidden group cursor-pointer border-4 border-white shadow-lg"
                            >
                                <img src={img} alt={`Work ${i + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-[#0ea5e9]/90 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center p-8">
                                    <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        <Maximize2 size={32} className="text-white mx-auto mb-4" />
                                        <span className="text-white text-xs font-black uppercase tracking-widest">View Full Project</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <p className="text-center mt-12 text-[#0ea5e9] font-black uppercase tracking-[0.2em] text-[10px] animate-pulse">
                        Click on images to view
                    </p>
                </div>
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative max-w-5xl w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="absolute -top-12 right-0 text-white hover:text-[#0ea5e9] transition-colors flex items-center gap-2 group"
                                onClick={() => setSelectedImage(null)}
                            >
                                <span className="text-xs font-black uppercase tracking-widest group-hover:mr-2 transition-all">Close</span>
                                <X size={24} />
                            </button>
                            <img src={selectedImage} alt="Gallery view" className="w-full h-auto max-h-[85vh] object-contain border-4 border-white shadow-2xl" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ServicePageTemplate;
