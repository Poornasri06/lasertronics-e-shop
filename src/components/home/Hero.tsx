import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Truck, Headphones, Sparkles } from "lucide-react";
import hero1 from "@/assets/hero-1-new.png";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const heroSlides = [
  {
    image: hero1,
    category: "IoT & Microcontrollers",
    badge: "Connected Hardware",
    name: "ESP32, Arduino & Robotics Dev Kits",
    slug: "iot-and-microcontrollers",
  },
  {
    image: hero3,
    category: "Bench & Repair Tools",
    badge: "Precision Tools",
    name: "Digital Soldering Stations & ESD Kits",
    slug: "repair-kits",
  },
  {
    image: hero2,
    category: "Mobile Accessories",
    badge: "Next-Gen Power",
    name: "100W GaN Chargers & Magnetic Power",
    slug: "mobile-accessories",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), 6500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      <div className="container-page relative z-10">
        {/* Top Centered Apple-Style Header Section */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#0878d1] shadow-[0_2px_12px_rgba(8,120,209,0.08)] backdrop-blur-xl">
            <Sparkles className="size-3.5 text-[#0878d1]" />
            Lasertronics PVT LTD · Premium Electronics
          </div>

          {/* Large Centered Headline */}
          <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-[#0f172a] sm:text-5xl lg:text-6xl lg:leading-[1.12]">
            Technology for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-[#0878d1] via-[#0284c7] to-[#005bb5] bg-clip-text text-transparent">
              What You Build.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-slate-600 max-w-2xl mx-auto">
            Electronics, IoT hardware, mobile accessories and professional repair tools from Lasertronics PVT LTD.
          </p>

          {/* Blue Pill Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/shop"
              className="apple-pill-primary min-h-12 px-8 text-sm font-bold shadow-lg"
            >
              Shop Products <ArrowRight className="ml-2 size-4" />
            </Link>
            <a
              href="#categories"
              className="apple-pill-secondary min-h-12 px-7 text-sm font-bold"
            >
              Explore Categories
            </a>
          </div>
        </div>

        {/* Centerpiece Floating Product Stage */}
        <div className="relative mx-auto mt-12 max-w-4xl">
          {/* Soft Blue / Cyan Ambient Glow Behind Showcase */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[420px] sm:size-[560px] rounded-full bg-gradient-to-tr from-[#0878d1]/25 via-cyan-400/20 to-blue-300/15 blur-[90px]"
            aria-hidden
          />

          {/* Large Floating Glass Showcase Card */}
          <div className="apple-glass relative overflow-hidden p-3 sm:p-4 border border-white/80 shadow-[0_20px_60px_-15px_rgba(8,120,209,0.18),inset_0_1px_0_0_rgba(255,255,255,1)]">
            <div className="relative aspect-16/10 sm:aspect-16/9 lg:aspect-21/10 overflow-hidden rounded-[22px] bg-gradient-to-b from-slate-100/90 to-slate-200/50">
              {heroSlides.map((slide, i) => (
                <div
                  key={slide.slug}
                  className={`absolute inset-0 size-full transition-opacity duration-700 ease-in-out ${
                    i === index ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.name}
                    width={1200}
                    height={700}
                    className="size-full object-cover"
                  />
                  {/* Glass gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                  
                  {/* Bottom caption overlay */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex items-end justify-between gap-4">
                    <div className="text-white">
                      <span className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                        {slide.badge}
                      </span>
                      <h3 className="mt-1.5 font-display text-lg sm:text-2xl font-bold tracking-tight text-white">
                        {slide.name}
                      </h3>
                    </div>
                    <Link
                      to="/category/$slug"
                      params={{ slug: slide.slug }}
                      className="apple-pill-primary hidden sm:inline-flex min-h-10 px-5 text-xs"
                    >
                      View Range
                    </Link>
                  </div>
                </div>
              ))}

              {/* Prev / Next controls */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  type="button"
                  aria-label="Previous showcase"
                  onClick={() => setIndex((i) => (i - 1 + heroSlides.length) % heroSlides.length)}
                  className="grid size-9 place-items-center rounded-full border border-white/60 bg-white/60 text-foreground backdrop-blur-md shadow-sm transition-all hover:bg-white active:scale-90"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next showcase"
                  onClick={() => setIndex((i) => (i + 1) % heroSlides.length)}
                  className="grid size-9 place-items-center rounded-full border border-white/60 bg-white/60 text-foreground backdrop-blur-md shadow-sm transition-all hover:bg-white active:scale-90"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Floating Glass Spec Cards Around the Product */}
          {/* Card 1: Fast Delivery (Top-Left / Floating) */}
          <div className="apple-glass absolute -top-5 -left-4 sm:-top-6 sm:-left-8 hidden sm:flex items-center gap-3 px-4.5 py-3 shadow-[0_12px_35px_rgba(8,120,209,0.14)] backdrop-blur-xl border border-white/90">
            <div className="grid size-9 place-items-center rounded-full bg-blue-500/15 text-[#0878d1]">
              <Truck className="size-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Fast Delivery</p>
              <p className="text-[10px] text-muted-foreground">Island-wide dispatch in 24h</p>
            </div>
          </div>

          {/* Card 2: Engineer Support (Bottom-Right / Floating) */}
          <div className="apple-glass absolute -bottom-5 -right-4 sm:-bottom-6 sm:-right-8 hidden sm:flex items-center gap-3 px-4.5 py-3 shadow-[0_12px_35px_rgba(8,120,209,0.14)] backdrop-blur-xl border border-white/90">
            <div className="grid size-9 place-items-center rounded-full bg-sky-500/15 text-[#0878d1]">
              <Headphones className="size-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Engineer Support</p>
              <p className="text-[10px] text-muted-foreground">Hardware advice for builders</p>
            </div>
          </div>

          {/* Card 3: Genuine Warranty (Bottom-Left / Floating) */}
          <div className="apple-glass absolute -bottom-5 left-10 hidden lg:flex items-center gap-3 px-4.5 py-2.5 shadow-[0_12px_35px_rgba(8,120,209,0.14)] backdrop-blur-xl border border-white/90">
            <div className="grid size-8 place-items-center rounded-full bg-emerald-500/15 text-emerald-600">
              <ShieldCheck className="size-4" />
            </div>
            <p className="text-xs font-bold text-foreground">100% Genuine Warranty</p>
          </div>
        </div>

        {/* Indicator Dots */}
        <div className="mt-8 flex justify-center items-center gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index
                  ? "w-8 bg-[#0878d1] shadow-[0_2px_8px_rgba(8,120,209,0.4)]"
                  : "w-2 bg-slate-300/80 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
