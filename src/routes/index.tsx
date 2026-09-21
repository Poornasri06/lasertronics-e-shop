import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Truck,
  ShieldCheck,
  Headphones,
  CreditCard,
  Wrench,
  Cpu,
  Tv,
  Smartphone,
  CircuitBoard,
  CheckCircle2,
  Star,
  Sparkles,
  ChevronRight,
  Layers,
  Zap,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { CategoryRail } from "@/components/home/CategoryRail";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/data/products";

// Real imagery for Bento cards
import esp32Img from "@/assets/p/esp32.jpg";
import roboticsImg from "@/assets/p/robotics-kit.jpg";
import earbudsImg from "@/assets/p/earbuds.jpg";
import tvImg from "@/assets/p/streaming-adapter.jpg";
import toolsImg from "@/assets/p/soldering-station.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LASERTRONICS PVT LTD | Electronics, IoT & Repair Store Sri Lanka" },
      {
        name: "description",
        content:
          "Shop mobile accessories, electronic components, TV accessories, IoT boards and repair kits in Sri Lanka. Genuine stock, LKR pricing, island-wide delivery.",
      },
      { property: "og:title", content: "LASERTRONICS PVT LTD | Electronics Store Sri Lanka" },
      {
        property: "og:description",
        content:
          "Components, accessories and bench tools for makers, technicians and businesses across Sri Lanka.",
      },
    ],
  }),
  component: Index,
});

const benefits = [
  {
    icon: Truck,
    title: "Island-wide Delivery",
    copy: "Dispatched from Colombo within 24 hours to your doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine Warranty",
    copy: "Every item 100% genuine with local warranty protection.",
  },
  {
    icon: Headphones,
    title: "Engineer Support",
    copy: "Hardware advice from engineers who actively build and solder.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    copy: "Encrypted LKR checkout with card and bank transfer options.",
  },
];

const solutionsList = [
  {
    icon: Cpu,
    tag: "Embedded IoT",
    title: "Smart Agriculture & Sensor Nodes",
    copy: "Industrial sensor nodes, ESP32 gateways, and LoRa modules optimized for Sri Lankan agricultural & weather monitoring deployments.",
  },
  {
    icon: Zap,
    tag: "Robotics",
    title: "Robotics & Automation Hardware",
    copy: "Servo controllers, DC gearmotors, PWM drivers, and chassis kits designed for competitive university teams and makers.",
  },
  {
    icon: Layers,
    tag: "Prototyping",
    title: "Embedded Systems Prototyping",
    copy: "From breakout boards and solderless breadboards to IC adapters and logic analyzers for rapid hardware R&D cycles.",
  },
  {
    icon: Wrench,
    tag: "Bench Tooling",
    title: "Bench-Grade Repair & Maintenance",
    copy: "Micro-soldering stations, ESD safe mats, optical microscopes, and precision screwdrivers for dedicated service centers.",
  },
];

const testimonials = [
  {
    name: "Kamal Perera",
    role: "Senior Electronics Technician, Colombo",
    review:
      "The digital soldering station and ESD tools from Lasertronics are bench-grade quality. Dispatched quickly and handled the daily workload effortlessly.",
    rating: 5,
    tag: "Verified Hardware Purchase",
  },
  {
    name: "Dinesh Jayawardena",
    role: "IoT Solutions Architect",
    review:
      "ESP32 dev boards and sensor modules were in immaculate original packaging. Lasertronics is our primary hardware supplier for production pilot builds.",
    rating: 5,
    tag: "Verified IoT Purchase",
  },
  {
    name: "Nipuni Samarasinghe",
    role: "University Robotics Society Lead",
    review:
      "Exceptional response time for bulk lab orders. Their engineering background makes a huge difference when selecting compatible controllers.",
    rating: 5,
    tag: "Verified Lab Partner",
  },
];

