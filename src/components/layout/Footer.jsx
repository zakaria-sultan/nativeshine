import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, Globe, Users, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import { services } from '../../data/services';
import logo from '../../assets/logo.png';

const Footer = () => {
    return (
        <footer className="bg-secondary-dark text-white pt-24 pb-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Company Info */}
                    <div>
                        <div className="h-16 flex items-center gap-3 mb-8">
                            <img src={logo} alt="NativeShine Logo" className="h-full brightness-0 invert" />
                            <div className="text-xl font-black tracking-tight">
                                NATIVESHINE <span className="text-primary-light">LTD</span>
                            </div>
                        </div>
                        <p className="text-slate-400 mb-10 leading-relaxed font-light">
                            Excellence in corporate and residential cleaning solutions. We set the standard for professional restoration and maintenance across London.
                        </p>
                        <div className="flex space-x-4">
                            {[Share2, Globe, Users, MessageCircle].map((Icon, i) => (
                                <a key={i} href="#" className="p-3 bg-white/5 hover:bg-primary hover:text-white rounded-lg transition-all duration-300 border border-white/5">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-black mb-8 text-white uppercase tracking-[0.2em]">Navigation</h4>
                        <ul className="space-y-4">
                            {['Home', 'About Us', 'Contact Us', 'Privacy Policy'].map((item) => (
                                <li key={item}>
                                    <Link to={`/${item.toLowerCase().replace(' ', '-')}`} className="text-slate-400 hover:text-primary-light transition-colors duration-300 flex items-center text-sm font-bold">
                                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-sm font-black mb-8 text-white uppercase tracking-[0.2em]">Core Services</h4>
                        <ul className="space-y-4">
                            {services.slice(0, 5).map((service) => (
                                <li key={service.id}>
                                    <Link to={`/services/${service.slug}`} className="text-slate-400 hover:text-primary-light transition-colors duration-300 flex items-center text-sm font-bold">
                                        <span className="w-1.5 h-1.5 bg-primary/40 rounded-full mr-3"></span>
                                        {service.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-sm font-black mb-8 text-white uppercase tracking-[0.2em]">Headquarters</h4>
                        <ul className="space-y-6">
                            <li className="flex items-start">
                                <MapPin className="w-5 h-5 text-primary-light mr-4 shrink-0" />
                                <span className="text-slate-400 text-sm font-medium leading-relaxed">
                                    St Magnus House, 3 Lower Thames St<br />London, EC3R 6HE, UK
                                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="w-5 h-5 text-primary-light mr-4 shrink-0" />
                                <span className="text-slate-400 text-sm font-bold">020 1234 5678</span>
                            </li>
                            <li className="flex items-center">
                                <Mail className="w-5 h-5 text-primary-light mr-4 shrink-0" />
                                <span className="text-slate-400 text-sm font-bold">hello@nativeshine.co.uk</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-slate-500 text-[11px] font-black uppercase tracking-widest">
                    <p>© {new Date().getFullYear()} NATIVESHINE LTD. COMPANY REG NO. 12345678.</p>
                    <div className="flex space-x-8 mt-6 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Compliance</a>
                        <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
