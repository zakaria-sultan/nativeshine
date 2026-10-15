import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const TestimonialSlider = ({ testimonials = [] }) => {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
    const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    useEffect(() => {
        if (testimonials.length < 2) return;
        const timer = setInterval(() => setCurrent(value => (value + 1) % testimonials.length), 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    if (!testimonials.length) return null;
    const testimonial = testimonials[current % testimonials.length];

    return (
        <section className="py-8 bg-secondary-dark text-white overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(0,102,204,0.15)_0%,transparent_50%)]"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <Quote className="w-16 h-16 text-primary/20 mx-auto mb-6" />
                    <h2 className="text-sm font-black text-primary-light uppercase tracking-[0.3em] mb-4">Client Feedback</h2>
                    <h3 className="text-4xl md:text-5xl font-black tracking-tight">Trusted by Industry Leaders</h3>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    <AnimatePresence mode="wait">
                        <Motion.div
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
                                "{testimonial.text}"
                            </p>
                            <div className="flex flex-col items-center">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="w-20 h-20 rounded-full border-4 border-primary/30 mb-4"
                                />
                                <div className="text-xl font-black text-white">{testimonial.name}</div>
                                <div className="text-primary-light font-bold text-sm tracking-widest uppercase">{testimonial.role}</div>
                            </div>
                        </Motion.div>
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
