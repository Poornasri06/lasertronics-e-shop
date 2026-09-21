import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | LASERTRONICS PVT LTD" },
      {
        name: "description",
        content:
          "LASERTRONICS PVT LTD supplies electronic components, accessories and bench tools to makers, service centres and businesses across Sri Lanka.",
      },
      { property: "og:title", content: "About LASERTRONICS PVT LTD" },
      {
        property: "og:description",
        content: "Colombo-based electronics supplier serving makers and technicians island-wide.",
      },
    ],
  }),
  component: AboutPage,
});

const stats = [
  { value: "50+", label: "Products in stock" },
  { value: "5", label: "Focused categories" },
  { value: "24h", label: "Dispatch from Colombo" },
  { value: "100%", label: "Genuine warranty" },
];

function AboutPage() {
  return (
    <SiteLayout>
      {/* iOS Frosted Glass Banner */}
      <div className="relative overflow-hidden border-b border-white/60 bg-gradient-to-b from-blue-50/40 via-white/50 to-white/70 py-12 backdrop-blur-xl lg:py-16">
        <div className="container-page">
          <span className="inline-block rounded-full border border-white/80 bg-white/75 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-primary shadow-xs backdrop-blur-md">
            Our Story & Heritage
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Electronics Specialists Who Build & Support
          </h1>
          <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
            LASERTRONICS PVT LTD started at a repair bench in Colombo. Today we supply components,
            accessories and tooling to makers, universities, service centres and businesses across Sri Lanka.
          </p>
        </div>
      </div>

      <div className="container-page py-12 lg:py-16">
        {/* iOS Frosted Stats Widgets */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass-card rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.06),inset_0_1px_0_0_rgba(255,255,255,0.95)] backdrop-blur-xl"
            >
              <p className="font-display text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section className="glass-card rounded-3xl border border-white/80 bg-white/75 p-7 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.06),inset_0_1px_0_0_rgba(255,255,255,0.95)] backdrop-blur-xl">
            <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground">What We Stand For</h2>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Genuine stock, transparent LKR pricing, and technical support that goes beyond a basic listing.
              If a part is not suitable for your project, our engineers will advise you before purchase.
            </p>
          </section>

          <section className="glass-card rounded-3xl border border-white/80 bg-white/75 p-7 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.06),inset_0_1px_0_0_rgba(255,255,255,0.95)] backdrop-blur-xl">
            <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground">Who We Serve</h2>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Students building robotics projects, service technicians working daily on bench rework, and companies deploying IoT networks across Sri Lanka.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link
            to="/contact"
            className="apple-btn-primary inline-flex min-h-12 items-center justify-center rounded-full px-8 text-sm font-bold shadow-lg"
          >
            Get In Touch With Us
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}

