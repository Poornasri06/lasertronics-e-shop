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
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/40 via-surface to-surface py-8 sm:py-12 lg:py-16">
      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column Text & CTAs */}
          <div key={index} className="animate-fade-up lg:col-span-7">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              {slide.eyebrow}
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl lg:leading-[1.15]">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {slide.copy}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                to="/category/$slug"
                params={{ slug: slide.slug }}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary-dark hover:shadow-lg active:scale-95"
              >
                {slide.cta}
                <ArrowRight className="size-4" aria-hidden />
              </Link>

              <Link
                to="/shop"
                className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-primary/40 bg-surface px-6 text-sm font-bold text-primary transition-all hover:border-primary hover:bg-accent/50 active:scale-95"
              >
                Browse All Products
              </Link>
            </div>

            {/* Slider Dots */}
            <div className="mt-10 flex items-center gap-3">
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      i === index ? "w-9 bg-primary" : "w-2.5 bg-border hover:bg-primary/50"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-xs font-bold text-muted-foreground">
                0{index + 1} / 0{slides.length}
              </span>
            </div>
          </div>

          {/* Right Column Product Image Showcase */}
          <div className="relative lg:col-span-5">
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-lift sm:aspect-16/10 lg:aspect-square">
              {slides.map((s, i) => (
                <img
                  key={s.slug}
                  src={s.image}
                  alt={s.title}
                  width={1000}
                  height={1000}
                  className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
                    i === index ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                />
              ))}

              {/* Prev / Next controls */}
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  type="button"
                  aria-label="Previous slide"
                  onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
                  className="grid size-9 place-items-center rounded-full bg-surface/90 text-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <ChevronLeft className="size-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label="Next slide"
                  onClick={() => setIndex((i) => (i + 1) % slides.length)}
                  className="grid size-9 place-items-center rounded-full bg-surface/90 text-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <ChevronRight className="size-4" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

