import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { servicesData } from "../data/servicesData";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const whatsappMessage = `Hello NativeShine, I would like a quote for ${formData.service || "a service"}. My name is ${formData.name}.`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/447477134380?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="flex w-full flex-col bg-white font-sans">
      <section className="pt-8 pb-12">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16">
            {/* Form Side */}
            <div className="lg:w-2/3">
              <div className="bg-white p-6 sm:p-8 md:p-12 lg:p-16 border border-slate-100 shadow-xl rounded-sm">
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 md:mb-8 uppercase tracking-tighter font-montserrat">
                  Submit an <span className="text-[#0ea5e9]">Enquiry</span>
                </h3>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 md:space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0ea5e9]">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        className="w-full bg-slate-50 border border-slate-100 p-5 rounded-sm font-bold text-sm focus:border-[#0ea5e9] outline-none transition-all"
                        placeholder="Enter name..."
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0ea5e9]">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        className="w-full bg-slate-50 border border-slate-100 p-5 rounded-sm font-bold text-sm focus:border-[#0ea5e9] outline-none transition-all"
                        placeholder="email@address.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0ea5e9]">
                      Service Required
                    </label>
                    <div className="relative">
                      <select
                        required
                        className="w-full bg-slate-50 border border-slate-100 p-5 rounded-sm font-bold text-sm focus:border-[#0ea5e9] outline-none transition-all appearance-none cursor-pointer"
                        value={formData.service}
                        onChange={(e) =>
                          setFormData({ ...formData, service: e.target.value })
                        }
                      >
                        <option value="">Select Service Required</option>
                        {servicesData.map((service) => (
                          <option key={service.id} value={service.title}>
                            {service.title}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <Send size={14} className="rotate-90" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0ea5e9]">
                      Message Details
                    </label>
                    <textarea
                      required
                      rows="6"
                      className="w-full bg-slate-50 border border-slate-100 p-5 rounded-sm font-bold text-sm focus:border-[#0ea5e9] outline-none transition-all resize-none"
                      placeholder="How can we help you?"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#0ea5e9] text-white py-6 font-black text-xs uppercase tracking-[0.4em] rounded-sm hover:bg-slate-900 transition-all flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/20 active:scale-95"
                  >
                    Send Message <Send size={18} />
                  </button>
                </form>
              </div>
            </div>

            {/* Info Side */}
            <div className="lg:w-1/3 space-y-6 md:space-y-8">
              <div className="p-6 sm:p-8 md:p-12 bg-slate-900 text-white rounded-sm shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 transform rotate-12 opacity-5 translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                  <MessageCircle size={160} />
                </div>
                <h3 className="text-xl sm:text-2xl font-black mb-6 md:mb-10 uppercase tracking-tighter italic border-b border-white/10 pb-4 font-montserrat">
                  Direct <span className="text-[#0ea5e9]">Contact</span>
                </h3>
                <div className="space-y-6 md:space-y-10 relative z-10">
                  <div className="flex gap-6 group cursor-pointer items-center">
                    <div className="w-14 h-14 bg-white/5 flex items-center justify-center text-[#0ea5e9] transform group-hover:bg-[#0ea5e9] group-hover:text-white transition-all ring-1 ring-white/10 group-hover:ring-transparent">
                      <Phone size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#0ea5e9] mb-1">
                        Head Office
                      </p>
                      <p className="font-black text-xl tracking-tighter">
                        020 3642 1152{" "}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 group cursor-pointer items-center">
                    <div className="w-14 h-14 bg-white/5 flex items-center justify-center text-[#0ea5e9] transform group-hover:bg-[#0ea5e9] group-hover:text-white transition-all ring-1 ring-white/10 group-hover:ring-transparent">
                      <Mail size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#0ea5e9] mb-1">
                        Enquiries
                      </p>
                      <p className="font-black text-xl tracking-tighter">
                        info@nativeshine.co.uk
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-6 group cursor-pointer items-center border-t border-white/5 pt-6 md:pt-10">
                    <div className="w-14 h-14 bg-[#0ea5e9]/10 flex items-center justify-center text-[#0ea5e9] transform group-hover:bg-[#0ea5e9] group-hover:text-white transition-all ring-1 ring-[#0ea5e9]/20">
                      <MessageCircle size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#0ea5e9] mb-1">
                        Fast Response
                      </p>
                      <p className="font-black text-xl tracking-tighter">
                        07777 143488
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 md:p-12 bg-white border border-slate-100 rounded-sm shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                <div className="w-16 h-16 bg-[#0ea5e9]/5 flex items-center justify-center text-[#0ea5e9] shrink-0">
                  <MapPin size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-2">
                    Our Location
                  </h4>
                  <p className="text-sm text-slate-500 font-bold leading-relaxed">
                    9 Roswick Albany street <br /> London nw1 4bj
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ns-page-last px-4 sm:px-6 pb-16 max-w-7xl mx-auto w-full">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 text-center md:text-left">
          Find <span className="text-[#0ea5e9]">Us</span>
        </h3>
        <p className="text-slate-500 text-sm font-medium text-center md:text-left mb-6 max-w-2xl">
          9 Roswick Albany street London nw1 4bj
        </p>
        <div className="rounded-2xl shadow-lg border-4 border-white overflow-hidden grayscale hover:grayscale-0 transition-[filter] duration-500">
          <iframe
            title="NativeShine office location — Albany street, London"
            src="https://www.google.com/maps?q=9+Roswick+Albany+street+London+nw1+4bj&output=embed"
            width="100%"
            height="450"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full border-0 block"
          />
        </div>
      </section>
    </div>
  );
};

export default Contact;
