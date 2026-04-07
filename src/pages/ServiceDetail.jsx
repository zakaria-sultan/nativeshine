import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { services } from '../data/services';
import { CheckCircle2, ArrowLeft, Phone, Mail, ArrowUpRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useQuote } from '../context/QuoteContext';

const ServiceDetail = () => {
    const { id } = useParams();
    const { openQuote } = useQuote();
    const service = services.find(s => s.slug === id);

    if (!service) {
        return (
            <div className="container mx-auto px-6 py-40 text-center">
                <h1 className="text-4xl font-black text-secondary-dark mb-8 uppercase tracking-widest">Service Protocol Not Found</h1>
                <Link to="/" className="text-primary font-black hover:underline uppercase tracking-widest text-sm">Return to Base</Link>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Hero Section */}
            <section className="bg-secondary-dark pt-32 pb-48 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-20">
                    <img src={service.image} alt="Ref" className="w-full h-full object-cover blur-sm" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-secondary-dark via-secondary-dark/80 to-transparent z-10"></div>

                <div className="container mx-auto px-6 relative z-20">
                    <Link to="/services" className="inline-flex items-center text-primary-light font-black text-xs uppercase tracking-[0.2em] mb-12 hover:text-white transition-colors">
                        <ArrowLeft className="mr-3 w-4 h-4" /> Specialist Services
                    </Link>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-none max-w-4xl">
                            {service.title}
                        </h1>
                        <div className="flex flex-col md:flex-row gap-12 items-start">
                            <p className="text-xl text-slate-300 max-w-2xl font-bold leading-relaxed pr-10 border-r border-white/10">
                                Providing world-class {service.title.toLowerCase()} solutions for the capital's most demanding environments.
                            </p>
                            <div className="flex flex-col gap-4">
                                <div className="text-[10px] font-black text-primary-light uppercase tracking-widest">Status / Capability</div>
                                <div className="px-6 py-2 bg-white/10 rounded-full text-white font-black text-xs uppercase tracking-widest inline-block border border-white/20">
                                    Operational Nationwide
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 bg-white -mt-24 relative z-30 rounded-t-[4rem] shadow-[0_-30px_60px_rgba(0,0,0,0.1)]">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-24">
                        <div className="w-full lg:w-2/3">
                            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-8">Technical Overview</h2>
                            <h3 className="text-4xl font-black text-secondary-dark mb-10 tracking-tight">Bespoke Methodology</h3>
                            <p className="text-lg text-slate-500 mb-12 leading-relaxed font-bold">
                                {service.description} Our approach is built on two decades of experience, combining traditional techniques with contemporary technology to ensure a finish that exceeds industry expectations.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                                {[
                                    'Specialist technical certification',
                                    'State-of-the-art equipment suite',
                                    'Environmentally responsible solutions',
                                    'Comprehensive Risk Assessments',
                                    'Site-specific method statements',
                                    'Key performance indicators (KPIs)'
                                ].map((feature, i) => (
                                    <div key={i} className="flex items-center space-x-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 transition-all duration-300">
                                        <div className="w-10 h-10 bg-white shadow-sm flex items-center justify-center rounded-lg">
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                        </div>
                                        <span className="text-sm font-black text-secondary uppercase tracking-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-8">Service Workflow</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {[
                                    { title: 'Project Mobilisation', text: 'Initial site assessment and logistics planning to ensure seamless execution.' },
                                    { title: 'Technical Execution', text: 'Application of specialist treatments using vetted industry protocols.' },
                                    { title: 'Quality Assurance', text: 'Multi-stage inspection process to verify alignment with project specs.' },
                                    { title: 'Reporting & Handover', text: 'Detailed service reports and facility maintenance recommendations.' }
                                ].map((step, i) => (
                                    <div key={i} className="relative pl-12 border-l-2 border-slate-100">
                                        <div className="absolute -left-[11px] top-0 w-5 h-5 bg-primary rounded-full border-4 border-white shadow-lg"></div>
                                        <h4 className="text-lg font-black text-secondary-dark mb-3">{step.title}</h4>
                                        <p className="text-sm text-slate-500 font-bold leading-relaxed">{step.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3">
                            <div className="bg-secondary-dark p-12 rounded-[2.5rem] text-white sticky top-32 shadow-2xl overflow-hidden relative border border-white/5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-bl-full"></div>
                                <h3 className="text-2xl font-black mb-8 relative z-10 tracking-tight">Request Specification</h3>
                                <p className="text-slate-400 mb-12 font-bold text-sm leading-relaxed">
                                    Interested in implementing our {service.title.toLowerCase()} protocol within your facility? Let's discuss your requirements.
                                </p>
                                <div className="space-y-8 mb-16">
                                    <div className="flex items-center group">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mr-5 group-hover:bg-primary transition-colors duration-500">
                                            <Phone className="w-5 h-5 text-primary group-hover:text-white" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Direct Line</div>
                                            <div className="text-lg font-black">020 1234 5678</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center group">
                                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mr-5 group-hover:bg-primary transition-colors duration-500">
                                            <Mail className="w-5 h-5 text-primary group-hover:text-white" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Email Protocol</div>
                                            <div className="text-lg font-black">hello@nativeshine.co.uk</div>
                                        </div>
                                    </div>
                                </div>
                                <Button onClick={openQuote} variant="primary" size="lg" className="w-full py-5 text-sm uppercase tracking-widest">
                                    Enquire Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cross-Sell */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-2xl font-black text-secondary-dark mb-12 uppercase tracking-widest">Related Specialist Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.filter(s => s.slug !== id).slice(0, 3).map((s, index) => (
                            <Link to={`/services/${s.slug}`} key={s.id} className="group bg-white p-10 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-xl transition-all duration-500">
                                <div>
                                    <h3 className="text-xl font-black text-secondary-dark mb-4 group-hover:text-primary transition-colors tracking-tight">{s.title}</h3>
                                    <p className="text-slate-500 font-bold text-xs mb-8 line-clamp-2">{s.description}</p>
                                </div>
                                <div className="flex items-center text-primary font-black uppercase tracking-widest text-[10px] transform transition-transform group-hover:translate-x-2">
                                    Project Details <ArrowUpRight className="ml-2 w-4 h-4" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ServiceDetail;
