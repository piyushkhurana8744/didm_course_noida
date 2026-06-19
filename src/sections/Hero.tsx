"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { User, Mail, Phone, MapPin, GraduationCap, ArrowRight, ChevronDown } from "lucide-react";
import { CENTERS } from "@/data/content";
import { contactFormSchema, ContactFormValues } from "@/utils/validation";
import { TurnstileCaptcha, TurnstileCaptchaRef, resetTurnstileCaptcha } from "@/components/TurnstileCaptcha";

export const Hero = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const desktopRecaptchaRef = React.useRef<TurnstileCaptchaRef>(null);
  const mobileRecaptchaRef = React.useRef<TurnstileCaptchaRef>(null);

  const [desktopResetToggle, setDesktopResetToggle] = React.useState(0);
  const [mobileResetToggle, setMobileResetToggle] = React.useState(0);

  React.useEffect(() => {
    if (desktopResetToggle > 0) {
      resetTurnstileCaptcha(desktopRecaptchaRef);
    }
  }, [desktopResetToggle]);

  React.useEffect(() => {
    if (mobileResetToggle > 0) {
      resetTurnstileCaptcha(mobileRecaptchaRef);
    }
  }, [mobileResetToggle]);

  const desktopForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      center: "Noida",
      captchaToken: "",
    },
  });

  const mobileForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      center: "Noida",
      captchaToken: "",
    },
  });

  const createSubmitHandler = (
    formInstance: typeof desktopForm,
    triggerReset: () => void
  ) => async (data: ContactFormValues) => {
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
          formType: "DIDM Noida Adword Form 1",
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit form");
      }

      toast(`Thank you, ${data.name}! Your free trial class is reserved at our ${data.center} center.`, "success");
      formInstance.reset({
        name: "",
        email: "",
        phone: "",
        center: "Noida",
        captchaToken: "",
      });
      triggerReset();
      router.push("/thank-you");
    } catch (err: unknown) {
      console.error("Failed to shoot email lead:", err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDesktopSubmit = createSubmitHandler(desktopForm, () => setDesktopResetToggle(prev => prev + 1));
  const onMobileSubmit = createSubmitHandler(mobileForm, () => setMobileResetToggle(prev => prev + 1));

  const inputBase = "w-full border border-[#e5e7eb] bg-white rounded-lg py-1.5 pl-9.5 pr-3.5 text-[13px] text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#d6000c] transition-all shadow-sm";

  const renderForm = (
    formInstance: typeof desktopForm,
    onSubmitHandler: (data: ContactFormValues) => void,
    recaptchaRef: React.RefObject<TurnstileCaptchaRef | null>,
    captchaId: string
  ) => {
    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
    } = formInstance;

    const captchaToken = watch("captchaToken");
    const centerVal = watch("center");
    const displayCenter = (centerVal || "Noida").toUpperCase();

    return (
      <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        {/* Branded Red Header */}
        <div className="bg-[#d6000c] px-4 py-1.5 text-white flex flex-col justify-between relative">
          {/* Top Row: Pill and Location */}
          <div className="flex items-center justify-between w-full">
            <span className="text-[9px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-white">
              FREE DEMO CLASS
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-white">
              {displayCenter}
            </span>
          </div>
          {/* Bottom Row: Icon + Title */}
          <div className="mt-1 flex items-center gap-2">
            <GraduationCap className="h-4.5 w-4.5 text-white fill-white/10 shrink-0" />
            <h3 className="text-[13px] font-bold tracking-tight uppercase text-white">
              BOOK FREE TRIAL CLASS
            </h3>
          </div>
        </div>

        {/* Form Body */}
        <div className="bg-[#f8f9fa] p-3">
          <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-1.5">
            {/* Full Name */}
            <div className="flex flex-col gap-0.5">
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
                  className={`${inputBase} ${errors.name ? "border-red-400 bg-red-50/50" : ""}`}
                />
              </div>
              {errors.name && <p className="text-[10px] text-red-500 font-semibold pl-1 leading-tight">{errors.name.message}</p>}
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-0.5">
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
                  className={`${inputBase} ${errors.email ? "border-red-400 bg-red-50/50" : ""}`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-semibold pl-1 leading-tight">{errors.email.message}</p>}
            </div>

            {/* Contact Number */}
            <div className="flex flex-col gap-0.5">
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
                  className={`${inputBase} ${errors.phone ? "border-red-400 bg-red-50/50" : ""}`}
                />
              </div>
              {errors.phone && <p className="text-[10px] text-red-500 font-semibold pl-1 leading-tight">{errors.phone.message}</p>}
            </div>

            {/* Choose Center */}
            <div className="flex flex-col gap-0.5">
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                <select
                  {...register("center")}
                  disabled={isSubmitting}
                  className={`${inputBase} cursor-pointer appearance-none ${errors.center ? "border-red-400 bg-red-50/50" : ""}`}
                >
                  <option value="">Choose Center Near You..</option>
                  {CENTERS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
              </div>
              {errors.center && <p className="text-[10px] text-red-500 font-semibold pl-1 leading-tight">{errors.center.message}</p>}
            </div>

            {/* Terms & Privacy Checkbox */}
            <div className="flex items-start gap-1.5 py-0 text-left">
              <input
                type="checkbox"
                id={`${captchaId}-terms`}
                required
                defaultChecked
                className="mt-[2px] h-3.5 w-3.5 rounded border-[#e5e7eb] text-[#d6000c] focus:ring-[#d6000c] cursor-pointer"
              />
              <label htmlFor={`${captchaId}-terms`} className="text-[11px] text-zinc-600 font-medium select-none cursor-pointer leading-tight">
                I agree to DIDM <span className="text-[#d6000c] font-bold">Terms</span> & <span className="text-[#d6000c] font-bold">Privacy Policy</span>
              </label>
            </div>

            {/* Spam Protection - Turnstile */}
            <div className="w-full my-0.5">
              <div className="w-full flex justify-center items-center h-[60px] lg:h-[48px] xl:h-[52px] overflow-hidden">
                <div className="w-full scale-[0.92] lg:scale-[0.74] xl:scale-[0.80] origin-center flex justify-center items-center">
                  <TurnstileCaptcha
                    ref={recaptchaRef}
                    id={captchaId}
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
                <p className="text-[10px] text-red-500 font-semibold pl-1 leading-tight mt-0.5">
                  {errors.captchaToken.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !captchaToken}
              className="w-full bg-[#d6000c] hover:bg-[#c0000a] text-white py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-md shadow-red-500/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center w-full">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  RESERVING...
                </span>
              ) : (
                <>
                  RESERVE MY SEAT
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  return (
    <section className="relative w-full bg-white pt-[68px] sm:pt-[80px] md:pt-[84px] pb-20 overflow-hidden">
      
      {/* Subtle background gradient mesh */}
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-red/[0.03] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/[0.02] rounded-full blur-[80px] pointer-events-none" />

      {/* Edge-to-Edge Full-Width Banner Image Wrapper */}
      <div className="w-full relative">
        <img
          src="https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_1920/v1779780068/hero-banner_p0nzip.webp"
          alt="DIDM Noida Branch Banner"
          width={1200}
          height={675}
          className="w-full h-auto block"
        />
        {/* Right-side gradient for form readability */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-transparent to-transparent pointer-events-none hidden lg:block" />

        {/* Desktop Overlay Form - positioned on right side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-8 lg:right-16 xl:right-24 w-[245px] lg:w-[265px] xl:w-[285px] z-20"
        >
          {renderForm(desktopForm, onDesktopSubmit, desktopRecaptchaRef, "hero-desktop-captcha")}
        </motion.div>
      </div>

      {/* Mobile Form Display (Stacked Below Banner) */}
      <div className="block lg:hidden px-4 -mt-8 max-w-sm mx-auto relative z-10">
        {renderForm(mobileForm, onMobileSubmit, mobileRecaptchaRef, "hero-mobile-captcha")}
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
          &ldquo;Digital Marketing Training Institute - <span className="text-brand-red">Noida</span>&rdquo;
        </motion.h1>

        {/* Description Paragraph with Red Highlights */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          className="text-sm sm:text-base md:text-[17px] text-zinc-500 leading-[1.8] font-medium max-w-5xl text-center"
        >
          <span className="text-brand-red font-bold">Delhi Institute of Digital Marketing (DIDM)</span>, a top digital marketing training provider across India running multiple training center in <span className="text-brand-red font-bold">Delhi/NCR</span> and cover almost every part of the <span className="text-brand-red font-bold">South Delhi</span> | <span className="text-brand-red font-bold">North Delhi</span> | <span className="text-brand-red font-bold">East Delhi</span> | <span className="text-brand-red font-bold">West Delhi</span> | <span className="text-brand-red font-bold">Noida</span> and other important location both <span className="text-brand-red font-bold">Online & Offline</span> mode with different training program in <span className="text-brand-red font-bold">Digital Marketing Course</span>.
        </motion.p>

        {/* Decorative bottom element */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-20 h-1 bg-gradient-to-r from-brand-red to-red-400 rounded-full mt-2"
        />
      </div>

    </section>
  );
};
