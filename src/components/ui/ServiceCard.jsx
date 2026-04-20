import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const ServiceCard = ({ service, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={service.imageThumbnail}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-primary/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                        Specialist Division
                    </span>
                </div>
            </div>

            <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-2xl font-black text-secondary-dark mb-4 group-hover:text-primary transition-colors">
                    {service.title}
                </h3>
                <p className="text-slate-500 font-bold text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                    {service.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <Link
                        to={`/services/${service.slug}`}
                        className="text-primary font-black text-xs uppercase tracking-widest flex items-center hover:text-primary-dark transition-colors"
                    >
                        Explore Service <ArrowUpRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default ServiceCard;
