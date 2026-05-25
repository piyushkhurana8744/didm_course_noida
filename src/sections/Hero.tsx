"use client";

import * as React from "react";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative w-full bg-white pt-[115px] sm:pt-[135px] pb-20 overflow-hidden">
      
      {/* Subtle background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-red/[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/[0.02] rounded-full blur-[80px] pointer-events-none" />

      {/* Edge-to-Edge Full-Width Banner Image */}
      <div className="w-full relative">
        <img
          src="/hero-banner.png"
          alt="DIDM Noida Branch Banner"
          className="w-full h-auto object-cover block"
        />
        {/* Subtle bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Centered Content Below Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 text-center flex flex-col items-center gap-7 relative z-10">
        
        {/* Main Title Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold text-zinc-900 tracking-tight leading-[1.15]"
        >
          "Digital Marketing Training Institute - <span className="text-brand-red">Noida</span>"
        </motion.h1>

        {/* Description Paragraph with Red Highlights */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="text-sm sm:text-base md:text-[17px] text-zinc-500 leading-[1.8] font-medium max-w-5xl text-center"
        >
          <span className="text-brand-red font-bold">Delhi Institute of Digital Marketing (DIDM)</span>, a top digital marketing training provider across India running multiple training center in <span className="text-brand-red font-bold">Delhi/NCR</span> and cover almost every part of the <span className="text-brand-red font-bold">South Delhi</span> | <span className="text-brand-red font-bold">North Delhi</span> | <span className="text-brand-red font-bold">East Delhi</span> | <span className="text-brand-red font-bold">West Delhi</span> | <span className="text-brand-red font-bold">Noida</span> | <span className="text-brand-red font-bold">Gurgaon</span> and other important location both <span className="text-brand-red font-bold">Online & Offline</span> mode with different training program in <span className="text-brand-red font-bold">Digital Marketing Course</span>.
        </motion.p>

        {/* Decorative bottom element */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-20 h-1 bg-gradient-to-r from-brand-red to-red-400 rounded-full"
        />
      </div>

    </section>
  );
};
