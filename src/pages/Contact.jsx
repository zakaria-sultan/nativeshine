import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';

const Contact = () => {
    return (
        <div className="w-full">
            {/* Header */}
            <section className="bg-secondary-dark pt-32 pb-24 relative overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-sm font-black text-primary-light uppercase tracking-[0.4em] mb-6">Global Contact</h1>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                            Connect with Our <span className="text-primary-light">Experts</span>.
                        </h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
                            Available 24/7 for specialist consultations and emergency restoration services across Greater London.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-20">
                        {/* Form Side */}
                        <div className="w-full lg:w-3/5">
                            <div className="bg-slate-50 p-10 md:p-16 rounded-[3rem] border border-slate-100">
                                <h3 className="text-3xl font-black text-secondary-dark mb-10 tracking-tight">Send a Secure Message</h3>
                                <form className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Identity</label>
                                            <input required type="text" placeholder="Johnathan Doe" className="w-full px-6 py-4 rounded-xl bg-white border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-sm" />
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Professional Email</label>
                                            <input required type="email" placeholder="j.doe@organisation.com" className="w-full px-6 py-4 rounded-xl bg-white border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Inquiry Specification</label>
                                        <select className="w-full px-6 py-4 rounded-xl bg-white border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-sm">
                                            <option>Bespoke Maintenance Contract</option>
                                            <option>Industrial Restoration Project</option>
                                            <option>Emergency Facility Support</option>
                                            <option>General Corporate Inquiry</option>
                                        </select>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Project Particulars</label>
                                        <textarea required rows="5" placeholder="Define the scope of your requirements..." className="w-full px-6 py-4 rounded-xl bg-white border border-slate-100 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold text-sm"></textarea>
                                    </div>
                                    <Button variant="primary" size="lg" className="w-full py-6 text-sm uppercase tracking-[0.2em]">
                                        Transmit Message <Send className="ml-4 w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>

                        {/* Info Side */}
                        <div className="w-full lg:w-2/5">
                            <div className="space-y-16">
                                <div>
                                    <h4 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-10">Direct Channels</h4>
                                    <div className="space-y-8">
                                        <div className="flex items-center group">
                                            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-primary transition-colors duration-500">
                                                <Phone className="w-6 h-6 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Corporate Hotline</div>
                                                <div className="text-xl font-black text-secondary-dark">020 1234 5678</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center group">
                                            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-primary transition-colors duration-500">
                                                <Mail className="w-6 h-6 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Electronic Mail</div>
                                                <div className="text-xl font-black text-secondary-dark">hello@nativeshine.co.uk</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center group">
                                            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mr-6 group-hover:bg-primary transition-colors duration-500">
                                                <MessageCircle className="w-6 h-6 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rapid WhatsApp</div>
                                                <div className="text-xl font-black text-secondary-dark">+44 7123 456789</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-10">Primary Office</h4>
                                    <div className="flex items-start group">
                                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mr-6 shrink-0 group-hover:bg-primary transition-colors duration-500">
                                            <MapPin className="w-6 h-6 text-primary group-hover:text-white" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">London Headquarters</div>
                                            <div className="text-lg font-black text-secondary-dark leading-relaxed">
                                                St Magnus House, 3 Lower Thames St<br />London, EC3R 6HE, United Kingdom
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mini Map Placeholder */}
                                <div className="h-64 bg-slate-100 rounded-[2.5rem] overflow-hidden border border-slate-200 relative">
                                    <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-0.086,51.508,13,0/600x300?access_token=pk.xxx')] bg-cover opacity-50 grayscale"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="p-4 bg-white shadow-2xl rounded-2xl text-center">
                                            <div className="w-3 h-3 bg-primary rounded-full mx-auto animate-ping mb-2"></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Operational Hub</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
