import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { servicesData } from '../data/servicesData';
import {
    ChevronRight,
    ChevronLeft,
    Star,
    CheckCircle2,
    ArrowRight,
    X,
    Maximize2
} from 'lucide-react';

// Import local assets
import n1 from '../assets/n1.jpeg';
import n2 from '../assets/n2.jpeg';
import n3 from '../assets/n3.jpeg';
import n4 from '../assets/n4.jpeg';
import n5 from '../assets/n5.jpeg';
import n6 from '../assets/n6.jpeg';
import n7 from '../assets/n7.jpeg';
import n8 from '../assets/n8.jpeg';

const HomePage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);

    const slides = [
        {
            title: "BRINGING NEW LIFE TO YOUR FLOORS AND WALLS",
            subtitle: "FLOOR RESTORATION",
            image: n1,
            description: "Our extensive knowledge and experience in floor restoration along with the most advanced tools and processes will result in your floors and walls looking as good as new."
        },
        {
            title: "PRESERVING LONDON'S ARCHITECTURAL HERITAGE",
            subtitle: "FACADE CLEANING",
            image: n2,
            description: "Specialist steam cleaning and restoration services for commercial and residential properties across the capital."
        }
    ];

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    const marqueeText = "STRATEGIC PARTNERSHIPS COMING SOON  • NEW COLLABORATIONS UNDERWAY • ";

    return (
        <div className="bg-white">
            {/* Hero Slider */}
            <section id="top" className="-mt-32 relative h-screen bg-slate-900 overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-0"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10"></div>
                        <img
                            src={slides[currentSlide].image}
                            alt={slides[currentSlide].title}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </AnimatePresence>

                <div className="relative z-20 h-full container mx-auto px-6 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="max-w-2xl bg-white/10 backdrop-blur-sm p-10 border-l-8 border-[#00AEEF]"
                    >
                        <h4 className="text-[#00AEEF] font-black uppercase tracking-[0.3em] text-sm mb-4">
                            {slides[currentSlide].subtitle}
                        </h4>
                        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight uppercase tracking-tighter">
                            {slides[currentSlide].title}
                        </h1>
                        <p className="text-lg text-slate-200 mb-8 leading-relaxed font-medium">
                            {slides[currentSlide].description}
                        </p>
                        <button className="bg-[#0ea5e9] text-white px-10 py-4 font-black text-sm uppercase tracking-widest hover:bg-white hover:text-[#00AEEF] transition-all flex items-center gap-3 shadow-lg shadow-cyan-500/20">
                            Read More <ArrowRight size={18} />
                        </button>
                    </motion.div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                    {slides.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentSlide(i)}
                            className={`w-3 h-3 rounded-full transition-all ${currentSlide === i ? 'bg-[#00AEEF] w-10' : 'bg-white/50'}`}
                        />
                    ))}
                </div>

                <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-[#00AEEF] text-white rounded-full backdrop-blur-md transition-all">
                    <ChevronLeft />
                </button>
                <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 hover:bg-[#00AEEF] text-white rounded-full backdrop-blur-md transition-all">
                    <ChevronRight />
                </button>
            </section>

            {/* Infinite Text Marquee */}
            <section className="py-12 bg-white border-y border-slate-100 overflow-hidden flex items-center">
                <div className="relative flex whitespace-nowrap">
                    <motion.div
                        className="flex items-center"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            duration: 20,
                            ease: "linear"
                        }}
                    >
                        <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter mx-4 select-none opacity-20 pointer-events-none"
                            style={{
                                color: '#0ea5e9',
                                WebkitTextStroke: '2px #000',
                                WebkitTextFillColor: 'transparent'
                            }}>
                            {marqueeText} {marqueeText} {marqueeText}
                        </span>
                    </motion.div>
                    <motion.div
                        className="flex items-center absolute left-full"
                        animate={{ x: [0, -1000] }}
                        transition={{
                            repeat: Infinity,
                            duration: 20,
                            ease: "linear"
                        }}
                    >
                        <span className="text-4xl md:text-6xl font-black uppercase tracking-tighter mx-4 select-none opacity-20 pointer-events-none"
                            style={{
                                color: '#00AEEF',
                                WebkitTextStroke: '2px #00AEEF',
                                WebkitTextFillColor: 'transparent'
                            }}>
                            {marqueeText} {marqueeText} {marqueeText}
                        </span>
                    </motion.div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-24 bg-[#F9F9F9]">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-20">
                        {/* Left Sidebar - Testimonials */}
                        <aside className="lg:w-1/3">
                            <div className="sticky top-40 space-y-8">
                                <div className="bg-white p-10 shadow-sm border border-slate-100 rounded-sm">
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#0ea5e9] mb-10 border-b-2 border-[#00AEEF]/10 pb-4">
                                        TESTIMONIALS
                                    </h3>
                                    <div className="space-y-12">
                                        <div className="relative">
                                            <div className="flex mb-4 text-[#C0C0C0]">
                                                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                                            </div>
                                            <p className="text-slate-600 italic leading-relaxed mb-6 font-medium">
                                                "The transformation of our office lobby was incredible. NativeShine Services restored our limestone floors to their original glory."
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-sm flex items-center justify-center font-black text-[#00AEEF]">JW</div>
                                                <div>
                                                    <p className="font-bold text-sm text-slate-900">John Walker</p>
                                                    <p className="text-xs text-slate-400 font-bold">Property Manager, Savills</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Right Content */}
                        <div className="lg:w-2/3">
                            <div className="bg-white p-12 lg:p-16 border border-slate-100 shadow-sm">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight uppercase tracking-tighter font-montserrat">
                                    Experience Excellence with <br />
                                    <span className="text-[#0ea5e9]">NativeShine Services</span>
                                </h2>
                                <div className="space-y-8 text-lg text-slate-500 leading-relaxed font-medium">
                                    <p>
                                        With over two decades of heritage in the restoration industry, NativeShine Services has established itself as London's premier provider of architectural surface care. Our commitment to excellence is reflected in every project we undertake, from heritage landmarks to modern commercial developments.
                                    </p>
                                    <p>
                                        We specialize in the restoration and maintenance of various surfaces including stone, brick, marble, and wood. Our team utilizes the most advanced technologies, including the DOFF steam cleaning system and TORC abrasive systems, ensuring the highest standards of cleanliness and preservation.
                                    </p>
                                </div>

                                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {[
                                        "ISO 9001 Certified Quality",
                                        "Fully Insured & Accredited",
                                        "London-Wide Service Coverage",
                                        "Eco-Friendly Restoration Methods",
                                        "Heritage Specialist Team",
                                        "24/7 Support for Partners"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 group cursor-default">
                                            <div className="w-10 h-10 rounded-sm bg-[#00AEEF]/5 flex items-center justify-center text-[#00AEEF] group-hover:bg-[#00AEEF] group-hover:text-white transition-all transform group-hover:rotate-12">
                                                <CheckCircle2 size={20} />
                                            </div>
                                            <span className="font-black text-sm text-slate-700 uppercase tracking-wide">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* OUR SERVICES - 4 COLUMN GRID */}
            <section id="services" className="py-24 bg-white w-full px-4 md:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">OUR SPECIALIST SERVICES</h2>
                    <p className="text-[#0ea5e9] font-black uppercase tracking-[0.3em] text-xs mt-4 italic">Excellence as Standard</p>
                    <div className="w-32 h-2 bg-[#00AEEF] mt-8 mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    {servicesData.map((service, i) => (
                        <Link
                            key={service.slug}
                            to={`/services/${service.slug}`}
                            className="aspect-[3/4] relative overflow-hidden group cursor-pointer bg-slate-900 rounded-sm shadow-xl"
                        >
                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-all duration-700 transform group-hover:scale-110"
                            />

                            {/* Service Content */}
                            <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                                <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block translate-y-4 group-hover:translate-y-0 transition-all duration-500">Service 0{i + 1}</span>
                                <h4 className="text-white text-2xl font-black uppercase tracking-tight mb-6 group-hover:text-[#0ea5e9] transition-colors duration-300 leading-tight">
                                    {service.title}
                                </h4>
                                <div className="w-12 h-1 bg-[#0ea5e9] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 mb-8"></div>

                                <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    Exploration <ArrowRight size={14} className="text-[#0ea5e9]" />
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
                                <span className="text-[#00AEEF] text-xs font-black uppercase tracking-widest mb-2 block">{selectedImage.category}</span>
                                <h4 className="text-slate-900 text-3xl font-black uppercase tracking-tighter">{selectedImage.title}</h4>
                                <p className="text-slate-500 mt-4 font-medium leading-relaxed italic">
                                    Professional restoration and maintenance services for prestigious architectural landmarks across London.
                                </p>
                                <div className="mt-8 flex justify-end">
                                    <button onClick={() => setSelectedImage(null)} className="text-xs font-black uppercase tracking-widest px-6 py-3 border-2 border-slate-100 hover:border-[#00AEEF] text-slate-400 hover:text-[#00AEEF] transition-all">
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
