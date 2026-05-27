"use client";

import * as React from "react";
import { Phone, Laptop, Share2 } from "lucide-react";

interface DigitalCareerStartProps {
  onOpenDemo?: (courseName: string) => void;
}

export const DigitalCareerStart = ({ onOpenDemo }: DigitalCareerStartProps) => {
  return (
    <section className="py-20 bg-white border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h2 className="text-2xl sm:text-3.5xl font-black text-center text-[#c90c0c] mb-14 tracking-tight">
          Let Your Digital Career Begins Now....
        </h2>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Talk to a Career Advisor */}
          <div className="bg-white border border-zinc-150 rounded-2xl p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-[#c90c0c] mb-6">
              <Phone className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 mb-2">
              Talk to a Career Advisor
            </h3>
            <p className="text-zinc-500 text-xs sm:text-sm font-semibold mb-1 max-w-xs">
              Get to understand what to learn & how it will help you
            </p>
            <p className="text-brand-red font-black text-base mb-6">
              84472 22054
            </p>
            <a
              href="tel:+918447222054"
              className="bg-[#c90c0c] hover:bg-[#b00a0a] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-3 rounded-full shadow-sm hover:shadow transition-all cursor-pointer inline-block text-center"
            >
              Talk to Advisor
            </a>
          </div>

          {/* Card 2: Attend a Free Demo Session */}
          <div className="bg-white border border-zinc-150 rounded-2xl p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-[#c90c0c] mb-6">
              <Laptop className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 mb-2">
              Attend a Free Demo Session
            </h3>
            <p className="text-zinc-500 text-xs sm:text-sm font-semibold mb-8 max-w-xs">
              Get to understand what to learn & how it will help you
            </p>
            <button
              onClick={() => onOpenDemo?.("Free Demo Session")}
              className="bg-[#c90c0c] hover:bg-[#b00a0a] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-3 rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Registered for Free Demo
            </button>
          </div>

          {/* Card 3: Apply Now */}
          <div className="bg-white border border-zinc-150 rounded-2xl p-8 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-[#c90c0c] mb-6">
              <Share2 className="h-8 w-8 fill-current" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 mb-2">
              Apply Now
            </h3>
            <p className="text-zinc-500 text-xs sm:text-sm font-semibold mb-8 max-w-xs">
              Get to understand what to learn & how it will help you
            </p>
            <button
              onClick={() => onOpenDemo?.("Regular Admission")}
              className="bg-[#c90c0c] hover:bg-[#b00a0a] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-3 rounded-full shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Enroll Now
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
