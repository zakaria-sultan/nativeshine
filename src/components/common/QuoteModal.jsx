import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useServices } from "../../context/ServicesContext";
import { useToast } from "../../context/ToastContext";
import {
  validateQuoteForm,
  hasValidationErrors,
} from "../../lib/contactFormValidation";
import { submitEnquiryEmail } from "../../lib/submitEnquiryEmail";

const emptyForm = () => ({
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
});

const QuoteModal = ({ isOpen, onClose }) => {
  const { services: servicesData } = useServices();
  const { showToast } = useToast();
  const [formData, setFormData] = useState(emptyForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSending, setIsSending] = useState(false);

  const handleClose = () => {
    if (isSending) return;
    setFormData(emptyForm());
    setFieldErrors({});
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateQuoteForm(formData);
    setFieldErrors(errors);
    if (hasValidationErrors(errors)) {
      showToast("Please fix the highlighted fields and try again.", "error");
      return;
    }

    setIsSending(true);
    try {
      await submitEnquiryEmail(formData, { formLabel: "Get a Quote (modal)" });
      showToast(
        "Thank you! Your message has been sent successfully.",
        "success",
      );
      setFormData(emptyForm());
      setFieldErrors({});
      setTimeout(() => onClose(), 600);
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
        "error",
      );
    } finally {
      setIsSending(false);
    }
  };

  const clearFieldError = (key) => {
    setFieldErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white shadow-2xl overflow-hidden rounded-sm max-h-[90vh] overflow-y-auto"
        >
          <div className="bg-[#0ea5e9] p-8 text-white relative">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSending}
              className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-white/80">
              Get a Free Quote
            </h4>
            <h2 className="text-3xl font-black uppercase tracking-tighter">
              Project Enquiry
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5" noValidate>
            <div className="space-y-4">
              <div>
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  disabled={isSending}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-[#0ea5e9] focus:outline-none transition-colors font-medium disabled:opacity-60"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    clearFieldError("name");
                  }}
                  aria-invalid={!!fieldErrors.name}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-xs font-bold text-red-600">
                    {fieldErrors.name}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    autoComplete="email"
                    disabled={isSending}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-[#0ea5e9] focus:outline-none transition-colors font-medium disabled:opacity-60"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      clearFieldError("email");
                    }}
                    aria-invalid={!!fieldErrors.email}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs font-bold text-red-600">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    required
                    type="tel"
                    placeholder="Phone Number"
                    autoComplete="tel"
                    disabled={isSending}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-[#0ea5e9] focus:outline-none transition-colors font-medium disabled:opacity-60"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }));
                      clearFieldError("phone");
                    }}
                    aria-invalid={!!fieldErrors.phone}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs font-bold text-red-600">
                      {fieldErrors.phone}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <select
                  required
                  disabled={isSending}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-[#0ea5e9] focus:outline-none transition-colors font-medium appearance-none disabled:opacity-60"
                  value={formData.service}
                  onChange={(e) => {
                    setFormData({ ...formData, service: e.target.value });
                    clearFieldError("service");
                  }}
                  aria-invalid={!!fieldErrors.service}
                >
                  <option value="">Select Service Required</option>
                  {servicesData.map((service) => (
                    <option key={service.id} value={service.title}>
                      {service.title}
                    </option>
                  ))}
                </select>
                {fieldErrors.service && (
                  <p className="mt-1 text-xs font-bold text-red-600">
                    {fieldErrors.service}
                  </p>
                )}
              </div>
              <div>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your project..."
                  disabled={isSending}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:border-[#0ea5e9] focus:outline-none transition-colors font-medium resize-none disabled:opacity-60"
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    clearFieldError("message");
                  }}
                  aria-invalid={!!fieldErrors.message}
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-xs font-bold text-red-600">
                    {fieldErrors.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-[#0ea5e9] text-white py-5 font-black uppercase tracking-widest text-xs hover:bg-slate-900 transition-all shadow-xl shadow-cyan-500/20 disabled:opacity-70 disabled:pointer-events-none inline-flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="animate-spin" size={18} aria-hidden />
                  Sending...
                </>
              ) : (
                "Send Enquiry"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuoteModal;
