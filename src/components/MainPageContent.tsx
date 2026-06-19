"use client";

import * as React from "react";
import { Header } from "@/sections/Header";
import { Hero } from "@/sections/Hero";
import { ProgramHighlights } from "@/sections/ProgramHighlights";
import { VideoCounselling } from "@/sections/VideoCounselling";
import { CourseOverview } from "@/sections/CourseOverview";
import { CoursePrograms } from "@/sections/CoursePrograms";
import { TrainingSchedule } from "@/sections/TrainingSchedule";
import { CoveredModules } from "@/sections/CoveredModules";
import { CoveredModulesTabs } from "@/sections/CoveredModulesTabs";
import { ComparisonTable } from "@/sections/ComparisonTable";
import { FAQ } from "@/sections/FAQ";
import { StudentFeedback } from "@/sections/StudentFeedback";
import { StudentsCorner } from "@/sections/StudentsCorner";
import { StudentsHappyFaces } from "@/sections/StudentsHappyFaces";
import { DigitalCareerStart } from "@/sections/DigitalCareerStart";
import { ContactMap } from "@/sections/ContactMap";
import { Footer } from "@/sections/Footer";
import { FloatingWidgets } from "@/components/FloatingWidgets";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Phone, User, MapPin, ChevronDown, GraduationCap, ArrowRight, FileText } from "lucide-react";
import { CENTERS } from "@/data/content";
import { 
  contactFormSchema, 
  ContactFormValues, 
  nameSchema, 
  emailSchema, 
  phoneSchema, 
  centerSchema 
} from "@/utils/validation";
import { TurnstileCaptcha, TurnstileCaptchaRef, resetTurnstileCaptcha } from "@/components/TurnstileCaptcha";

interface MainPageContentProps {
  showPricing: boolean;
}

