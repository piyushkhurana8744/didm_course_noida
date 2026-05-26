"use client";

import * as React from "react";
import { Menu, X, CalendarRange, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/useScroll";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
  onOpenDemo: () => void;
}

export const Header = ({ onOpenDemo }: HeaderProps) => {
  const { isScrolled } = useScroll(20);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { label: "Home", href: "#" },
    { label: "Highlights", href: "#highlights" },
    { label: "Curriculum", href: "#curriculum" },
    { label: "Pricing", href: "#pricing" },
    { label: "Placements", href: "#placements" },
    { label: "FAQ", href: "#faq" },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 border-b border-zinc-200/85 backdrop-blur-md py-2 shadow-md"
            : "bg-white/85 border-b border-zinc-150 backdrop-blur-sm py-3 sm:py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logos Panel */}
            <div className="flex items-center">
              <a
                href="#"
                onClick={(e) => handleNavClick(e, "#")}
                className="flex items-center group cursor-pointer focus:outline-none"
              >
                <img
                  src="https://res.cloudinary.com/dnfz4jwam/image/upload/v1779780063/didm-logo-reg_gaianm.png"
                  alt="DIDM Logo"
                  className="h-13 sm:h-15 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
                />
              </a>

              {/* Vertical divider and MSME Logo */}
              <div className="h-8 sm:h-9 w-px bg-zinc-300 mx-4 hidden xs:block" />
              
              <img
                src="/msme logo.png"
                alt="MSME Logo"
                className="h-8 sm:h-10 md:h-11 w-auto object-contain hidden xs:block"
              />
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-zinc-800 hover:text-brand-red hover:bg-zinc-50 text-[13px] sm:text-sm font-bold tracking-wide px-3 py-2 rounded-xl transition-all duration-300 relative group"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-3 right-3 h-[2px] bg-brand-red scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center rounded-full" />
                </a>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden lg:flex items-center gap-5">
              <a
                href="tel:+918447222054"
                className="flex items-center gap-2 text-zinc-800 hover:text-brand-red transition-all duration-300 font-extrabold text-sm border-r border-zinc-200 pr-5"
              >
                <Phone className="h-4 w-4 text-brand-red animate-pulse" />
                <span>84472 22054</span>
              </a>
              <Button
                variant="primary"
                size="md"
                className="flex items-center gap-2 shadow-md shadow-brand-red/15 py-3 px-5 text-sm"
                onClick={onOpenDemo}
              >
                <CalendarRange className="h-4 w-4" />
                <span>Free Demo Class</span>
              </Button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* MSME logo shown on mobile next to menu if screen is small */}
              <img
                src="/msme logo.png"
                alt="MSME Logo"
                className="h-7 w-auto object-contain xs:hidden mr-2"
              />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-zinc-650 hover:text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-lg cursor-pointer"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Dark overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
            />
            {/* Drawer Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring" as const, bounce: 0.1, duration: 0.4 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white border-l border-zinc-200 z-30 p-6 flex flex-col justify-between lg:hidden pt-32"
            >
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-150 pb-2">
                  Navigation
                </span>
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="text-zinc-700 hover:text-brand-red hover:bg-zinc-50 py-3 px-4 rounded-xl text-base font-semibold transition-all text-left"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="flex flex-col gap-3 mt-8 border-t border-zinc-200 pt-6">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full flex items-center justify-center gap-2 font-bold"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDemo();
                  }}
                >
                  <CalendarRange className="h-4 w-4" />
                  <span>Free Demo Class</span>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
