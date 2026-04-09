import React from 'react';
import { motion } from 'framer-motion';
import { services } from '../data/services';
import ServiceCard from '../components/ui/ServiceCard';
import { Button } from '../components/ui/Button';
import { useQuote } from '../context/QuoteContext';
import { CheckCircle2, ArrowRight, PlayCircle } from 'lucide-react';
import WhyChooseUs from '../components/ui/WhyChooseUs';
import ProjectGallery from '../components/ui/ProjectGallery';
import TestimonialSlider from '../components/ui/TestimonialSlider';

const Home = () => {
    const { openQuote } = useQuote();
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-secondary-dark">
                {/* Background Video/Image Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary-dark via-secondary-dark/80 to-transparent z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000"
                        alt="Corporate Facility"
                        className="w-full h-full object-cover scale-105 animate-slow-zoom opacity-50"
                    />
                </div>

                <div className="container mx-auto px-6 relative z-20 pt-20">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="flex items-center space-x-3 mb-8">
                                <span className="h-0.5 w-12 bg-primary"></span>
                                <span className="text-primary-light font-black text-sm uppercase tracking-[0.4em]">Leading London Specialists</span>
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black text-white mb-10 leading-[0.95] tracking-tighter">
                                Precision <span className="text-primary-light">Restoration</span>.<br />
                                Expert Maintenance.
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-2xl font-medium leading-relaxed">
                                NATIVESHINE LTD provides world-class cleaning and restoration for corporate environments, high-end residences, and industrial facilities.
                            </p>
                            
                        </motion.div>
                    </div>
                </div>

        
            </section>

            {/* Why Choose Us */}
            <WhyChooseUs />

            {/* Quick About Section */}
            <section className="py-24 bg-white border-y border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        <div className="w-full lg:w-1/2">
                            <div className="bg-slate-50 p-4 rounded-3xl shadow-inner relative">
                                <img
                                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=1000"
                                    alt="Our Team"
                                    className="rounded-2xl shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-700"
                                />
                                <div className="absolute -bottom-6 -right-6 bg-primary p-8 rounded-2xl shadow-xl z-20 text-white hidden md:block">
                                    <div className="text-3xl font-black mb-1">ISO 9001</div>
                                    <div className="text-[10px] uppercase font-black tracking-widest">Quality Certified</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-6">Corporate Standards</h2>
                            <h3 className="text-4xl md:text-5xl font-black text-secondary-dark mb-8 tracking-tight">
                                Delivering Excellence through Rigorous Methodology
                            </h3>
                            <p className="text-lg text-slate-500 mb-10 leading-relaxed font-bold">
                                Since our inception, NATIVESHINE LTD has remained at the forefront of the restoration industry. We prioritize results, security, and environmental responsibility in every contract we undertake.
                            </p>
                            <div className="space-y-6 mb-12">
                                {[
                                    'Health & Safety First Culture',
                                    'Fully Vetted & Trained Personnel',
                                    'Bespoke Quality Management Systems'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-sm font-black text-secondary uppercase tracking-wider">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <Button variant="outline" size="lg">Our Heritage</Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid Section */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Core Competencies</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-secondary-dark mb-6 tracking-tight">Our Specialist Services</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <ServiceCard key={service.id} service={service} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Project Gallery */}
            <ProjectGallery />

            {/* Testimonials Slider */}
            <TestimonialSlider />

            {/* Final CTA Section */}
            <section className="py-32 bg-white flex justify-center items-center">
                <div className="container mx-auto px-6">
                    <div className="bg-primary-dark rounded-[3rem] p-16 md:p-24 relative overflow-hidden flex flex-col items-center text-center shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        <div className="relative z-10 max-w-4xl">
                            <h2 className="text-sm font-black text-primary-light uppercase tracking-[0.5em] mb-8">Integrated Solutions</h2>
                            <h3 className="text-5xl md:text-7xl font-black text-white mb-10 leading-tight tracking-tighter">
                                Ready to Elevate Your Property Standards?
                            </h3>
                            <p className="text-2xl text-slate-400 mb-12 font-medium">
                                Contact our strategy team today for a comprehensive facility assessment and bespoke quotation.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center">
                                <Button onClick={openQuote} variant="accent" size="xl">
                                    Request Consultation <ArrowRight className="ml-3 w-6 h-6" />
                                </Button>
                                <Button variant="outline" size="xl" className="border-white text-white hover:bg-white hover:text-secondary-dark">
                                    Our Pricing
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
