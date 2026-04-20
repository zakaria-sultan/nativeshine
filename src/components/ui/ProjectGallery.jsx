import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const projects = [
    {
        title: 'The Ritz Lobby Restoration',
        category: 'Floor Restoration',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Shard Office Maintenance',
        category: 'Commercial Cleaning',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Mayfair Mansion Deep Clean',
        category: 'Residential',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
    },
    {
        title: 'Canary Wharf Window Project',
        category: 'Specialist Services',
        image: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e01a?auto=format&fit=crop&q=80&w=800'
    }
];

const ProjectGallery = () => {
    return (
        <section className="py-24 bg-slate-50">
            <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div className="max-w-2xl">
                        <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">Our Portfolio</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-secondary-dark tracking-tight">Recent Projects</h3>
                    </div>
                    <button className="mt-8 md:mt-0 text-primary font-black uppercase tracking-widest text-sm hover:text-primary-dark transition-colors flex items-center">
                        View Case Studies <ExternalLink className="ml-2 w-4 h-4" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative h-[400px] overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
                        >
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary-dark via-transparent to-transparent opacity-90"></div>
                            <div className="absolute bottom-0 left-0 p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <span className="text-primary-light font-black text-xs uppercase tracking-widest mb-2 block">{project.category}</span>
                                <h4 className="text-2xl font-black text-white">{project.title}</h4>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProjectGallery;
