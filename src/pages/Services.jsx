import React from 'react';
import { services } from '../data/services';
import ServiceCard from '../components/ui/ServiceCard';
import { motion } from 'framer-motion';

const Services = () => {
    return (
        <div className="w-full">
            {/* Header */}
            <section className="bg-secondary-dark pt-32 pb-24 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-white rounded-t-[4rem] z-0"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-sm font-black text-primary-light uppercase tracking-[0.4em] mb-6">Expertise Overview</h1>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter">
                            Specialist <span className="text-primary-light">Capabilities</span>.
                        </h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto mb-12">
                            A comprehensive suite of restoration and maintenance services tailored for London's leading commercial and residential assets.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Grid */}
            <section className="pb-24 bg-white relative z-10">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <ServiceCard key={service.id} service={service} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Quality Standard */}
            <section className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <div className="bg-white p-12 md:p-20 rounded-[3.5rem] shadow-xl border border-slate-200 flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/4 flex justify-center">
                            <div className="w-32 h-32 border-8 border-primary/10 rounded-full flex items-center justify-center text-primary text-4xl font-black">20y</div>
                        </div>
                        <div className="w-full md:w-3/4">
                            <h4 className="text-2xl font-black text-secondary-dark mb-4 uppercase tracking-widest text-sm">Industrial Compliance Guaranteed</h4>
                            <p className="text-slate-500 font-bold leading-relaxed">
                                Every service we offer is governed by strict ISO-aligned quality management protocols. Our personnel are fully vetted, insured, and certified in their respective specialist domains, ensuring complete peace of mind for our corporate partners.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Services;
