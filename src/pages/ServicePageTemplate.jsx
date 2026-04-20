import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle2,
} from 'lucide-react';
import { servicesData } from '../data/servicesData';
import RecentWorks from '../components/services/RecentWorks';

const ServicePageTemplate = () => {
    const { slug } = useParams();

    const service = servicesData.find(s => s.slug === slug);

    if (!service) {
        return <Navigate to="/services" replace />;
    }

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
        <div className="flex w-full flex-col bg-white">
            {/* Hero Header — short fixed block on mobile/tablet; taller from md up */}
            <section className="h-[550px] -mt-24 md:-mt-32 relative bg-slate-900 overflow-hidden flex items-end md:items-center">
                <div className="absolute inset-0 z-0">
                    <img
                        src={service.imageHero}
                        alt=""
                        className="ns-service-hero-img w-full h-full object-cover object-top opacity-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/50 to-slate-900/30" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full py-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl rounded-sm bg-slate-950/55 backdrop-blur-md px-5 py-6 sm:px-8 sm:py-8 border-l-4 md:border-l-8 border-[#0ea5e9] shadow-lg"
                    >
                        <h4 className="text-[#0ea5e9] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-sm mb-2 md:mb-4 italic">
                            Specialist Services
                        </h4>
                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter font-montserrat leading-[1.1] pr-2">
                            {service.title}
                        </h1>
                    </motion.div>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-8">
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
                            <div className="mt-8 pt-8 border-t border-slate-100 flex flex-wrap gap-6 items-center">
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

            <RecentWorks serviceSlug={service.slug} serviceTitle={service.title} />
        </div>
    );
};

export default ServicePageTemplate;
