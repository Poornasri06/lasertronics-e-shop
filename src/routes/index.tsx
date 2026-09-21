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

      {/* 2. Benefits Section */}
      <section className="border-y border-border/80 bg-surface py-8">
        <div className="container-page grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="flex items-start gap-4 rounded-xl border border-border/50 bg-secondary/30 p-4 transition-all hover:border-primary/40 hover:bg-secondary/60"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <b.icon className="size-5" aria-hidden />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{b.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{b.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section className="container-page py-12 lg:py-16">
        <div className="text-center">
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Curated Ranges
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">Shop by Category</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Five focused ranges for Sri Lankan makers, technicians and households.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c, i) => {
            const Icon = categoryIcons[i] ?? Cpu;
            return (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group flex flex-col justify-between rounded-xl border border-border bg-surface p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lift"
              >
                <div>
                  <div className="grid size-12 place-items-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-6" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-display text-base font-bold leading-snug text-foreground group-hover:text-primary">
                    {c.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{c.tagline}</p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="text-xs font-bold text-primary">Shop Now</span>
                  <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Category Rails (6 products per category) */}
      {categories.map((c) => (
        <CategoryRail key={c.slug} category={c} />
      ))}

      {/* 5. New Arrivals Horizontal Carousel */}
      <section className="bg-secondary/40 py-12 lg:py-16 border-y border-border/60">
        <div className="container-page">
          <div className="flex items-center justify-between gap-4 pb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Sparkles className="size-4" />
                Fresh Stock
              </div>
              <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">New Arrivals</h2>
            </div>
            <Link
              to="/shop"
              className="hidden shrink-0 items-center gap-1.5 text-sm font-bold text-primary hover:underline sm:inline-flex"
            >
              Browse All Products <ArrowRight className="size-4" aria-hidden />
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

      {/* 6. Solutions Section (Dark Navy #0A192F) */}
      <section id="solutions" className="bg-ink py-16 text-ink-foreground lg:py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Engineering Support
            </span>
            <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl lg:text-4xl text-white">
              Solutions for Makers, Engineers & Businesses
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base">
              LASERTRONICS PVT LTD supplies and supports electronics projects end to end — component sourcing, bulk pricing and technical guidance from experts.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {solutionsList.map((s) => (
              <div
                key={s.title}
                className="group rounded-xl border border-ink-muted/20 bg-surface/5 p-6 transition-all duration-300 hover:border-primary hover:bg-surface/10"
              >
                <div className="size-2.5 rounded-full bg-primary mb-4" />
                <h3 className="text-base font-bold text-white group-hover:text-primary transition-colors">
                  {s.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">{s.copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground transition-all hover:bg-primary-dark shadow-md"
            >
              Talk to Our Engineering Team <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Why Choose Us */}
      <section className="bg-surface py-16 lg:py-20 border-b border-border/80">
        <div className="container-page">
          <div className="text-center">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Why Lasertronics
            </span>
            <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">Why Choose Us</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Built for Sri Lankan engineers, technicians, makers, and businesses.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUsList.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-xl border border-border bg-surface p-5 shadow-xs transition-all hover:border-primary/50 hover:shadow-card"
              >
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-primary">
                  <item.icon className="size-6" aria-hidden />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonials Section */}
      <section className="bg-secondary/30 py-16 lg:py-20">
        <div className="container-page">
          <div className="text-center">
            <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Customer Feedback
            </span>
            <h2 className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">What Our Customers Say</h2>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col justify-between rounded-xl border border-border bg-surface p-6 shadow-card"
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
                <div className="mt-6 border-t border-border/60 pt-4 flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  <div>
                    <h4 className="text-xs font-bold text-foreground">{t.name}</h4>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

