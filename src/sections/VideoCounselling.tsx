"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, ChevronDown, Play, Sparkles, Quote } from "lucide-react";
import { useRouter } from "next/navigation";
import { CENTERS } from "@/data/content";
import { contactFormSchema, ContactFormValues } from "@/utils/validation";
import { CustomCaptcha, CustomCaptchaRef, resetCustomCaptcha } from "@/components/CustomCaptcha";

export const VideoCounselling = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const recaptchaRef = React.useRef<CustomCaptchaRef>(null);

  const [recaptchaResetToggle, setRecaptchaResetToggle] = React.useState(0);

  React.useEffect(() => {
    if (recaptchaResetToggle > 0) {
      resetCustomCaptcha(recaptchaRef);
    }
  }, [recaptchaResetToggle]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      center: "Noida",
      captchaAnswer: "",
      captchaSignature: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
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
          captchaAnswer: data.captchaAnswer,
          captchaSignature: data.captchaSignature,
          formType: "Free Counselling Request Form",
        }),
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || "Failed to submit form");
      }

      toast(`Counselling request locked! Our Noida career specialist will call you back on ${data.phone} within 15 minutes.`, "success");
      reset({
        name: "",
        phone: "",
        email: "",
        center: "Noida",
        captchaAnswer: "",
        captchaSignature: "",
      });
      setRecaptchaResetToggle(prev => prev + 1);
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
    <section className="py-20 bg-zinc-50 border-b border-zinc-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col gap-2.5">
          <span className="text-xs font-black text-brand-red uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Career Guidance & Success
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-855 tracking-tight">
            Transforming Ambitions into <span className="text-brand-red">Digital Careers</span>
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 font-medium">
            Watch our student reviews and book your free one-on-one career counselling session.
          </p>
          <div className="w-16 h-1 bg-brand-red mx-auto rounded-full mt-2" />
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Student Reviews Card with Aspect-Video Player + Testimonial Info */}
          <div className="lg:col-span-6 flex flex-col">
            <Card className="border-zinc-200 shadow-xl overflow-hidden h-full flex flex-col bg-white">
              
              {/* Aspect Video Container (No Crop 16:9 aspect ratio) */}
              <div className="w-full aspect-video relative bg-black overflow-hidden">
                <AnimatePresence mode="wait">
                  {!isPlaying ? (
                    <motion.div
                      key="thumbnail"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsPlaying(true)}
                      className="absolute inset-0 w-full h-full cursor-pointer group"
                    >
                      {/* Full-bleed Thumbnail Image (Perfect 16:9 fit) */}
                      <img
                        src="https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_1000/v1779780066/youtube-thumbnail1_eijn6u.webp"
                        alt="DIDM Student Reviews"
                        width={600}
                        height={338}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                      />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-red/90 flex items-center justify-center shadow-2xl relative group-hover:bg-brand-red group-hover:scale-115 transition-all duration-300">
                          <div className="absolute inset-0 rounded-full border border-brand-red animate-ping opacity-75 pointer-events-none" />
                          <Play className="h-6 w-6 sm:h-8 sm:w-8 text-white fill-white ml-1.5" />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="iframe"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <iframe
                        className="w-full h-full border-0"
                        src="https://www.youtube.com/embed/9K0R4koddII?autoplay=1"
                        title="DIDM Noida Student Reviews and Success Stories"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Testimonial Content (Fills the blank space beautifully) */}
              <div className="p-6 flex-1 flex flex-col justify-center gap-5 text-left border-t border-zinc-100 bg-white">
                
                {/* Blockquote Quote text */}
                <div className="relative">
                  <Quote className="h-8 w-8 text-red-500/10 absolute -top-4.5 -left-2.5 rotate-180" />
                  <p className="text-zinc-700 text-sm sm:text-base font-semibold leading-relaxed relative z-10 italic pl-5 text-balance">
                    {"\"From ₹10k to ₹25k in Just 2 Months: SEO Tips for Beginners | Industry Insights | #didmpodcast 😍\""}
                  </p>
                </div>

                {/* Author Info */}
                <div className="border-t border-zinc-100 pt-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-extrabold text-zinc-800 uppercase tracking-wide">
                      Ms. Shruti Gupta
                    </h4>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mt-0.5">
                      Trainee from DIDM
                    </p>
                  </div>
                  <div className="bg-red-50 text-brand-red text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-red-100 shadow-2xs">
                    ✓ Verified Trainee
                  </div>
                </div>

              </div>

            </Card>
          </div>

          {/* Right Column: Book Counselling Card */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="bg-[#800c0c] text-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col justify-between h-full text-center">
              
              {/* Header Texts */}
              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wide">
                  Book Seat For Free Counselling
                </h3>
                <p className="text-zinc-200 text-xs sm:text-sm font-semibold tracking-wider mt-1.5">
                  Speak To Our Specialist - <a href="tel:+919873837467" className="hover:underline text-white">+91 - 9873837467</a>
                </p>
              </div>

              {/* Form elements */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Full Name"
                      disabled={isSubmitting}
                      {...register("name", {
                        onBlur: (e) => {
                          e.target.value = e.target.value.trim().replace(/\s+/g, " ");
                        }
                      })}
                      className={`w-full bg-white border rounded-lg py-3 px-4 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                        errors.name ? "border-amber-400" : "border-transparent"
                      }`}
                    />
                    <User className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500" />
                  </div>
                  {errors.name && <span className="text-xs text-amber-300 font-bold">{errors.name.message}</span>}
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-1.5">
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Phone"
                      maxLength={10}
                      disabled={isSubmitting}
                      {...register("phone", {
                        onChange: (e) => {
                          e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                        }
                      })}
                      className={`w-full bg-white border rounded-lg py-3 px-4 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                        errors.phone ? "border-amber-400" : "border-transparent"
                      }`}
                    />
                    <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500" />
                  </div>
                  {errors.phone && <span className="text-xs text-amber-300 font-bold">{errors.phone.message}</span>}
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email"
                      disabled={isSubmitting}
                      {...register("email", {
                        onBlur: (e) => {
                          e.target.value = e.target.value.trim();
                        }
                      })}
                      className={`w-full bg-white border rounded-lg py-3 px-4 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20 ${
                        errors.email ? "border-amber-400" : "border-transparent"
                      }`}
                    />
                    <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500" />
                  </div>
                  {errors.email && <span className="text-xs text-amber-300 font-bold">{errors.email.message}</span>}
                </div>

                {/* Choose Center Near You */}
                <div className="flex flex-col gap-1.5">
                  <div className="relative">
                    <select
                      disabled={isSubmitting}
                      {...register("center")}
                      className={`w-full bg-white border rounded-lg py-3 px-4 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20 appearance-none cursor-pointer ${
                        errors.center ? "border-amber-400" : "border-transparent"
                      }`}
                    >
                      <option value="">Choose Center Near You..</option>
                      {CENTERS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-500 pointer-events-none" />
                  </div>
                  {errors.center && <span className="text-xs text-amber-300 font-bold">{errors.center.message}</span>}
                </div>

                {/* Spam Protection - Custom math CAPTCHA */}
                <CustomCaptcha
                  ref={recaptchaRef}
                  id="counselling-captcha"
                  size="sm"
                  error={errors.captchaAnswer?.message || errors.captchaSignature?.message}
                  onChange={(val) => {
                    setValue("captchaAnswer", val?.answer || "", { shouldValidate: true });
                    setValue("captchaSignature", val?.signature || "", { shouldValidate: true });
                  }}
                />

                {/* Submit button */}
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#c21a1a] hover:bg-[#b01616] active:bg-[#9d1212] text-white border border-[#b01616] shadow-md py-3.5 mt-4 cursor-pointer font-bold rounded-lg uppercase tracking-wide transition-all"
                >
                  {isSubmitting ? "Locking seat..." : "Submit Your Request"}
                </Button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
