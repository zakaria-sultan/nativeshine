import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { servicesData } from '../../data/servicesData';

const QuoteModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Prepare WhatsApp link
        const whatsappMessage = `Hello NativeShine, I would like a quote for ${formData.service || 'a service'}. My name is ${formData.name}.`;
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/447477134380?text=${encodedMessage}`; // Using actual number from footer if available, otherwise just wa.me

        // Show success
        setIsSubmitted(true);

        // Redirect after delay
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
            onClose();
            setIsSubmitted(false);
            setFormData({ name: '', email: '', phone: '', service: '', message: '' });
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-white shadow-2xl overflow-hidden rounded-sm"
                >
                    {isSubmitted ? (
                        <div className="p-12 text-center py-24">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto mb-6 animate-bounce">
                                <Check size={40} />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 mb-4">Request Sent!</h2>
                            <p className="text-slate-500 font-medium">Redirecting you to WhatsApp for instant connection...</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-[#0ea5e9] p-8 text-white relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-white/80">Get a Free Quote</h4>
                                <h2 className="text-3xl font-black uppercase tracking-tighter">Project Enquiry</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-[#0ea5e9] focus:outline-none transition-colors font-medium"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            required
                                            type="email"
                                            placeholder="Email Address"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-[#0ea5e9] focus:outline-none transition-colors font-medium"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="Phone Number"
                                            className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-[#0ea5e9] focus:outline-none transition-colors font-medium"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                    <select
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-[#0ea5e9] focus:outline-none transition-colors font-medium appearance-none"
                                        value={formData.service}
                                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                    >
                                        <option value="">Select Service Required</option>
                                        {servicesData.map(service => (
                                            <option key={service.id} value={service.title}>{service.title}</option>
                                        ))}
                                    </select>
                                    <textarea
                                        rows="4"
                                        placeholder="Tell us about your project..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-[#0ea5e9] focus:outline-none transition-colors font-medium resize-none"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#0ea5e9] text-white py-5 font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl shadow-cyan-500/20"
                                >
                                    Send Enquiry & Message Us
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default QuoteModal;
