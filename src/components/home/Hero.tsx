import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
  Cpu,
  Wrench,
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
    title: "GaN Fast Chargers & 100W Cables",
    copy: "High-density dual USB-C charging hubs, magnetic power banks and braided cables built for daily heavy duty.",
    slug: "mobile-accessories",
    cta: "Shop Accessories",
  },
  {
    image: hero3,
    eyebrow: "REPAIR BENCH TOOLS",
    title: "Bench-Grade Soldering & ESD Equipment",
    copy: "Digital temperature-controlled soldering stations, precision driver kits and ESD supplies for repair labs.",
    slug: "repair-kits",
    cta: "Shop Repair Tools",
  },
  {
    image: hero1,
    eyebrow: "IOT & MICROCONTROLLERS",
    title: "ESP32, Sensors & Prototyping Hardware",
    copy: "Wi-Fi & Bluetooth IoT boards, breakout sensors and starter kits in stock for island-wide delivery.",
    slug: "iot-and-microcontrollers",
    cta: "Shop Dev Boards",
  },
];

const AUTOPLAY_DELAY = 4500;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isDragging) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [isDragging, index]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

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
    if (dragOffset < -50) {
      nextSlide();
    } else if (dragOffset > 50) {
      prevSlide();
    }
    setIsDragging(false);
    dragStartX.current = null;
    setDragOffset(0);
  };

  return (
    <section className="bg-slate-900 py-3 sm:py-6 border-b border-slate-800">
      <div className="container-page">
        {/* Desktop Split Hub: Carousel on Left + Curated Promo Tiles on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          {/* Main Carousel (12 cols on mobile, 8 or 9 cols on desktop) */}
          <div className="lg:col-span-8 xl:col-span-9 relative overflow-hidden rounded-2xl lg:rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl select-none">
            <div
              className={`group relative min-h-[300px] xs:min-h-[340px] sm:min-h-[440px] lg:min-h-[480px] w-full overflow-hidden ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              onMouseDown={(e) => handleDragStart(e.clientX)}
              onMouseMove={(e) => handleDragMove(e.clientX)}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
              onTouchStart={(e) => {
                if (e.touches && e.touches[0]) handleDragStart(e.touches[0].clientX);
              }}
              onTouchMove={(e) => {
                if (e.touches && e.touches[0]) handleDragMove(e.touches[0].clientX);
              }}
              onTouchEnd={handleDragEnd}
            >
              <div
                className={`flex h-full min-h-[300px] xs:min-h-[340px] sm:min-h-[440px] lg:min-h-[480px] w-full ${
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
                      className="relative flex h-full min-h-[300px] xs:min-h-[340px] sm:min-h-[440px] lg:min-h-[480px] w-full shrink-0 flex-col justify-center p-5 sm:p-10 lg:p-14"
                    >
                      {/* Slide Image Background */}
                      <div className="absolute inset-0 size-full overflow-hidden">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          draggable={false}
                          className={`size-full object-cover object-center lg:object-right transition-transform duration-[6000ms] ease-out ${
                            isActive ? "scale-105" : "scale-100"
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />
                      </div>

                      {/* Content Overlay */}
                      <div className="relative z-10 max-w-xl">
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-950/60 px-3 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.2em] text-sky-300 shadow-sm backdrop-blur-xl">
                          <span className="size-2 rounded-full bg-sky-400 animate-pulse" />
                          {slide.eyebrow}
                        </div>

                        <h1 className="mt-3 sm:mt-4 font-display text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-md">
                          {slide.title}
                        </h1>

                        <p className="mt-2 sm:mt-3 text-xs sm:text-sm lg:text-base leading-relaxed text-slate-300 drop-shadow-sm font-normal line-clamp-2 sm:line-clamp-3">
                          {slide.copy}
                        </p>

                        <div className="mt-5 sm:mt-7 flex flex-wrap items-center gap-3">
                          <Link
                            to="/category/$slug"
                            params={{ slug: slide.slug }}
                            className="inline-flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 sm:px-7 text-xs sm:text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
                          >
                            <span>{slide.cta}</span>
                            <ArrowRight className="size-4" />
                          </Link>

                          <Link
                            to="/shop"
                            className="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 px-4 sm:px-6 text-xs sm:text-sm font-bold text-white backdrop-blur-md transition-colors"
                          >
                            All Products
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Controls (Progress Indicators & Arrows) */}
              <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-between px-5 sm:px-10 pointer-events-none">
                {/* Dots / Progress Bars */}
                <div className="flex items-center gap-2 pointer-events-auto">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => setIndex(i)}
                      className={`relative h-2 overflow-hidden rounded-full transition-all duration-300 cursor-pointer ${
                        i === index
                          ? "w-8 bg-blue-500 shadow-sm"
                          : "w-2 bg-white/40 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-1.5 pointer-events-auto">
                  <button
                    type="button"
                    aria-label="Previous slide"
                    onClick={prevSlide}
                    className="grid size-8 sm:size-9 place-items-center rounded-lg border border-white/20 bg-slate-900/80 text-white hover:bg-slate-800 active:scale-90 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next slide"
                    onClick={nextSlide}
                    className="grid size-8 sm:size-9 place-items-center rounded-lg border border-white/20 bg-slate-900/80 text-white hover:bg-slate-800 active:scale-90 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Curated Promo Tiles (Desktop only, 4 or 3 cols) */}
          <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col gap-4">
            {/* Promo Card 1: IoT & Hardware Labs */}
            <div className="flex-1 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/60 p-5 flex flex-col justify-between shadow-xl group hover:border-blue-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">
                    Makers & Labs
                  </span>
                  <div className="size-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                    <Cpu className="size-3.5" />
                  </div>
                </div>
                <h3 className="mt-2 text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                  IoT & ESP Microcontrollers
                </h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Wi-Fi SoC boards, motor drivers and analog sensor modules stocked in Colombo.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Fast Shipping</span>
                <Link
                  to="/category/$slug"
                  params={{ slug: "iot-and-microcontrollers" }}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
                >
                  <span>Explore</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>

            {/* Promo Card 2: Precision Repair & Bench Supplies */}
            <div className="flex-1 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/50 p-5 flex flex-col justify-between shadow-xl group hover:border-amber-500/40 transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                    Bench Tools
                  </span>
                  <div className="size-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Wrench className="size-3.5" />
                  </div>
                </div>
                <h3 className="mt-2 text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  Professional Repair Kits
                </h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Ceramic heater elements, ESD tweezing tools and precision bits for technicians.
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Bench Grade</span>
                <Link
                  to="/category/$slug"
                  params={{ slug: "repair-kits" }}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 inline-flex items-center gap-1"
                >
                  <span>Explore</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition Strip (Below Hero) */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 text-xs">
            <div className="size-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Zap className="size-4" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white block truncate">Genuine Hardware</span>
              <span className="text-[10px] text-slate-400 truncate block">100% pre-tested components</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 text-xs">
            <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ArrowRight className="size-4" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white block truncate">Island-Wide Delivery</span>
              <span className="text-[10px] text-slate-400 truncate block">Dispatch within 24 hours</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 text-xs">
            <div className="size-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <Cpu className="size-4" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white block truncate">Live ERP Catalog</span>
              <span className="text-[10px] text-slate-400 truncate block">Real stock & verified LKR prices</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-800/80 bg-slate-950/60 text-xs">
            <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="size-4" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-white block truncate">Engineer Support</span>
              <span className="text-[10px] text-slate-400 truncate block">Technical project assistance</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
