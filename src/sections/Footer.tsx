"use client";

import * as React from "react";
import { Mail, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast(`Email ${email} successfully subscribed to our marketing newsletter!`, "success");
    setEmail("");
  };

  const quickLinks = [
    { label: "Home", href: "#" },
    { label: "Highlights", href: "#highlights" },
    { label: "Curriculum", href: "#curriculum" },
    { label: "Pricing Options", href: "#pricing" },
    { label: "Student Testimonials", href: "#reviews" },
    { label: "FAQ Portal", href: "#faq" },
  ];

  const coursesLinks = [
    { label: "SEO Mastery", href: "#curriculum" },
    { label: "Google PPC Search", href: "#curriculum" },
    { label: "Meta Advertising", href: "#curriculum" },
    { label: "Social Media Strategy", href: "#curriculum" },
    { label: "Content & Copywriting", href: "#curriculum" },
    { label: "AI & Automation Tools", href: "#curriculum" },
  ];

  return (
    <footer className="bg-[#c90c0c] text-white pt-20 pb-10 text-left relative overflow-hidden">
      {/* Footer background glows */}
      <div className="absolute bottom-0 right-0 w-84 h-84 rounded-full bg-white/5 blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-16 border-b border-white/20">
          
          {/* Logo & Bio Column */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="bg-white px-3 py-1.5 rounded-xl flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_150/v1779780063/didm-logo-reg_gaianm.png"
                  alt="DIDM Logo"
                  width={150}
                  height={48}
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              </div>
            </div>
            <p className="text-sm text-red-100 leading-relaxed max-w-sm font-medium">
              We are Noida's premier growth marketing academy training students, executives, and agency owners to lead performance campaigns using modern AI methodologies.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Sparkles className="h-4 w-4 text-white animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">
                ISO 9001:2015 Certified Campus
              </span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest border-l-2 border-white pl-2">
              Explore
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-sm text-red-100 hover:text-white transition-colors duration-250 font-semibold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses Links Column */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest border-l-2 border-white pl-2">
              Modules
            </h4>
            <ul className="flex flex-col gap-3">
              {coursesLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-sm text-red-100 hover:text-white transition-colors duration-250 font-semibold"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / Contact Column */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-widest border-l-2 border-white pl-2">
              Stay Updated
            </h4>
            <p className="text-xs text-red-100 leading-relaxed font-semibold">
              Subscribe to get modern marketing updates, trends, and course discount options direct to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex gap-2 mt-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-transparent rounded-lg py-2.5 pl-9 pr-3 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
              </div>
              <Button
                variant="secondary"
                size="sm"
                type="submit"
                className="px-3 shrink-0 py-2.5 rounded-lg flex items-center justify-center cursor-pointer shadow-md bg-zinc-950 hover:bg-zinc-900 border-none"
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </form>
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10 text-xs text-red-200 font-semibold">
          <p>© {new Date().getFullYear()} Noida Digital Marketing Institute. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
