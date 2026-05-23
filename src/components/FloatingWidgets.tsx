"use client";

import * as React from "react";
import { MessageSquare, ArrowUp, Phone, CalendarDays } from "lucide-react";
import { useScroll } from "@/hooks/useScroll";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FloatingWidgetsProps {
  onOpenDemo: () => void;
}

export const FloatingWidgets = ({ onOpenDemo }: FloatingWidgetsProps) => {
  const { isScrolled, scrollProgress } = useScroll(300);

  const handleWhatsApp = () => {
    const message = "Hi! I am interested in the Digital Marketing Course at Noida campus. Please share details.";
    const url = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Scroll Progress Bar at the top of the page */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-900 z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-brand-red to-red-500 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Action Buttons (WhatsApp + Back to top) */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* WhatsApp Floating Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleWhatsApp}
          className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20 cursor-pointer border border-emerald-500/20"
        >
          {/* Custom WhatsApp Icon or MessageSquare */}
          <MessageSquare className="h-6 w-6 text-white fill-white" />
        </motion.button>

        {/* Back To Top Button */}
        <AnimatePresence>
          {isScrolled && (
            <motion.button
              initial={{ opacity: 0, y: 15, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.8 }}
              onClick={handleBackToTop}
              className="w-14 h-14 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center shadow-xl cursor-pointer"
            >
              <ArrowUp className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky Mobile CTA Bar at the very bottom (visible only on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-md px-4 py-3 flex gap-3 shadow-2xl">
        <Button
          variant="outline"
          size="md"
          className="flex-1 flex items-center justify-center gap-2 border-zinc-800 bg-zinc-900 text-zinc-300"
          onClick={() => window.open("tel:+919876543210")}
        >
          <Phone className="h-4 w-4 text-brand-red shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider">Call Now</span>
        </Button>
        <Button
          variant="primary"
          size="md"
          className="flex-1 flex items-center justify-center gap-2"
          onClick={onOpenDemo}
        >
          <CalendarDays className="h-4 w-4 shrink-0" />
          <span className="text-xs font-bold uppercase tracking-wider">Book Free Demo</span>
        </Button>
      </div>
    </>
  );
};
