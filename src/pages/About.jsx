import React from "react";
import { motion } from "framer-motion";
import { Shield, Target, Users, CheckCircle2 } from "lucide-react";

const About = () => {
  return (
    <div className="flex w-full flex-col bg-white">
      {/* Hero Section */}
      <section className="-mt-24 pt-28 pb-6 bg-[#F9F9F9] border-b border-slate-100">
        <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="max-w-4xl">
            <h4 className="text-[#00AEEF] font-black uppercase tracking-[0.3em] text-xs sm:text-sm mb-4 md:mb-6">
              Our Heritage
            </h4>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-5 md:mb-8 tracking-tighter uppercase leading-tight">
              Preserving London's <br />
              <span className="text-[#0ea5e9]">Architectural Excellence</span>.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-500 leading-relaxed max-w-2xl font-medium">
              Operating at the intersection of heritage preservation and modern
              technical innovation, NativeShine Services is London's premier
              restoration firm.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
                Setting the <br /> National Standard
              </h2>
              <div className="space-y-4 md:space-y-6 text-base md:text-lg text-slate-500 font-medium leading-relaxed">
                <p>
                  Founded in 2004, NativeShine Services was established with a
                  singular vision: to provide the highest level of architectural
                  restoration and maintenance for the capital's most prestigious
                  properties.
                </p>
                <p>
                  Our approach is rooted in a deep respect for materials and
                  craftsmanship. Whether we are restoring a Grade I listed
                  facade or maintaining a contemporary commercial interior, we
                  apply the same rigorous standards of precision and care.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 w-full">
              <div className="p-6 md:p-10 bg-white border border-slate-100 shadow-sm rounded-sm">
                <div className="w-12 h-12 bg-[#00AEEF]/10 flex items-center justify-center text-[#00AEEF] mb-6">
                  <Target size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-4 uppercase">
                  Our Mission
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  To deliver unparalleled restoration through technical
                  precision and uncompromising quality management.
                </p>
              </div>
              <div className="p-6 md:p-10 bg-[#00AEEF] shadow-xl text-white rounded-sm">
                <div className="w-12 h-12 bg-white/20 flex items-center justify-center text-white mb-6">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-black text-white mb-4 uppercase">
                  Integrity
                </h3>
                <p className="text-sm text-white/90 font-medium leading-relaxed">
                  We operate with complete transparency, providing detailed
                  assessments and honest results on every project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="ns-page-last pt-8 pb-16 bg-[#F9F9F9]">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
            OUR CORE VALUES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Specialist Experts",
                text: "A team of highly vetted technicians with deep domain knowledge in stone and heritage care.",
              },
              {
                icon: CheckCircle2,
                title: "Verified Quality",
                text: "Rigorous inspection protocols following ISO quality standards for 100% satisfaction.",
              },
              {
                icon: Shield,
                title: "Fully Accredited",
                text: "CSCS qualified, fully insured, and accredited by major industry governing bodies.",
              },
            ].map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#00AEEF]/20 flex items-center justify-center text-[#00AEEF] mb-6">
                  <v.icon size={32} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-4 uppercase">
                  {v.title}
                </h4>
                <p className="text-slate-500 font-medium">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
