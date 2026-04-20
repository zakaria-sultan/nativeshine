import React from "react";
import { ShieldCheck, Target, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  {
    icon: ShieldCheck,
    title: "Full Compliance",
    description:
      "Fully insured and certified to meet the highest industry standards for safety and quality.",
  },
  {
    icon: Target,
    title: "Strategic Approach",
    description:
      "Bespoke maintenance plans tailored to your specific facility requirements and business goals.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description:
      "Round-the-clock support and rapid response for urgent restoration and cleaning needs.",
  },
  {
    icon: Zap,
    title: "Advanced Tech",
    description:
      "Leveraging state-of-the-art equipment and eco-friendly chemical solutions for superior results.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-8 bg-white">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h2 className="text-sm font-black text-primary uppercase tracking-[0.3em] mb-4">
            Core Values
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-secondary-dark mb-6 tracking-tight">
            The NativeShine Advantage
          </h3>
          <p className="text-lg text-slate-500 font-medium">
            We combine decades of experience with a commitment to excellence
            that sets us apart in the London restoration market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-xl transition-all duration-500 group"
            >
              <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500">
                <reason.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" />
              </div>
              <h4 className="text-xl font-black text-secondary-dark mb-4">
                {reason.title}
              </h4>
              <p className="text-slate-500 font-bold text-sm leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
