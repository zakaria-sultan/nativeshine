import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { useQuote } from '../../context/QuoteContext';
import { Button } from './Button';

const QuoteModal = () => {
    const { isQuoteOpen, closeQuote } = useQuote();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            closeQuote();
        }, 3000);
    };

    return (
        <AnimatePresence>
            {isQuoteOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeQuote}
                        className="absolute inset-0 bg-secondary-dark/80 backdrop-blur-sm"
                    ></motion.div>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <button
                            onClick={closeQuote}
                            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-primary transition-colors z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col md:flex-row h-full">
                            {/* Form Side */}
                            <div className="w-full p-10 md:p-12">
                                <AnimatePresence mode="wait">
                                    {!isSubmitted ? (
                                        <motion.div
                                            key="form"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <h2 className="text-3xl font-black text-secondary-dark mb-4">Request a Consultation</h2>
                                            <p className="text-slate-500 mb-8 font-bold text-sm">Please provide your details and we'll get back to you within 24 business hours.</p>

                                            <form onSubmit={handleSubmit} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                                        <input required type="text" placeholder="John Doe" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
                                                        <input required type="email" placeholder="john@company.com" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Service Required</label>
                                                    <select className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm">
                                                        <option>Commercial Maintenance</option>
                                                        <option>Floor Restoration</option>
                                                        <option>Bespoke Deep Cleaning</option>
                                                        <option>Specialist Projects</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Project Details</label>
                                                    <textarea rows="3" placeholder="Briefly describe your requirements..." className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-sm"></textarea>
                                                </div>
                                                <Button variant="primary" size="lg" className="w-full mt-4">
                                                    Submit Request <Send className="ml-3 w-4 h-4" />
                                                </Button>
                                            </form>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-8"
                                        >
                                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                                                <CheckCircle2 className="w-10 h-10 text-primary" />
                                            </div>
                                            <h2 className="text-3xl font-black text-secondary-dark mb-4">Request Sent</h2>
                                            <p className="text-slate-500 font-bold">One of our specialist consultants will contact you shortly.</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QuoteModal;
