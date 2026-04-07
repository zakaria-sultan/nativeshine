import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Eye, Users, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

const About = () => {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-secondary-dark pt-32 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 rounded-bl-[10rem]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-sm font-black text-primary-light uppercase tracking-[0.4em] mb-6">Our Heritage</h1>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                            Setting the Standard in <span className="text-primary-light">London</span> Restoration.
                        </h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">
                            NATIVESHINE LTD is a premier restoration and maintenance firm, dedicated to preserving the integrity of London's most prestigious properties.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-50 p-12 rounded-3xl border border-slate-100"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-8">
                                <Target className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-3xl font-black text-secondary-dark mb-6 tracking-tight">Our Mission</h3>
                            <p className="text-lg text-slate-500 font-bold leading-relaxed">
                                To provide unparalleled restoration services through technical innovation, rigorous quality management, and an uncompromising commitment to client satisfaction. We aim to be the first choice for complex facility maintenance.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-slate-50 p-12 rounded-3xl border border-slate-100"
                        >
                            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-8">
                                <Eye className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-3xl font-black text-secondary-dark mb-6 tracking-tight">Our Vision</h3>
                            <p className="text-lg text-slate-500 font-bold leading-relaxed">
                                To redefine property maintenance by integrating sustainable practices with world-class execution, ensuring every space we touch is restored to its peak aesthetic and functional state.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values / Team Placeholder */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h3 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Why We Lead</h3>
                        <h4 className="text-4xl font-black text-secondary-dark tracking-tight">Built on Foundational Principles</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { icon: Shield, title: 'Integrity', text: 'Transparent reporting and honest assessments on every project phase.' },
                            { icon: Users, title: 'Expertise', text: 'A team of highly vatted specialists with deep domain knowledge.' },
                            { icon: Award, title: 'Quality', text: 'Rigorous inspection protocols following ISO quality standards.' }
                        ].map((value, i) => (
                            <div key={i} className="text-center group">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-md group-hover:bg-primary transition-colors duration-500">
                                    <value.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
                                </div>
                                <h5 className="text-xl font-black text-secondary-dark mb-4">{value.title}</h5>
                                <p className="text-slate-500 font-bold text-sm px-4">{value.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="container mx-auto px-6 text-center">
                    <h3 className="text-4xl font-black text-secondary-dark mb-10 tracking-tight">Partner with London's Finest</h3>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Button variant="primary" size="lg">Contact Our Team</Button>
                        <Button variant="outline" size="lg">Review Credentials</Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
