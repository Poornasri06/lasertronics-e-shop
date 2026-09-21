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
  Award,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { CategoryRail } from "@/components/home/CategoryRail";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/data/products";

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

const categoryIcons = [Smartphone, CircuitBoard, Tv, Cpu, Wrench];

const benefits = [
  {
    icon: Truck,
    title: "Island-wide delivery",
    copy: "Dispatched from Colombo within 24 hours.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine warranty",
    copy: "Every product covered and locally serviced.",
  },
  {
    icon: Headphones,
    title: "Engineer support",
    copy: "Talk to people who actually build things.",
  },
  {
    icon: CreditCard,
    title: "Secure payments",
    copy: "Safe and convenient checkout options.",
  },
];

const solutionsList = [
  {
    title: "IoT Solutions",
    copy: "Sensor nodes, gateways and cloud integration for agricultural and industrial deployments across Sri Lanka.",
  },
  {
    title: "Embedded Systems",
    copy: "Custom microcontrollers, hardware design and component selection for prototype and production runs.",
  },
  {
    title: "Electronics Prototyping",
    copy: "Passive components, sensors, PCBs and breadboarding supplies for labs, university projects and makers.",
  },
  {
    title: "Repair & Maintenance",
    copy: "Bench-grade tools, digital soldering stations and ESD supplies for service hubs and repair technicians.",
  },
];

const whyChooseUsList = [
  { icon: Truck, title: "Island-wide Delivery", desc: "Fast shipping to any location in Sri Lanka." },
  { icon: ShieldCheck, title: "Genuine Warranty", desc: "Local warranty and technical service support." },
  { icon: Headphones, title: "Engineer Support", desc: "Technical guidance directly from experienced builders." },
  { icon: CreditCard, title: "Secure Payments", desc: "Encrypted checkout with multiple payment methods." },
  { icon: PackageCheck, title: "Quality Products", desc: "Pre-tested electronic components and tools." },
  { icon: Award, title: "Bulk Orders", desc: "Special pricing for educational labs and service centres." },
];

const testimonials = [
  {
    name: "Kamal Perera",
    role: "Electronics Technician, Colombo",
    review: "The digital soldering station and ESD tools are genuine bench grade. Delivered to Colombo in less than 24 hours.",
    rating: 5,
  },
  {
    name: "Dinesh Jayawardena",
    role: "IoT Hardware Engineer",
    review: "ESP32 boards and sensor modules arrived in great condition. Lasertronics PVT LTD is my go-to supplier for hardware prototypes.",
    rating: 5,
  },
  {
    name: "Nipuni Samarasinghe",
    role: "University Robotics Lead",
    review: "Super fast response from their team for our lab's bulk motor and component order. High quality customer service.",
    rating: 5,
  },
];

