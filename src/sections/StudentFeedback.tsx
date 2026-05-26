"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, X, ZoomIn } from "lucide-react";

const FEEDBACK_IMAGES = [
  { id: 1, src: "https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_500/v1779780065/student-1_feedback_igxhz7.jpg", alt: "Noida Student Feedback Form 1" },
  { id: 2, src: "https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_500/v1779780064/student_13_feedback_nwhx8q.jpg", alt: "Noida Student Feedback Form 2" },
  { id: 3, src: "https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_500/v1779780064/student_12_feedback_xqqsk7.jpg", alt: "Noida Student Feedback Form 3" },
  { id: 4, src: "https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_500/v1779780063/student_11_feedback_oxvbkv.jpg", alt: "Noida Student Feedback Form 4" },
  { id: 5, src: "https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_500/v1779780063/student_10_feedback_nvnwol.jpg", alt: "Noida Student Feedback Form 5" },
  { id: 6, src: "https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_500/v1779780062/student_9_feedback_q00xpt.jpg", alt: "Noida Student Feedback Form 6" },
  { id: 7, src: "https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_500/v1779780061/student_8_feedback_amqjkk.jpg", alt: "Noida Student Feedback Form 7" },
  { id: 8, src: "https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_500/v1779780059/student_7_feedback_aoux5z.jpg", alt: "Noida Student Feedback Form 8" },
  { id: 9, src: "https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_500/v1779780058/student_6_feedback_ux44b5.jpg", alt: "Noida Student Feedback Form 9" },
  { id: 10, src: "https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_500/v1779780056/student_5_feedback_iiglry.jpg", alt: "Noida Student Feedback Form 10" },
  { id: 11, src: "https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_500/v1779780055/student_4_feedback_fvmho8.jpg", alt: "Noida Student Feedback Form 11" },
  { id: 12, src: "https://res.cloudinary.com/dnfz4jwam/image/upload/f_auto,q_auto,w_500/v1779780054/student_3_feedback_wsggbf.jpg", alt: "Noida Student Feedback Form 12" },
];

export const StudentFeedback = () => {
  const [isGridModalOpen, setIsGridModalOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);

  // Disable body scroll when lightbox or grid modal is active
  React.useEffect(() => {
    if (selectedImage || isGridModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage, isGridModalOpen]);

  // Keep exactly 12 items on the main landing page
  const mainPageImages = FEEDBACK_IMAGES.slice(0, 12);

  return (
    <section className="py-20 bg-zinc-50 border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 flex flex-col gap-3">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-zinc-800 uppercase">
            Noida Student Feedback
          </h2>
          <p className="text-sm sm:text-base font-semibold text-zinc-500 leading-relaxed max-w-2xl mx-auto">
            Review original handwritten feedback forms submitted by students upon completing their modules at our Noida center.
          </p>
          <div className="w-16 h-1 bg-brand-red mx-auto rounded-full mt-1" />
        </div>

        {/* 12-Card Grid on landing page */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mainPageImages.map((image) => (
            <motion.div
              key={image.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedImage(image.src)}
              className="group relative border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-2xs hover:shadow-lg hover:border-brand-red/30 cursor-pointer transition-all duration-300 flex aspect-[4/3] items-center justify-center"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <div className="flex items-center gap-2 bg-white/95 text-zinc-850 px-4.5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm transition-all duration-300">
                  <ZoomIn className="h-4.5 w-4.5 text-brand-red" /> View Feedback
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button to open grid modal */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setIsGridModalOpen(true)}
            className="inline-flex items-center gap-2 bg-[#a81c1c] hover:bg-[#901818] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 rounded-full shadow-md cursor-pointer transition-all duration-200"
          >
            View More <Eye className="h-4.5 w-4.5" />
          </button>
        </div>

      </div>

      {/* Grid Modal: Displays all feedback forms */}
      <AnimatePresence>
        {isGridModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGridModalOpen(false)}
              className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring" as const, duration: 0.4 }}
              className="relative w-full max-w-6xl max-h-[85vh] bg-white border border-zinc-200 rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-zinc-150">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-zinc-900 uppercase tracking-tight">
                    All Noida Student Feedback Forms
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-zinc-400 mt-1">
                    Browse all handwritten forms filled out by our course graduates.
                  </p>
                </div>
                <button
                  onClick={() => setIsGridModalOpen(false)}
                  className="text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 p-2 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="h-5.5 w-5.5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 sm:p-8 overflow-y-auto no-scrollbar flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {FEEDBACK_IMAGES.map((image) => (
                    <div
                      key={image.id}
                      onClick={() => setSelectedImage(image.src)}
                      className="group relative border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-2xs hover:shadow-lg hover:border-brand-red/30 cursor-pointer transition-all duration-300 flex aspect-[4/3] items-center justify-center"
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                        <div className="flex items-center gap-2 bg-white/95 text-zinc-850 px-4.5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm transition-all duration-300">
                          <ZoomIn className="h-4.5 w-4.5 text-brand-red" /> View Feedback
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Overlay (Z-Index is higher to overlay on top of the Grid Modal) */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-brand-red bg-white/10 hover:bg-white/20 p-2 sm:p-2.5 rounded-full transition-all duration-200 z-10 cursor-pointer"
            >
              <X className="h-6 w-6 sm:h-7 sm:w-7" />
            </button>

            {/* Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring" as const, duration: 0.4 }}
              className="relative max-w-5xl w-full max-h-[85vh] sm:max-h-[90vh] bg-white rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl z-10 p-2 flex items-center justify-center"
            >
              <img
                src={selectedImage}
                alt="Selected Feedback Zoom"
                className="max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-lg"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