function Index() {
  const featuredHardware = products.slice(0, 8);

  return (
    <SiteLayout>
      {/* 1. Apple Centered Floating Hero */}
      <Hero />

      {/* 2. Apple Horizontal Floating Glass Benefits Cards */}
      <section className="relative z-10 -mt-6 py-6 sm:-mt-10 sm:py-8">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="apple-glass group relative flex items-start gap-4 rounded-[26px] p-5.5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,113,227,0.12)]"
              >
                <div className="grid size-12 shrink-0 place-items-center rounded-full border border-[#0071e3]/20 bg-[#0071e3]/10 text-[#0071e3] transition-transform duration-300 group-hover:scale-110">
                  <b.icon className="size-5.5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold tracking-tight text-[#1d1d1f]">
                    {b.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {b.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Bento Grid: Explore Lasertronics */}
      <section className="container-page py-16 lg:py-24">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#0071e3] shadow-xs backdrop-blur-md">
            <Sparkles className="size-3.5" /> Curated Ecosystem
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-4xl lg:text-5xl">
            Explore Lasertronics.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            From precision microcontrollers to high-speed charging and bench equipment, engineered for high reliability.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-2">
          {/* Bento Card 1: Large Featured IoT & Microcontrollers (spans 2 cols & 2 rows on lg) */}
          <Link
            to="/category/$slug"
            params={{ slug: "microcontrollers-iot" }}
            className="apple-glass group relative flex flex-col justify-between overflow-hidden rounded-[32px] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,113,227,0.18)] md:col-span-2 lg:col-span-2 lg:row-span-2"
          >
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <span className="inline-block rounded-full bg-[#0071e3] px-3.5 py-1 text-[11px] font-bold text-white shadow-sm">
                  Flagship Category
                </span>
                <h3 className="mt-4 text-2xl font-bold tracking-tight text-[#1d1d1f] sm:text-3xl">
                  IoT & Microcontrollers
                </h3>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm">
                  ESP32 WiFi+BLE dual-core modules, Arduino Uno R3, sensors, and full wireless prototyping kits.
                </p>
              </div>
              <div className="grid size-11 shrink-0 place-items-center rounded-full border border-white/80 bg-white/70 text-[#0071e3] backdrop-blur-md transition-transform group-hover:scale-110 group-hover:bg-[#0071e3] group-hover:text-white">
                <ArrowRight className="size-4.5" />
              </div>
            </div>

            {/* Dominant Visual Product Showcase */}
            <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-white/60 bg-gradient-to-tr from-slate-100/90 to-blue-50/50 shadow-inner">
              <img
                src={esp32Img}
                alt="ESP32 IoT Development Board"
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-3.5 left-4 flex items-center gap-2 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
                <span>ESP32 & Arduino Compatible</span>
              </div>
            </div>

            <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-200/60 pt-4 text-xs font-semibold text-[#0071e3]">
              <span>Browse Microcontrollers & Sensors</span>
              <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Explore Range →
              </span>
            </div>
          </Link>

          {/* Bento Card 2: Medium Electronics Components */}
          <Link
            to="/category/$slug"
            params={{ slug: "electronics-components" }}
            className="apple-glass group relative flex flex-col justify-between overflow-hidden rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,113,227,0.15)] md:col-span-1 lg:col-span-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block rounded-full bg-white/80 border border-slate-200/80 px-3 py-0.5 text-[11px] font-semibold text-[#0071e3]">
                  Components & Robotics
                </span>
                <h3 className="mt-2.5 text-xl font-bold tracking-tight text-[#1d1d1f]">
                  Electronics & Robotics
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Relays, DC motors, servo drives, breadboards, and IC packs.
                </p>
              </div>
              <div className="grid size-9 shrink-0 place-items-center rounded-full border border-white/80 bg-white/70 text-[#0071e3] backdrop-blur-md transition-transform group-hover:scale-110">
                <ArrowRight className="size-4" />
              </div>
            </div>

            <div className="relative mt-4 aspect-[16/8] w-full overflow-hidden rounded-[20px] border border-white/60 bg-slate-100">
              <img
                src={roboticsImg}
                alt="Electronics and Robotics Kits"
                className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
            </div>
          </Link>

          {/* Bento Card 3: Mobile Accessories */}
          <Link
            to="/category/$slug"
            params={{ slug: "mobile-accessories" }}
            className="apple-glass group relative flex flex-col justify-between overflow-hidden rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,113,227,0.15)]"
          >
            <div>
              <span className="inline-block rounded-full bg-white/80 border border-slate-200/80 px-3 py-0.5 text-[11px] font-semibold text-[#0071e3]">
                Everyday Tech
              </span>
              <h3 className="mt-2 text-lg font-bold tracking-tight text-[#1d1d1f]">
                Mobile Accessories
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                GaN fast chargers, magnetic powerbanks & TWS earbuds.
              </p>
            </div>
            <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-[18px] border border-white/60 bg-slate-100">
              <img
                src={earbudsImg}
                alt="Mobile Accessories"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
            </div>
          </Link>

          {/* Bento Card 4: TV & Video Accessories */}
          <Link
            to="/category/$slug"
            params={{ slug: "tv-accessories" }}
            className="apple-glass group relative flex flex-col justify-between overflow-hidden rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,113,227,0.15)]"
          >
            <div>
              <span className="inline-block rounded-full bg-white/80 border border-slate-200/80 px-3 py-0.5 text-[11px] font-semibold text-[#0071e3]">
                AV Solutions
              </span>
              <h3 className="mt-2 text-lg font-bold tracking-tight text-[#1d1d1f]">
                TV Accessories
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                4K HDMI splitters, streaming cast adapters & audio DACs.
              </p>
            </div>
            <div className="relative mt-4 aspect-square w-full overflow-hidden rounded-[18px] border border-white/60 bg-slate-100">
              <img
                src={tvImg}
                alt="TV & Display Accessories"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
            </div>
          </Link>

          {/* Bento Card 5: Repair Tools */}
          <Link
            to="/category/$slug"
            params={{ slug: "repair-kits" }}
            className="apple-glass group relative flex flex-col justify-between overflow-hidden rounded-[28px] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,113,227,0.15)] md:col-span-2 lg:col-span-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-block rounded-full bg-white/80 border border-slate-200/80 px-3 py-0.5 text-[11px] font-semibold text-[#0071e3]">
                  Bench Grade
                </span>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-[#1d1d1f]">
                  Repair Kits & Bench Tools
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Digital soldering stations, multimeters, anti-static kits & heat guns.
                </p>
              </div>
              <div className="grid size-9 shrink-0 place-items-center rounded-full border border-white/80 bg-white/70 text-[#0071e3] backdrop-blur-md transition-transform group-hover:scale-110">
                <ArrowRight className="size-4" />
              </div>
            </div>
            <div className="relative mt-4 aspect-[16/8] w-full overflow-hidden rounded-[20px] border border-white/60 bg-slate-100">
              <img
                src={toolsImg}
                alt="Bench Repair Tools"
                className="size-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
            </div>
          </Link>
        </div>
      </section>

      {/* 4. Horizontal Glass Product Carousel (4 Desktop / 2 Tablet / 1 Mobile) */}
      <section className="container-page py-12 lg:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#0071e3] shadow-xs backdrop-blur-md">
              <Sparkles className="size-3.5" />
              Curated Selection
            </div>
            <h2 className="mt-2.5 text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-4xl">
              Featured Hardware.
            </h2>
            <p className="mt-1.5 text-xs text-slate-500 sm:text-sm">
              Tested components and accessories ready for immediate dispatch across Sri Lanka.
            </p>
          </div>
          <Link
            to="/shop"
            className="apple-pill-secondary inline-flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 text-xs font-semibold text-[#1d1d1f] hover:text-[#0071e3]"
          >
            Browse Full Catalog <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {/* Carousel Grid / Scroll Area */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredHardware.map((p) => (
            <div key={p.slug} className="h-full">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. Category Rails (Existing categorized collections preserved) */}
      {categories.map((c) => (
        <CategoryRail key={c.slug} category={c} />
      ))}

      {/* 6. Apple Dark Navy Glass Solutions Section */}
      <section id="solutions" className="container-page py-16 lg:py-24">
        <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#080d1a] p-8 text-white shadow-2xl backdrop-blur-2xl sm:p-12 lg:p-16">
          {/* Ambient Lighting Spheres */}
          <div
            className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-[#0071e3]/30 blur-[100px]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-32 -left-32 size-96 rounded-full bg-cyan-400/20 blur-[100px]"
            aria-hidden
          />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 backdrop-blur-md">
              Engineering Expertise
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Built for Makers. Designed for Innovation.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              Lasertronics supplies and empowers Sri Lankan electronics projects end-to-end — from custom component sourcing to industrial prototyping and local warranty support.
            </p>
          </div>

          <div className="relative z-10 mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {solutionsList.map((s) => (
              <div
                key={s.title}
                className="apple-glass-dark group flex flex-col justify-between rounded-[26px] p-6 transition-all duration-300 hover:border-[#0071e3]/60 hover:shadow-[0_16px_36px_rgba(0,113,227,0.25)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
                      {s.tag}
                    </span>
                    <s.icon className="size-5 text-[#0071e3] transition-transform group-hover:scale-110" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white transition-colors group-hover:text-cyan-200">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300/80">
                    {s.copy}
                  </p>
                </div>
                <div className="mt-6 border-t border-white/10 pt-3 text-[11px] font-semibold text-cyan-300 group-hover:text-white transition-colors">
                  Learn engineering specs →
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-12 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="apple-pill-primary inline-flex min-h-12 items-center gap-2 px-8 text-sm font-semibold shadow-xl"
            >
              Talk to Our Engineering Team <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/about"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20"
            >
              About Lasertronics
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Layered Floating Glass Testimonials Section */}
      <section className="container-page py-16 lg:py-24">
        <div className="text-center">
          <span className="inline-block rounded-full border border-white/80 bg-white/70 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#0071e3] shadow-xs backdrop-blur-md">
            Customer Feedback
          </span>
          <h2 className="mt-2.5 text-3xl font-extrabold tracking-tight text-[#1d1d1f] sm:text-4xl">
            Trusted by Builders Across Sri Lanka.
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-slate-500 sm:text-sm">
            Hear from technicians, engineers and researchers who depend on Lasertronics hardware.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={t.name}
              className={`apple-glass group flex flex-col justify-between rounded-[28px] p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,113,227,0.15)] ${
                idx === 1 ? "md:-translate-y-2 border-white/90 shadow-[0_16px_40px_rgba(0,0,0,0.06)]" : ""
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    {t.tag}
                  </span>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-slate-700 italic">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3 border-t border-slate-200/60 pt-4">
                <div className="grid size-10 place-items-center rounded-full bg-[#0071e3]/10 text-[#0071e3] font-bold text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-1">
                    {t.name}
                    <CheckCircle2 className="size-3.5 text-[#0071e3]" />
                  </h4>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

