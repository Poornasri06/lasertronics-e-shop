import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
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

const AUTOPLAY_DELAY = 5000;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section className="relative py-4 sm:py-6 lg:py-8">
      <div className="container-page">
        {/* Full-width Slideshow Carousel Container */}
        <div
          className="group relative min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] w-full overflow-hidden rounded-3xl lg:rounded-4xl border border-white/30 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Horizontal Slide Track */}
          <div
            className="flex h-full min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] w-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div
                key={slide.slug}
                className="relative flex h-full min-h-[540px] sm:min-h-[580px] lg:min-h-[620px] w-full shrink-0 flex-col justify-between p-6 sm:p-10 lg:p-14"
              >
                {/* Slide Background Image */}
                <div className="absolute inset-0 size-full overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="size-full object-cover object-center lg:object-right transition-transform duration-1000 group-hover:scale-105"
                  />
                  {/* High-legibility Multi-Layer Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/30 sm:from-slate-950/90 sm:via-slate-950/65 sm:to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/25" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(8,120,209,0.2),transparent_60%)]" />
                </div>

                {/* Main Content Overlay */}
                <div className="relative z-10 max-w-2xl">
                  {/* Eyebrow Pill */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-cyan-300 shadow-sm backdrop-blur-xl">
                    <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
                    {slide.eyebrow}
                  </div>

                  {/* Main Title */}
                  <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.14] drop-shadow-md">
                    {slide.title}
                  </h1>

                  {/* Description Copy */}
                  <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg lg:text-xl drop-shadow-sm">
                    {slide.copy}
                  </p>

                  {/* Micro Badges */}
                  <div className="mt-6 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-900/70 px-3.5 py-1.5 text-xs font-semibold text-white/95 shadow-sm backdrop-blur-md">
                      <ShieldCheck className="size-3.5 text-emerald-400" />
                      100% Genuine Stock
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-900/70 px-3.5 py-1.5 text-xs font-semibold text-white/95 shadow-sm backdrop-blur-md">
                      <Zap className="size-3.5 text-amber-400" />
                      24h Colombo Dispatch
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-900/70 px-3.5 py-1.5 text-xs font-semibold text-white/95 shadow-sm backdrop-blur-md">
                      <Sparkles className="size-3.5 text-cyan-400" />
                      Local Warranty
                    </span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-8 flex flex-wrap items-center gap-3.5">
                    <Link
                      to="/category/$slug"
                      params={{ slug: slide.slug }}
                      className="apple-btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                      {slide.cta}
                      <ArrowRight className="size-4" aria-hidden />
                    </Link>

                    <Link
                      to="/shop"
                      className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/15 px-7 text-sm font-bold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/25 hover:scale-105 active:scale-95"
                    >
                      Browse All Products
                    </Link>
                  </div>
                </div>

                {/* Placeholder spacer for bottom bar alignment */}
                <div className="h-12" />
              </div>
            ))}
          </div>

          {/* Persistent Floating Controls Overlay (Fixed at bottom of hero card) */}
          <div className="absolute inset-x-0 bottom-0 z-20 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-gradient-to-t from-slate-950/80 to-transparent p-6 sm:px-10 lg:px-14">
            {/* Slide Indicators / Dots */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-slate-900/70 p-1.5 backdrop-blur-md shadow-md">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === index
                        ? "w-8 bg-blue-500 shadow-[0_0_14px_rgba(59,130,246,0.9)]"
                        : "w-2.5 bg-white/40 hover:bg-white/80"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-white/80">
                0{index + 1} / 0{slides.length}
              </span>
            </div>

            {/* Prev / Next Slide Arrows */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={prevSlide}
                className="grid size-10 place-items-center rounded-full border border-white/20 bg-slate-900/70 text-white shadow-md backdrop-blur-md transition-all hover:bg-white/25 hover:scale-105 active:scale-90"
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={nextSlide}
                className="grid size-10 place-items-center rounded-full border border-white/20 bg-slate-900/70 text-white shadow-md backdrop-blur-md transition-all hover:bg-white/25 hover:scale-105 active:scale-90"
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


