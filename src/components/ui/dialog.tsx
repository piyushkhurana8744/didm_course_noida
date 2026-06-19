"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: "default" | "form";
}

export const Dialog = ({ isOpen, onClose, title, children, variant = "default" }: DialogProps) => {
  // Prevent background scrolling when open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring" as const, duration: 0.45, bounce: 0.15 }}
            className={`relative w-full ${
              variant === "form"
                ? "max-w-[380px] bg-[#f8f9fa] rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]"
                : "max-w-lg bg-white rounded-2xl shadow-[var(--shadow-xl)]"
            } z-10 overflow-hidden ring-1 ring-black/[0.05]`}
          >
            {variant === "form" ? (
              <>
                {/* Close button absolute-positioned on the top-right of the form header */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-200 cursor-pointer z-30"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
                <div className="max-h-[90vh] overflow-y-auto no-scrollbar">{children}</div>
              </>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-100">
                  {title && <h3 className="text-lg font-bold text-zinc-900 tracking-tight">{title}</h3>}
                  <button
                    onClick={onClose}
                    className="text-zinc-400 hover:text-zinc-700 bg-zinc-100 hover:bg-zinc-200 p-2 rounded-xl transition-all duration-200 cursor-pointer"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[75vh] overflow-y-auto no-scrollbar">{children}</div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
