import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    image: hero1,
    eyebrow: "IoT & Microcontrollers",
    title: "Build connected things, faster",
    copy: "Dev boards, sensors and starter kits stocked in Colombo and shipped island-wide.",
    to: "/category/$slug",
    slug: "iot-and-microcontrollers",
    cta: "Shop dev boards",
  },
  {
    image: hero2,
    eyebrow: "Mobile Accessories",
    title: "Power that keeps up with you",
    copy: "GaN chargers, 100W cables and magnetic power banks built for everyday punishment.",
    to: "/category/$slug",
    slug: "mobile-accessories",
    cta: "Shop accessories",
  },
  {
    image: hero3,
    eyebrow: "Repair Kits",
    title: "Bench-grade tools for real work",
    copy: "Soldering stations, ESD-safe kits and precision drivers trusted by service centres.",
    to: "/category/$slug",
    slug: "repair-kits",
    cta: "Shop repair tools",
  },
];

export function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      {slides.map((s, i) => (
        <img
          key={s.image}
          src={s.image}
          alt=""
          aria-hidden={i !== index}
          width={1600}
          height={900}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${
            i === index ? "opacity-70" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />

      <div className="container-page relative flex min-h-[26rem] flex-col justify-center py-16 sm:min-h-[30rem] lg:min-h-[34rem] lg:py-24">
        <div key={index} className="max-w-xl animate-fade-up">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">
            {slides[index].eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink-foreground sm:text-4xl lg:text-5xl">
            {slides[index].title}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted sm:text-base">
            {slides[index].copy}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/category/$slug"
              params={{ slug: slides[index].slug }}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              {slides[index].cta}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/shop"
              className="inline-flex min-h-12 items-center rounded-full border border-ink-muted/40 px-6 text-sm font-bold text-ink-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Browse all products
            </Link>
          </div>
        </div>

        <div className="mt-10 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={s.image}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-10 bg-primary" : "w-5 bg-ink-muted/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
