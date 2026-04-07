import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
    {
        name: 'James Wilson',
        role: 'Facility Manager, The Grand',
        text: 'NativeShine has consistently delivered exceptional results. Their attention to detail in our marble restoration was truly remarkable.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=cover&q=80&w=150'
    },
    {
        name: 'Sarah Thompson',
        role: 'Operations Director, TechCorp',
        text: 'Reliable, professional, and thorough. We have been using their commercial maintenance services for 3 years without a single issue.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=cover&q=80&w=150'
    },
    {
        name: 'Robert Chen',
        role: 'Property Developer, Mayfair Properties',
        text: 'The best restoration team in London. They understood our requirements perfectly and delivered ahead of schedule.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=cover&q=80&w=150'
    }
];

const TestimonialSlider = () => {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    useEffect(() => {
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 bg-secondary-dark text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(0,102,204,0.15)_0%,transparent_50%)]"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <Quote className="w-16 h-16 text-primary/20 mx-auto mb-6" />
                    <h2 className="text-sm font-black text-primary-light uppercase tracking-[0.3em] mb-4">Client Feedback</h2>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight">Trusted by Industry Leaders</h3>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={current}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="bg-white/5 backdrop-blur-sm p-12 md:p-16 rounded-3xl border border-white/10"
                        >
                            <div className="flex mb-8 justify-center">
                                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-5 h-5 text-primary-light fill-primary-light mr-1" />)}
                            </div>
                            <p className="text-2xl md:text-3xl text-slate-100 italic font-light leading-relaxed text-center mb-12">
                                "{testimonials[current].text}"
                            </p>
                            <div className="flex flex-col items-center">
                                <img
                                    src={testimonials[current].image}
                                    alt={testimonials[current].name}
                                    className="w-20 h-20 rounded-full border-4 border-primary/30 mb-4"
                                />
                                <div className="text-xl font-black text-white">{testimonials[current].name}</div>
                                <div className="text-primary-light font-bold text-sm tracking-widest uppercase">{testimonials[current].role}</div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-center mt-12 space-x-6">
                        <button onClick={prev} className="p-4 bg-white/10 hover:bg-primary rounded-full transition-all duration-300 border border-white/10 group">
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button onClick={next} className="p-4 bg-white/10 hover:bg-primary rounded-full transition-all duration-300 border border-white/10 group">
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSlider;
