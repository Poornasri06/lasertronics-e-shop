import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import hero1 from "@/assets/hero-1-new.png";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero2,
    eyebrow: "MOBILE ACCESSORIES",
    title: "Power that keeps up with you",
    copy: "GaN chargers, 100W cables and magnetic power banks built for everyday punishment.",
    slug: "mobile-accessories",
    cta: "Shop Accessories",
  },
  {
    image: hero3,
    eyebrow: "REPAIR KITS",
    title: "Bench-grade tools for real work",
    copy: "Professional soldering stations, ESD-safe kits and precision tools for technicians and makers.",
    slug: "repair-kits",
    cta: "Shop Repair Tools",
  },
  {
    image: hero1,
    eyebrow: "IOT & MICROCONTROLLERS",
    title: "Build connected things, faster",
    copy: "Dev boards, sensors and starter kits stocked in Colombo and shipped island-wide.",
    slug: "iot-and-microcontrollers",
    cta: "Shop Dev Boards",
  },
];

const AUTOPLAY_DELAY = 5500;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Autoplay timer
  useEffect(() => {
    if (isPaused || isDragging) return;
    const timer = setInterval(nextSlide, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [isPaused, isDragging, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Pointer / Touch / Mouse Drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    dragStartX.current = clientX;
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || dragStartX.current === null) return;
    const diff = clientX - dragStartX.current;
    setDragOffset(diff);
  };

  const handleDragEnd = () => {
    if (!isDragging || dragStartX.current === null) return;
    if (dragOffset < -60) {
      nextSlide();
    } else if (dragOffset > 60) {
      prevSlide();
    }
    setIsDragging(false);
    dragStartX.current = null;
    setDragOffset(0);
  };

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 select-none">
      {/* Full-width Slideshow Carousel Container */}
      <div
        className={`group relative min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] w-full overflow-hidden ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          if (isDragging) handleDragEnd();
        }}
        // Mouse drag events
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        // Touch swipe events
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {/* Horizontal Slide Track */}
        <div
          className={`flex h-full min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] w-full ${
            isDragging
              ? "transition-none"
              : "transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          }`}
          style={{
            transform: `translateX(calc(-${index * 100}% + ${dragOffset}px))`,
          }}
        >
          {slides.map((slide, i) => {
            const isActive = i === index;
            return (
              <div
                key={slide.slug}
                className="relative flex h-full min-h-[520px] sm:min-h-[580px] lg:min-h-[640px] w-full shrink-0 flex-col justify-between"
              >
                {/* Slide Background Image with Ken-Burns Motion */}
                <div className="absolute inset-0 size-full overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    draggable={false}
                    className={`size-full object-cover object-center lg:object-right transition-transform duration-[6000ms] ease-out ${
                      isActive ? "scale-108" : "scale-100"
                    }`}
                  />
                  {/* High-legibility Multi-Layer Dark Gradients for Text Clarity */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/40 sm:from-slate-950/95 sm:via-slate-950/70 sm:to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-slate-950/50" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(8,120,209,0.25),transparent_65%)]" />
                </div>

                {/* Main Content Overlay Container */}
                <div className="container-page relative z-10 flex flex-col justify-center pt-12 sm:pt-16 lg:pt-20 pb-24 sm:pb-28">
                  <div className="max-w-2xl">
                    {/* Eyebrow Pill */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/50 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300 shadow-sm backdrop-blur-xl">
                      <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
                      {slide.eyebrow}
                    </div>

                    {/* Main Title */}
                    <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.12] drop-shadow-md">
                      {slide.title}
                    </h1>

                    {/* Description Copy */}
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg lg:text-xl drop-shadow-sm font-normal">
                      {slide.copy}
                    </p>

                    {/* Micro Badges Row */}
                    <div className="mt-6 flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/80 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white/95 shadow-sm backdrop-blur-md">
                        <ShieldCheck className="size-4 text-emerald-400" />
                        100% Genuine Stock
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/80 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white/95 shadow-sm backdrop-blur-md">
                        <Zap className="size-4 text-amber-400" />
                        24h Colombo Dispatch
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-slate-900/80 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white/95 shadow-sm backdrop-blur-md">
                        <Sparkles className="size-4 text-cyan-400" />
                        Local Warranty
                      </span>
                    </div>

                    {/* CTA Buttons */}
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Link
                        to="/category/$slug"
                        params={{ slug: slide.slug }}
                        className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-[#0878D1] hover:bg-[#0768b5] px-8 text-sm sm:text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        {slide.cta}
                        <Plus className="size-4.5 stroke-[2.5]" aria-hidden />
                      </Link>

                      <Link
                        to="/shop"
                        className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm sm:text-base font-bold text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/20 hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        Browse All Products
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Persistent Floating Controls Overlay (Aligned with page container) */}
        <div className="container-page absolute inset-x-0 bottom-0 z-20 flex items-center justify-between py-6 sm:py-8 pointer-events-none">
          {/* Slide Indicators / Dots */}
          <div className="flex items-center gap-3 pointer-events-auto">
            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/80 p-1.5 backdrop-blur-md shadow-md">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === index
                      ? "w-8 bg-[#0878D1] shadow-[0_0_12px_rgba(8,120,209,0.9)]"
                      : "w-2.5 bg-white/40 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-bold tracking-wide text-white/90 drop-shadow">
              0{index + 1} / 0{slides.length}
            </span>
          </div>

          {/* Prev / Next Slide Navigation Arrows */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={prevSlide}
              className="grid size-10 sm:size-11 place-items-center rounded-full border border-white/20 bg-slate-900/80 text-white shadow-md backdrop-blur-md transition-all hover:bg-white/25 hover:scale-105 active:scale-90 cursor-pointer"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={nextSlide}
              className="grid size-10 sm:size-11 place-items-center rounded-full border border-white/20 bg-slate-900/80 text-white shadow-md backdrop-blur-md transition-all hover:bg-white/25 hover:scale-105 active:scale-90 cursor-pointer"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}




