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
  Layers,
  Zap,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { CategoryRail } from "@/components/home/CategoryRail";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/data/products";

// Realistic photography for the 5 category glass cards
import mobileCatImg from "@/assets/p/magsafe-powerbank.jpg";
import electronicsCatImg from "@/assets/p/psu-module.jpg";
import tvCatImg from "@/assets/p/streaming-adapter.jpg";
import iotCatImg from "@/assets/p/esp32.jpg";
import repairCatImg from "@/assets/p/soldering-station.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LASERTRONICS PVT LTD | Apple-Inspired Electronics & Repair Store Sri Lanka" },
      {
        name: "description",
        content:
          "Premium electronics store in Sri Lanka. Mobile accessories, components, TV accessories, IoT dev boards, and precision repair kits priced in LKR with island-wide delivery.",
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

const categoryCardDetails = [
  {
    slug: "mobile-accessories",
    title: "Mobile Accessories",
    desc: "GaN chargers, braided cables & magnetic power banks.",
    image: mobileCatImg,
    icon: Smartphone,
  },
  {
    slug: "electronics",
    title: "Electronics",
    desc: "Power supplies, modules, relays, motors & lab supplies.",
    image: electronicsCatImg,
    icon: CircuitBoard,
  },
  {
    slug: "tv-accessories",
    title: "TV Accessories",
    desc: "High-speed HDMI switches, adapters & optical audio.",
    image: tvCatImg,
    icon: Tv,
  },
  {
    slug: "iot-and-microcontrollers",
    title: "IoT & Microcontrollers",
    desc: "ESP32, NodeMCU, Arduino & industrial sensor shields.",
    image: iotCatImg,
    icon: Cpu,
  },
  {
    slug: "repair-kits",
    title: "Repair Kits",
    desc: "Digital soldering stations, ESD tools & precision drivers.",
    image: repairCatImg,
    icon: Wrench,
  },
];

const benefits = [
  {
    icon: Truck,
    title: "Island-wide Delivery",
    copy: "Dispatched from Colombo within 24 hours.",
  },
  {
    icon: ShieldCheck,
    title: "Genuine Warranty",
    copy: "Every product tested and locally serviced in Sri Lanka.",
  },
  {
    icon: Headphones,
    title: "Engineer Support",
    copy: "Direct technical guidance from experienced hardware builders.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    copy: "Protected checkout with multiple payment options.",
  },
];

const solutionsList = [
  {
    title: "IoT Solutions",
    icon: Zap,
    copy: "Sensor nodes, gateways and cloud integration for agricultural and industrial deployments across Sri Lanka.",
  },
  {
    title: "Embedded Systems",
    icon: Cpu,
    copy: "Custom microcontroller firmware, hardware design and component selection for prototype and production runs.",
  },
  {
    title: "Electronics Prototyping",
    icon: Layers,
    copy: "Passive components, sensors, PCBs and breadboarding supplies for university labs, engineering hubs, and makers.",
  },
  {
    title: "Repair & Maintenance",
    icon: Wrench,
    copy: "Bench-grade tooling, digital soldering stations and ESD supplies for professional technician service centres.",
  },
];

const whyChooseUsList = [
  { icon: Truck, title: "Island-wide Delivery", desc: "Fast courier delivery across all 25 districts in Sri Lanka." },
  { icon: ShieldCheck, title: "Genuine Warranty", desc: "Local warranty and hassle-free replacements." },
  { icon: Headphones, title: "Engineer Support", desc: "Technical advice from real electronics engineers." },
  { icon: CreditCard, title: "Secure Checkout", desc: "Encrypted transactions with transparent LKR pricing." },
  { icon: PackageCheck, title: "Pre-Tested Components", desc: "Every component inspected for voltage & safety tolerance." },
  { icon: Award, title: "Bulk Lab Invoicing", desc: "Special pricing and quotation for educational labs and firms." },
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
  const newArrivals = products.slice(0, 8);

  return (
    <SiteLayout>
      {/* 1. Hero Section with Glass Panel */}
      <Hero />

      {/* 2. Apple-Style Benefits Strip */}
      <section className="container-page py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="glass-card flex items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#0878D1]/30 hover:shadow-md"
            >
              <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#0878D1]/10 text-[#0878D1]">
                <b.icon className="size-5" aria-hidden />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#111827]">{b.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#667085]">{b.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Glass Category Cards */}
      <section className="container-page py-12 lg:py-16">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#0878D1]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0878D1]">
            Curated Categories
          </span>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">
            Explore by Category
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#667085]">
            Precision-engineered ranges built for Sri Lankan makers, technicians, and everyday power.
          </p>
        </div>

        {/* 5 Glass Category Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {categoryCardDetails.map((card) => (
            <Link
              key={card.slug}
              to="/category/$slug"
              params={{ slug: card.slug }}
              className="group relative flex flex-col overflow-hidden rounded-[24px] border border-black/8 bg-white/80 p-5 shadow-glass backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[#0878D1]/40 hover:shadow-glass-hover"
            >
              {/* Product Photo Showcase */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F6F9FC] p-3">
                <img
                  src={card.image}
                  alt={card.title}
                  className="size-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-108"
                />
                <div className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-white/80 text-[#0878D1] shadow-xs backdrop-blur-md">
                  <card.icon className="size-4" />
                </div>
              </div>

              {/* Glass Details & CTA */}
              <div className="mt-4 flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-[#111827] transition-colors group-hover:text-[#0878D1]">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#667085]">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-3">
                  <span className="text-xs font-bold text-[#0878D1]">Shop Now</span>
                  <div className="grid size-7 place-items-center rounded-full bg-[#0878D1]/10 text-[#0878D1] transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-[#0878D1] group-hover:text-white">
                    <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Category Rails (Mobile, Electronics, TV, IoT, Repair Kits) */}
      {categories.map((c) => (
        <CategoryRail key={c.slug} category={c} />
      ))}

      {/* 5. New Arrivals Fresh Stock */}
      <section className="border-y border-black/5 bg-[#EEF5FC]/40 py-12 lg:py-16">
        <div className="container-page">
          <div className="flex items-center justify-between gap-4 pb-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0878D1]">
                <Sparkles className="size-4" />
                Latest Additions
              </div>
              <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
                Fresh Stock Arrivals
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden shrink-0 items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-5 py-2 text-xs font-bold text-[#0878D1] shadow-xs backdrop-blur-md transition-all hover:bg-[#0878D1] hover:text-white sm:inline-flex"
            >
              Browse Catalogue <ArrowRight className="size-3.5" aria-hidden />
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

      {/* 6. DARK PREMIUM SECTION: Solutions (Deep Navy #071A2B with subtle blue/cyan ambient glows) */}
      <section id="solutions" className="relative overflow-hidden bg-[#071A2B] py-16 text-white lg:py-24">
        {/* Subtle Blue & Cyan Ambient Radial Gradients */}
        <div className="pointer-events-none absolute -left-32 top-10 size-96 rounded-full bg-[#0878D1]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 bottom-10 size-96 rounded-full bg-[#12A8E8]/15 blur-3xl" />

        <div className="container-page relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-[#0878D1]/25 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#12A8E8]">
              Engineering Solutions
            </span>
            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Engineered for Sri Lankan Innovation
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
              From IoT prototyping to university robotics and technician service hubs, LASERTRONICS PVT LTD powers electronic projects end-to-end with genuine components and localized engineering support.
            </p>
          </div>

          {/* 4 Dark Glassmorphic Solution Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solutionsList.map((sol) => (
              <div
                key={sol.title}
                className="group relative rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-[#12A8E8]/50 hover:bg-white/8 hover:shadow-[0_0_30px_-5px_rgba(18,168,232,0.3)]"
              >
                <div className="grid size-12 place-items-center rounded-2xl bg-[#0878D1]/20 text-[#12A8E8] transition-colors group-hover:bg-[#0878D1] group-hover:text-white">
                  <sol.icon className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-white transition-colors group-hover:text-[#12A8E8]">
                  {sol.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {sol.copy}
                </p>
              </div>
            ))}
          </div>

          {/* Solutions Call to Action */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#0878D1] px-8 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#0662ab] hover:shadow-cyan-500/20 active:scale-98"
            >
              Consult Engineering Team <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex min-h-12 items-center rounded-full border border-white/20 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
            >
              Learn About Lasertronics
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Why Choose Us (Apple-Style Spacious Grid) */}
      <section className="container-page py-16 lg:py-24">
        <div className="text-center">
          <span className="inline-block rounded-full bg-[#0878D1]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0878D1]">
            Why Lasertronics
          </span>
          <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">
            Why Sri Lanka Chooses Us
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-[#667085]">
            Built with integrity to support the island's builders, technicians, and electronics enthusiasts.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUsList.map((item) => (
            <div
              key={item.title}
              className="glass-card flex items-start gap-4 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#0878D1]/30 hover:shadow-lift"
            >
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#0878D1]/10 text-[#0878D1]">
                <item.icon className="size-6" aria-hidden />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#111827]">{item.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#667085]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Verified Testimonials */}
      <section className="border-t border-black/5 bg-[#EEF5FC]/30 py-16 lg:py-20">
        <div className="container-page">
          <div className="text-center">
            <span className="inline-block rounded-full bg-[#0878D1]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#0878D1]">
              Verified Feedback
            </span>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[#111827] sm:text-4xl">
              Trusted by Sri Lanka’s Hardware Community
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="glass-card flex flex-col justify-between p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-[#111827]/85 italic">
                    "{t.review}"
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2.5 border-t border-black/5 pt-4">
                  <CheckCircle2 className="size-4 text-[#0878D1]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#111827]">{t.name}</h4>
                    <p className="text-[11px] text-[#667085]">{t.role}</p>
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
