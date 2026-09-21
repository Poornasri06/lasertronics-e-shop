import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "@/assets/hero-1-new.png";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
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
  {
    image: hero2,
    eyebrow: "MOBILE ACCESSORIES",
    title: "Power that keeps up with you",
    copy: "GaN chargers, 100W cables and magnetic power banks built for everyday punishment.",
    slug: "mobile-accessories",
    cta: "Shop Accessories",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index]!;

  return (
    <section className="relative overflow-hidden py-10 sm:py-14 lg:py-20">
      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column Text & CTAs */}
          <div key={index} className="animate-fade-up lg:col-span-7">
            {/* iOS Glass Pill Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-primary shadow-xs backdrop-blur-xl">
              <span className="size-2 rounded-full bg-blue-500 animate-ping" />
              {slide.eyebrow}
            </div>

            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.12]">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {slide.copy}
            </p>

            {/* Apple Keynote Glass Micro-Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-3 py-1 text-[11px] font-semibold text-foreground/80 shadow-xs backdrop-blur-md">
                ✓ 100% Genuine Stock
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-3 py-1 text-[11px] font-semibold text-foreground/80 shadow-xs backdrop-blur-md">
                ⚡ 24h Colombo Dispatch
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/60 px-3 py-1 text-[11px] font-semibold text-foreground/80 shadow-xs backdrop-blur-md">
                🛡️ Local Warranty
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                to="/category/$slug"
                params={{ slug: slide.slug }}
                className="apple-btn-primary inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold shadow-lg"
              >
                {slide.cta}
                <ArrowRight className="size-4" aria-hidden />
              </Link>

              <Link
                to="/shop"
                className="apple-btn-glass inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-bold text-foreground/90 shadow-sm"
              >
                Browse All Products
              </Link>
            </div>

            {/* iOS Slider Dots */}
            <div className="mt-10 flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/80 bg-white/60 p-1.5 backdrop-blur-md shadow-xs">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === index
                        ? "w-8 bg-blue-600 shadow-[0_2px_8px_rgba(8,120,209,0.4)]"
                        : "w-2.5 bg-slate-300/80 hover:bg-blue-400"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-muted-foreground/80">
                0{index + 1} / 0{slides.length}
              </span>
            </div>
          </div>

          {/* Right Column Product Image Showcase in Frosted Glass Frame */}
          <div className="relative lg:col-span-5">
            <div className="relative rounded-3xl border border-white/90 bg-white/70 p-2.5 shadow-[0_20px_50px_-10px_rgba(10,35,80,0.16),inset_0_1px_0_0_rgba(255,255,255,1)] backdrop-blur-2xl sm:p-3.5">
              {/* Glass Inner Frame */}
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100/90 to-slate-200/60 sm:aspect-16/10 lg:aspect-square">
                {slides.map((s, i) => (
                  <img
                    key={s.slug}
                    src={s.image}
                    alt={s.title}
                    width={1000}
                    height={1000}
                    className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
                      i === index ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                    }`}
                  />
                ))}

                {/* Floating Frosted Glass Prev / Next controls */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    type="button"
                    aria-label="Previous slide"
                    onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
                    className="grid size-9.5 place-items-center rounded-full border border-white/80 bg-white/80 text-foreground shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-105 active:scale-90"
                  >
                    <ChevronLeft className="size-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label="Next slide"
                    onClick={() => setIndex((i) => (i + 1) % slides.length)}
                    className="grid size-9.5 place-items-center rounded-full border border-white/80 bg-white/80 text-foreground shadow-md backdrop-blur-md transition-all hover:bg-white hover:scale-105 active:scale-90"
                  >
                    <ChevronRight className="size-4" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


