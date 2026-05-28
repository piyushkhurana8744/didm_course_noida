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
import * as z from "zod";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Phone, User, MapPin } from "lucide-react";
import { CENTERS } from "@/data/content";

// Modal lead schema
const modalSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  center: z.string().min(1, "Please select a center near you"),
});

type ModalFormValues = z.infer<typeof modalSchema>;

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

  // Form hooks for modal
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ModalFormValues>({
    resolver: zodResolver(modalSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      center: "Noida",
    },
  });

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

  const handleDemoSubmit = async (data: ModalFormValues) => {
    setIsSubmitting(true);
    
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          center: data.center,
          formType: "Free Demo Class Modal Form",
        }),
      });
    } catch (err) {
      console.error("Failed to shoot email lead:", err);
    }

    setIsSubmitting(false);
    setIsDemoOpen(false);
    
    toast(`Thank you, ${data.name}! Your seats for the free trial class are locked at our ${data.center} center. Check your email for details.`, "success");
    reset({
      name: "",
      email: "",
      phone: "",
      center: "Noida",
    });
    router.push("/thank-you");
  };

  const handleBrochureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get("brochure-name");
    const email = formData.get("brochure-email");
    const phone = formData.get("brochure-phone");
    const center = formData.get("brochure-center");

    if (!name || !email || !phone || !center) {
      toast("Please fill all fields to download the brochure.", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email)) {
      toast("Please enter a valid email address.", "error");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (typeof phone !== "string" || !phoneRegex.test(phone)) {
      toast("Phone number must be exactly 10 digits containing only numbers.", "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          center,
          formType: "Brochure Download Form",
        }),
      });
    } catch (err) {
      console.error("Failed to shoot email lead:", err);
    }

    setIsSubmitting(false);
    setIsBrochureOpen(false);
    
    toast(`Syllabus brochure generated for ${center} center! Download starting automatically for ${email}.`, "success");
    // Trigger file download
    const link = document.createElement("a");
    link.href = "/E-brochure (5).pdf";
    link.download = "E-brochure (5).pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    router.push("/thank-you");
  };

  return (
    <>
      {/* Sticky header navigation */}
      <Header onOpenDemo={() => triggerDemoModal()} showPricing={showPricing} />

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
        title={selectedCourse ? `Register: ${selectedCourse}` : "Book Your Free Demo Class"}
      >
        <form onSubmit={handleSubmit(handleDemoSubmit)} className="space-y-4 text-left">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-brand-red" /> Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              {...register("name")}
              disabled={isSubmitting}
              className={`w-full bg-zinc-50 border rounded-xl py-3 px-4 text-sm text-zinc-850 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all ${
                errors.name ? "border-red-500" : "border-zinc-300"
              }`}
            />
            {errors.name && <span className="text-xs text-red-500 font-semibold">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-brand-red" /> Email
            </label>
            <input
              type="email"
              placeholder="e.g. rahul@gmail.com"
              {...register("email")}
              disabled={isSubmitting}
              className={`w-full bg-zinc-50 border rounded-xl py-3 px-4 text-sm text-zinc-850 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all ${
                errors.email ? "border-red-500" : "border-zinc-300"
              }`}
            />
            {errors.email && <span className="text-xs text-red-500 font-semibold">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-brand-red" /> Mobile Phone
            </label>
            <input
              type="tel"
              placeholder="98765 43210"
              maxLength={10}
              {...register("phone", {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                }
              })}
              disabled={isSubmitting}
              className={`w-full bg-zinc-50 border rounded-xl py-3 px-4 text-sm text-zinc-850 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all ${
                errors.phone ? "border-red-500" : "border-zinc-300"
              }`}
            />
            {errors.phone && <span className="text-xs text-red-500 font-semibold">{errors.phone.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand-red" /> Choose Center Near You..
            </label>
            <select
              {...register("center")}
              disabled={isSubmitting}
              className={`w-full bg-zinc-50 border rounded-xl py-3 px-4 text-sm text-zinc-850 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all cursor-pointer ${
                errors.center ? "border-red-500" : "border-zinc-300"
              }`}
            >
              <option value="">Choose Center Near You..</option>
              {CENTERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.center && <span className="text-xs text-red-500 font-semibold">{errors.center.message}</span>}
          </div>

          <div className="flex items-center gap-2 py-1">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-[10px] text-zinc-500 font-bold">
              ISO 9001:2015 Admissions Desk. Support hours: 9AM - 7PM daily.
            </span>
          </div>

          <Button variant="primary" size="lg" type="submit" disabled={isSubmitting} className="w-full mt-2 cursor-pointer">
            {isSubmitting ? "Locking Seat..." : "Confirm Free Class Booking"}
          </Button>
        </form>
      </Dialog>

      {/* B. Download Syllabus Brochure Modal */}
      <Dialog
        isOpen={isBrochureOpen}
        onClose={() => setIsBrochureOpen(false)}
        title="Download Course Brochure"
      >
        <form onSubmit={handleBrochureSubmit} className="space-y-4 text-left">
          <p className="text-xs text-zinc-600 mb-2 leading-relaxed font-medium">
            Enter your details below to receive the complete 2026 digital marketing curriculum PDF file directly on your device.
          </p>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="b-name" className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-brand-red" /> Full Name
            </label>
            <input
              id="b-name"
              name="brochure-name"
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              disabled={isSubmitting}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-3 px-4 text-sm text-zinc-850 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="b-email" className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-brand-red" /> Email
            </label>
            <input
              id="b-email"
              name="brochure-email"
              type="email"
              required
              placeholder="e.g. rahul@gmail.com"
              disabled={isSubmitting}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-3 px-4 text-sm text-zinc-850 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="b-phone" className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-brand-red" /> Mobile Phone
            </label>
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
              placeholder="98765 43210"
              disabled={isSubmitting}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-3 px-4 text-sm text-zinc-850 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="b-center" className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-brand-red" /> Choose Center Near You..
            </label>
            <select
              id="b-center"
              name="brochure-center"
              required
              disabled={isSubmitting}
              className="w-full bg-zinc-50 border border-zinc-300 rounded-xl py-3 px-4 text-sm text-zinc-850 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all cursor-pointer"
            >
              <option value="">Choose Center Near You..</option>
              {CENTERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Button variant="primary" size="lg" type="submit" disabled={isSubmitting} className="w-full mt-4 cursor-pointer">
            {isSubmitting ? "Generating PDF..." : "Download Free Brochure Now"}
          </Button>
        </form>
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