function Index() {
  const newArrivals = products.slice(0, 6);

  return (
    <SiteLayout>
      {/* 1. Hero Carousel */}
      <Hero />

      {/* 2. iOS Widget Benefits Section */}
      <section className="py-6">
        <div className="container-page">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="glass-card group relative flex items-start gap-4 rounded-2xl border border-white/80 bg-white/70 p-4.5 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.05),inset_0_1px_0_0_rgba(255,255,255,0.95)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/85 hover:shadow-md"
              >
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-500/15 via-sky-400/10 to-transparent text-primary shadow-xs transition-transform duration-300 group-hover:scale-105">
                  <b.icon className="size-5.5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold tracking-tight text-foreground/90">{b.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{b.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Shop by Category (iOS App Store Tiles) */}
      <section className="container-page py-12 lg:py-16">
        <div className="text-center">
          <span className="inline-block rounded-full border border-white/80 bg-white/70 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-primary shadow-xs backdrop-blur-md">
            Curated Ranges
          </span>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            Shop by Category
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground sm:text-sm">
            Five focused ranges for Sri Lankan makers, technicians and households.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4.5 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c, i) => {
            const Icon = categoryIcons[i] ?? Cpu;
            return (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="glass-card group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/80 bg-white/70 p-5.5 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.06),inset_0_1px_0_0_rgba(255,255,255,0.95)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400/50 hover:bg-white/90 hover:shadow-xl"
              >
                {/* Specular highlight */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

                <div>
                  <div className="grid size-12.5 place-items-center rounded-2xl border border-white/30 bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md transition-all duration-300 group-hover:scale-108 group-hover:shadow-lg">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {c.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{c.tagline}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-200/50 pt-3">
                  <span className="text-xs font-bold text-primary">Explore Category</span>
                  <ArrowRight className="size-3.5 text-primary transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Category Rails (Products per category) */}
      {categories.map((c) => (
        <CategoryRail key={c.slug} category={c} />
      ))}

      {/* 5. New Arrivals Horizontal Glass Carousel */}
      <section className="py-12 lg:py-16">
        <div className="container-page">
          <div className="flex items-center justify-between gap-4 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/70 px-3 py-0.5 text-xs font-extrabold uppercase tracking-[0.2em] text-primary shadow-xs backdrop-blur-md">
                <Sparkles className="size-3.5" />
                Fresh Stock
              </div>
              <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop"
              className="apple-btn-glass hidden shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-foreground hover:text-primary sm:inline-flex"
            >
              Browse All Products <ArrowRight className="size-3.5 text-primary" aria-hidden />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {newArrivals.map((p) => (
              <div key={p.slug} className="w-[240px] shrink-0 sm:w-[260px]">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Solutions Section (Apple Pro Workstation Dark Glass) */}
      <section id="solutions" className="container-page py-12 lg:py-16">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-[#0A192F]/88 p-8 text-white shadow-2xl backdrop-blur-2xl sm:p-12 lg:p-16">
          {/* Ambient inner neon glows */}
          <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-blue-500/25 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden />

          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-sky-300 backdrop-blur-md">
              Engineering Support
            </span>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Solutions for Makers, Engineers & Businesses
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300/90 sm:text-base">
              LASERTRONICS PVT LTD supplies and supports electronics projects end to end — component sourcing, bulk pricing and technical guidance from experts.
            </p>
          </div>

          <div className="relative z-10 mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {solutionsList.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:border-sky-400/40 hover:bg-white/10 hover:shadow-lg"
              >
                <div className="mb-4 size-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                <h3 className="text-base font-bold text-white transition-colors group-hover:text-sky-300">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300/80">{s.copy}</p>
              </div>
            ))}
          </div>

          <div className="relative z-10 mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="apple-btn-primary inline-flex min-h-12 items-center gap-2 rounded-full px-8 text-sm font-bold shadow-lg"
            >
              Talk to Our Engineering Team <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Why Choose Us (iOS Frosted Cards) */}
      <section className="container-page py-12 lg:py-16">
        <div className="text-center">
          <span className="inline-block rounded-full border border-white/80 bg-white/70 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-primary shadow-xs backdrop-blur-md">
            Why Lasertronics
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            Why Choose Us
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-xs text-muted-foreground sm:text-sm">
            Built for Sri Lankan engineers, technicians, makers, and businesses.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUsList.map((item) => (
            <div
              key={item.title}
              className="glass-card group flex items-start gap-4 rounded-2xl border border-white/80 bg-white/70 p-5 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.05),inset_0_1px_0_0_rgba(255,255,255,0.95)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-400/40 hover:bg-white/90 hover:shadow-md"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-500/15 via-sky-400/10 to-transparent text-primary shadow-xs transition-transform duration-300 group-hover:scale-105">
                <item.icon className="size-6" aria-hidden />
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight text-foreground/90">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Customer Testimonials (Frosted Glass Review Widgets) */}
      <section className="container-page py-12 lg:py-16">
        <div className="text-center">
          <span className="inline-block rounded-full border border-white/80 bg-white/70 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-primary shadow-xs backdrop-blur-md">
            Customer Feedback
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            What Our Customers Say
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="glass-card flex flex-col justify-between rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.06),inset_0_1px_0_0_rgba(255,255,255,0.95)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div>
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400" />
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-foreground/80 italic">
                  "{t.review}"
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2.5 border-t border-slate-200/60 pt-4">
                <CheckCircle2 className="size-4.5 text-primary" />
                <div>
                  <h4 className="text-xs font-bold text-foreground">{t.name}</h4>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}