export function MainPageContent({ showPricing }: MainPageContentProps) {
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash === "#demo") {
        triggerDemoModal();
      }
    };

    // Check hash on initial load
    handleHash();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHash);

    const path = window.location.pathname;
    let targetId = "";
    if (path.endsWith("/highlights")) targetId = "highlights";
    else if (path.endsWith("/curriculum")) targetId = "curriculum";
    else if (path.endsWith("/pricing") || path.endsWith("/courses")) targetId = "pricing";
    else if (path.endsWith("/placements") || path.endsWith("/testimonials")) targetId = "placements";
    else if (path.endsWith("/faq")) targetId = "faq";

    if (targetId) {
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }, 300);
    }

    return () => {
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);
  
  // Dialog visibility states
  const [isDemoOpen, setIsDemoOpen] = React.useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = React.useState(false);
  const [videoUrl, setVideoUrl] = React.useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [brochureCenter, setBrochureCenter] = React.useState("Noida");

  // Custom CAPTCHA references and state
  const demoRecaptchaRef = React.useRef<TurnstileCaptchaRef>(null);
  const brochureRecaptchaRef = React.useRef<TurnstileCaptchaRef>(null);
  const [brochureToken, setBrochureToken] = React.useState<string | null>(null);

  const [demoResetToggle, setDemoResetToggle] = React.useState(0);
  const [brochureResetToggle, setBrochureResetToggle] = React.useState(0);

  React.useEffect(() => {
    if (demoResetToggle > 0) {
      resetTurnstileCaptcha(demoRecaptchaRef);
    }
  }, [demoResetToggle]);

  React.useEffect(() => {
    if (brochureResetToggle > 0) {
      resetTurnstileCaptcha(brochureRecaptchaRef);
    }
  }, [brochureResetToggle]);

  // Form hooks for modal (Demo Booking)
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      center: "Noida",
      captchaToken: "",
    },
  });

  const captchaToken = watch("captchaToken");

  // Open demo class registration
  const triggerDemoModal = (courseName: string = "") => {
    if (courseName && (courseName.toLowerCase().includes("brochure") || courseName.toLowerCase().includes("syllabus"))) {
      setIsBrochureOpen(true);
      return;
    }
    setSelectedCourse(courseName || "Free Demo Class");
    setValue("center", "Noida");
    setIsDemoOpen(true);
  };

  const handleDemoSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          center: data.center,
          captchaToken: data.captchaToken,
          formType: "DIDM Noida Adword Form 2",
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit form");
      }

      setIsDemoOpen(false);
      toast(`Thank you, ${data.name}! Your seats for the free trial class are locked at our ${data.center} center. Check your email for details.`, "success");
      reset({
        name: "",
        email: "",
        phone: "",
        center: "Noida",
        captchaToken: "",
      });
      setDemoResetToggle(prev => prev + 1);
      router.push("/thank-you");
    } catch (err: unknown) {
      console.error("Failed to shoot email lead:", err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBrochureSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.currentTarget;
    const formData = new FormData(target);
    const name = formData.get("brochure-name");
    const email = formData.get("brochure-email");
    const phone = formData.get("brochure-phone");
    const center = formData.get("brochure-center");

    // Perform individual schema validations for standard form
    const nameResult = nameSchema.safeParse(name);
    if (!nameResult.success) {
      toast(nameResult.error.issues[0].message, "error");
      return;
    }
    const sanitizedName = nameResult.data;

    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      toast(emailResult.error.issues[0].message, "error");
      return;
    }
    const sanitizedEmail = emailResult.data;

    const phoneResult = phoneSchema.safeParse(phone);
    if (!phoneResult.success) {
      toast(phoneResult.error.issues[0].message, "error");
      return;
    }
    const sanitizedPhone = phoneResult.data;

    const centerResult = centerSchema.safeParse(center);
    if (!centerResult.success) {
      toast(centerResult.error.issues[0].message, "error");
      return;
    }
    const sanitizedCenter = centerResult.data;

    if (!brochureToken) {
      toast("Please verify that you are human.", "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: sanitizedName,
          email: sanitizedEmail,
          phone: sanitizedPhone,
          center: sanitizedCenter,
          captchaToken: brochureToken,
          formType: "Brochure Download Form",
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit form");
      }

      setIsBrochureOpen(false);
      toast(`Syllabus brochure generated for ${sanitizedCenter} center! Download starting automatically for ${sanitizedEmail}.`, "success");
      
      // Trigger file download
      const link = document.createElement("a");
      link.href = "/E-brochure (5).pdf";
      link.download = "E-brochure (5).pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      target.reset();
      setBrochureToken(null);
      setBrochureResetToggle(prev => prev + 1);
      router.push("/thank-you");
    } catch (err: unknown) {
      console.error("Failed to shoot email lead:", err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Sticky header navigation */}
      <Header onOpenDemo={triggerDemoModal} showPricing={showPricing} />

      {/* Main Page Layout Sections */}
      <main className="flex-1 w-full">
        {/* 1. Hero Section */}
        <Hero />

        {/* Branding Ribbon */}
        <div className="w-full bg-gradient-to-r from-brand-red via-red-600 to-brand-red py-4 text-center shadow-md relative overflow-hidden">
          {/* Animated accent gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          <h2 className="text-white text-base sm:text-lg lg:text-xl font-extrabold tracking-widest uppercase flex items-center justify-center gap-2">
            <span>★</span> India's Most Promising Brand <span>★</span>
          </h2>
        </div>

        {/* 7c. Let Your Digital Career Begins Now - CTA Cards */}
        <DigitalCareerStart onOpenDemo={triggerDemoModal} />

        {/* 7. Detailed Course comparison grid */}
        <ComparisonTable onOpenDemo={triggerDemoModal} showPricing={showPricing} />

        {/* 2. Program Highlights */}
        <ProgramHighlights />

        {/* 3c. Course learning pathways (MIDM, Advanced, Customized) */}
        <CoursePrograms onOpenDemo={triggerDemoModal} />

        {/* 3. Video & Counselling Form */}
        <VideoCounselling />

        {/* 7b. Noida Student Feedback Grid */}
        <StudentFeedback />

        {/* 3b. Course Overview details */}
        <CourseOverview />

        {/* 3d. Training schedule and qualifications (Noida) */}
        <TrainingSchedule onOpenDemo={triggerDemoModal} />

        {/* 3e. 50+ Modules list covered in Noida master program */}
        <CoveredModules onOpenDemo={triggerDemoModal} />

        {/* 3f. Interactive module details tabs (Adwords, SEO, SMM, Adsense, etc.) */}
        <CoveredModulesTabs onOpenDemo={triggerDemoModal} />

        {/* 7a. Noida Branch Students Corner Carousel */}
        <StudentsCorner />

        {/* 7b. Students Happy Faces Gallery */}
        <StudentsHappyFaces />

        {/* 12. FAQ Accordions */}
        <FAQ />

        {/* 13. Map & Office Helpline Desk */}
        <ContactMap onOpenDemo={triggerDemoModal} />
      </main>

      {/* Footer credits and newsletter sign-up */}
      <Footer showPricing={showPricing} />

      {/* Floating widgets (WhatsApp, back to top, mobile sticky bottom) */}
      <FloatingWidgets onOpenDemo={() => triggerDemoModal()} />

      {/* ================================================== */}
      {/* DIALOG POPUPS */}
      {/* ================================================== */}

      {/* A. Free Demo Booking Modal */}
      <Dialog
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        variant="form"
      >
        {/* Branded Red Header */}
        <div className="bg-[#d6000c] px-4 py-2 text-white flex flex-col justify-between relative pr-10">
          {/* Top Row: Pill and Location */}
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white">
              FREE DEMO CLASS
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-white">
              {(watch("center") || "Noida").toUpperCase()}
            </span>
          </div>
          {/* Bottom Row: Icon + Title */}
          <div className="mt-1.5 flex items-center gap-2">
            <GraduationCap className="h-4.5 w-4.5 text-white fill-white/10 shrink-0" />
            <h3 className="text-sm font-bold tracking-tight uppercase text-white">
              {selectedCourse === "Request Callback" ? "Request a Callback" : "BOOK FREE TRIAL CLASS"}
            </h3>
          </div>
        </div>

        {/* Form Body */}
        <div className="bg-[#f8f9fa] p-3.5">
          <form onSubmit={handleSubmit(handleDemoSubmit)} className="space-y-2 text-left">
            {/* Full Name */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Full Name"
                  disabled={isSubmitting}
                  {...register("name", {
                    onBlur: (e) => {
                      e.target.value = e.target.value.trim().replace(/\s+/g, " ");
                    }
                  })}
                  className={`w-full border border-[#e5e7eb] bg-white rounded-lg py-1.5 pl-9.5 pr-3.5 text-[13px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#d6000c] transition-all shadow-sm ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.name && <span className="text-[10px] text-red-500 font-semibold pl-1 leading-tight">{errors.name.message}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email Address"
                  disabled={isSubmitting}
                  {...register("email", {
                    onBlur: (e) => {
                      e.target.value = e.target.value.trim();
                    }
                  })}
                  className={`w-full border border-[#e5e7eb] bg-white rounded-lg py-1.5 pl-9.5 pr-3.5 text-[13px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#d6000c] transition-all shadow-sm ${
                    errors.email ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.email && <span className="text-[10px] text-red-500 font-semibold pl-1 leading-tight">{errors.email.message}</span>}
            </div>

            {/* Mobile Phone */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  maxLength={10}
                  disabled={isSubmitting}
                  {...register("phone", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    }
                  })}
                  className={`w-full border border-[#e5e7eb] bg-white rounded-lg py-1.5 pl-9.5 pr-3.5 text-[13px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#d6000c] transition-all shadow-sm ${
                    errors.phone ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.phone && <span className="text-[10px] text-red-500 font-semibold pl-1 leading-tight">{errors.phone.message}</span>}
            </div>

            {/* Choose Center */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                <select
                  {...register("center")}
                  disabled={isSubmitting}
                  className={`w-full border border-[#e5e7eb] bg-white rounded-lg py-1.5 pl-9.5 pr-9 text-[13px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#d6000c] transition-all shadow-sm cursor-pointer appearance-none ${
                    errors.center ? "border-red-500" : ""
                  }`}
                >
                  <option value="">Choose Center Near You..</option>
                  {CENTERS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
              </div>
              {errors.center && <span className="text-[10px] text-red-500 font-semibold pl-1 leading-tight">{errors.center.message}</span>}
            </div>

            {/* Terms & Privacy Checkbox */}
            <div className="flex items-start gap-1.5 py-0 text-left">
              <input
                type="checkbox"
                id="modal-demo-terms"
                required
                defaultChecked
                className="mt-[2px] h-3.5 w-3.5 rounded border-[#e5e7eb] text-[#d6000c] focus:ring-[#d6000c] cursor-pointer"
              />
              <label htmlFor="modal-demo-terms" className="text-[11px] text-zinc-600 font-medium select-none cursor-pointer leading-tight">
                I agree to DIDM <span className="text-[#d6000c] font-bold">Terms</span> & <span className="text-[#d6000c] font-bold">Privacy Policy</span>
              </label>
            </div>

            {/* Spam Protection - Turnstile */}
            <div className="w-full my-0.5">
              <div className="w-full flex justify-center items-center h-[58px] overflow-hidden">
                <div className="w-full scale-[0.9] origin-center flex justify-center items-center">
                  <TurnstileCaptcha
                    ref={demoRecaptchaRef}
                    id="modal-demo-captcha"
                    size="sm"
                    variant="clean"
                    widgetSize="normal"
                    onChange={(token) => {
                      setValue("captchaToken", token || "", { shouldValidate: true });
                    }}
                  />
                </div>
              </div>
              {errors.captchaToken && (
                <span className="text-[10px] text-red-500 font-semibold pl-1 leading-tight mt-0.5">{errors.captchaToken.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !captchaToken}
              className="w-full bg-[#d6000c] hover:bg-[#c0000a] text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-md shadow-red-500/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center w-full">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  RESERVING...
                </span>
              ) : (
                <>
                  {selectedCourse === "Request Callback" ? "REQUEST CALLBACK" : "RESERVE MY SEAT"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </Dialog>

      {/* B. Download Syllabus Brochure Modal */}
      <Dialog
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        variant="form"
      >
            {/* Branded Red Header */}
        <div className="bg-[#d6000c] px-4 py-2 text-white flex flex-col justify-between relative pr-10">
          {/* Top Row: Pill and Location */}
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white">
              SYLLABUS PDF
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-white">
              {brochureCenter.toUpperCase()}
            </span>
          </div>
          {/* Bottom Row: Icon + Title */}
          <div className="mt-1.5 flex items-center gap-2">
            <FileText className="h-4.5 w-4.5 text-white fill-white/10 shrink-0" />
            <h3 className="text-sm font-bold tracking-tight uppercase text-white">
              DOWNLOAD FREE BROCHURE
            </h3>
          </div>
        </div>

        {/* Form Body */}
        <div className="bg-[#f8f9fa] p-3.5">
          <form onSubmit={handleBrochureSubmit} className="space-y-2 text-left">
            <p className="text-[11px] text-zinc-500 -mt-1 mb-2 leading-relaxed font-semibold">
              Enter your details below to receive the complete 2026 digital marketing curriculum PDF file directly on your device.
            </p>

            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                id="b-name"
                name="brochure-name"
                type="text"
                required
                placeholder="Full Name"
                onBlur={(e) => {
                  e.target.value = e.target.value.trim().replace(/\s+/g, " ");
                }}
                disabled={isSubmitting}
                className="w-full border border-[#e5e7eb] bg-white rounded-lg py-1.5 pl-9.5 pr-3.5 text-[13px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#d6000c] transition-all shadow-sm"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                id="b-email"
                name="brochure-email"
                type="email"
                required
                placeholder="Email Address"
                onBlur={(e) => {
                  e.target.value = e.target.value.trim();
                }}
                disabled={isSubmitting}
                className="w-full border border-[#e5e7eb] bg-white rounded-lg py-1.5 pl-9.5 pr-3.5 text-[13px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#d6000c] transition-all shadow-sm"
              />
            </div>

            {/* Phone Number */}
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                id="b-phone"
                name="brochure-phone"
                type="tel"
                required
                maxLength={10}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/\D/g, "").slice(0, 10);
                }}
                placeholder="Phone Number"
                disabled={isSubmitting}
                className="w-full border border-[#e5e7eb] bg-white rounded-lg py-1.5 pl-9.5 pr-3.5 text-[13px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#d6000c] transition-all shadow-sm"
              />
            </div>

            {/* Choose Center */}
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <select
                id="b-center"
                name="brochure-center"
                required
                disabled={isSubmitting}
                onChange={(e) => setBrochureCenter(e.target.value)}
                className="w-full border border-[#e5e7eb] bg-white rounded-lg py-1.5 pl-9.5 pr-9 text-[13px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#d6000c] transition-all shadow-sm cursor-pointer appearance-none"
              >
                <option value="">Choose Center Near You..</option>
                {CENTERS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            </div>

            {/* Terms & Privacy Checkbox */}
            <div className="flex items-start gap-1.5 py-0 text-left">
              <input
                type="checkbox"
                id="modal-brochure-terms"
                required
                defaultChecked
                className="mt-[2px] h-3.5 w-3.5 rounded border-[#e5e7eb] text-[#d6000c] focus:ring-[#d6000c] cursor-pointer"
              />
              <label htmlFor="modal-brochure-terms" className="text-[11px] text-zinc-600 font-medium select-none cursor-pointer leading-tight">
                I agree to DIDM <span className="text-[#d6000c] font-bold">Terms</span> & <span className="text-[#d6000c] font-bold">Privacy Policy</span>
              </label>
            </div>

            {/* Spam Protection - Turnstile */}
            <div className="w-full my-0.5">
              <div className="w-full flex justify-center items-center h-[58px] overflow-hidden">
                <div className="w-full scale-[0.9] origin-center flex justify-center items-center">
                  <TurnstileCaptcha
                    ref={brochureRecaptchaRef}
                    id="modal-brochure-captcha"
                    size="sm"
                    variant="clean"
                    widgetSize="normal"
                    onChange={(token) => setBrochureToken(token)}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !brochureToken}
              className="w-full bg-[#d6000c] hover:bg-[#c0000a] text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-md shadow-red-500/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center w-full">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  PROCESSING...
                </span>
              ) : (
                <>
                  DOWNLOAD PDF NOW
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </Dialog>

      {/* C. Video Testimonial Player Modal */}
      <Dialog
        isOpen={videoUrl !== null}
        onClose={() => setVideoUrl(null)}
        title="Student Success Verification"
      >
        <div className="aspect-video w-full rounded-lg overflow-hidden border border-zinc-200 bg-black">
          {videoUrl && (
            <video
              src={videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          )}
        </div>
        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider text-center mt-4">
          Unedited review. Hosted for admissions verification purposes.
        </p>
      </Dialog>
    </>
  );
}
