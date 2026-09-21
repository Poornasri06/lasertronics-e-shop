import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import hero1 from "@/assets/hero-1-new.png";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    tagline: "GENUINE IOT & EMBEDDED HARDWARE",
    title: "Power Your Next Innovation",
    copy: "Bench-grade tools, dev boards, sensors and precision accessories curated for engineers, makers, and innovators across Sri Lanka.",
    primaryTo: "/shop",
    primaryText: "Shop Now",
    secondaryTo: "/category/iot-and-microcontrollers",
    secondaryText: "Explore Products",
  },
  {
    image: hero3,
    tagline: "BENCH-GRADE SERVICE TOOLS",
    title: "Precision Tools for Master Technicians",
    copy: "Digital soldering stations, ESD-safe toolkits and precision test instruments tested and backed by local warranty.",
    primaryTo: "/category/repair-kits",
    primaryText: "Shop Now",
    secondaryTo: "/shop",
    secondaryText: "Explore Products",
  },
  {
    image: hero2,
    tagline: "NEXT-GEN CHARGING & ACCESSORIES",
    title: "High-Performance Power & Audio",
    copy: "GaN fast chargers, magnetic power banks and ultra-durable braided cables engineered for everyday reliability.",
    primaryTo: "/category/mobile-accessories",
    primaryText: "Shop Now",
    secondaryTo: "/shop",
    secondaryText: "Explore Products",
  },
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current]!;

  return (
    <section className="relative overflow-hidden py-6 sm:py-10 lg:py-14">
      {/* Background Soft Glows */}
      <div className="pointer-events-none absolute -left-20 -top-20 size-96 rounded-full bg-[#0878D1]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 size-96 rounded-full bg-[#12A8E8]/10 blur-3xl" />

      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left: Apple-Style Glass Content Panel */}
          <div className="relative z-10 lg:col-span-7">
            <div className="glass-panel p-6 sm:p-10 lg:p-12 shadow-2xl transition-all duration-500">
              {/* Tagline */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0878D1]/20 bg-[#0878D1]/8 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#0878D1]">
                <Sparkles className="size-3.5 text-[#0878D1]" />
                <span>{slide.tagline}</span>
              </div>

              {/* Headline */}
              <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[#111827] sm:text-4xl lg:text-5xl lg:leading-[1.15]">
                {slide.title}
              </h1>

              {/* Supporting Copy */}
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#667085] sm:text-base">
                {slide.copy}
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {/* Primary Button: Lasertronics Blue Pill */}
                <Link
                  to={slide.primaryTo}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#0878D1] px-8 text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#0662ab] hover:shadow-lg active:scale-98"
                >
                  <span>{slide.primaryText}</span>
                  <ArrowRight className="size-4" />
                </Link>

                {/* Secondary Button: Pill Shape */}
                <Link
                  to={slide.secondaryTo}
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/10 bg-white/70 px-7 text-sm font-semibold text-[#111827] backdrop-blur-md transition-all duration-200 hover:border-[#0878D1] hover:bg-white hover:text-[#0878D1] active:scale-98"
                >
                  {slide.secondaryText}
                </Link>
              </div>

              {/* Slider Progress Controls */}
              <div className="mt-10 flex items-center justify-between border-t border-black/5 pt-6">
                <div className="flex items-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Slide ${i + 1}`}
                      onClick={() => setCurrent(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === current
                          ? "w-8 bg-[#0878D1]"
                          : "w-2 bg-black/15 hover:bg-[#0878D1]/50"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Previous slide"
                    onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
                    className="grid size-9 place-items-center rounded-full border border-black/10 bg-white/80 text-[#111827] shadow-xs transition-colors hover:bg-[#0878D1] hover:text-white"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next slide"
                    onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
                    className="grid size-9 place-items-center rounded-full border border-black/10 bg-white/80 text-[#111827] shadow-xs transition-colors hover:bg-[#0878D1] hover:text-white"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Realistic Electronics Photo Showcase */}
          <div className="relative lg:col-span-5">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-white/60 bg-white/40 shadow-2xl backdrop-blur-xs sm:aspect-16/10 lg:aspect-square">
              {slides.map((s, i) => (
                <img
                  key={s.image}
                  src={s.image}
                  alt={s.title}
                  width={1000}
                  height={1000}
                  className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ease-in-out ${
                    i === current ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                  }`}
                />
              ))}

              {/* Subtly tinted glass bottom highlight badge */}
              <div className="absolute bottom-4 left-4 right-4 glass-card p-3 shadow-md">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#111827]">Tested in Sri Lanka</span>
                  <span className="font-semibold text-[#0878D1]">100% Genuine Guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
