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
      <div className="bg-ink py-14 text-ink-foreground lg:py-20 border-b border-ink-muted/15">
        <div className="container-page">
          <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            About Us
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl text-white">
            Electronics Specialists Who Build & Support
          </h1>
          <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-ink-muted">
            LASERTRONICS PVT LTD started at a repair bench in Colombo. Today we supply components,
            accessories and tooling to makers, universities, service centres and businesses across
            Sri Lanka.
          </p>
        </div>
      </div>

      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <p className="font-display text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
            <h2 className="font-display text-xl font-extrabold text-foreground">What We Stand For</h2>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Genuine stock, transparent LKR pricing, and technical support that goes beyond a basic listing.
              If a part is not suitable for your project, we will advise you before purchase.
            </p>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-6 shadow-xs">
            <h2 className="font-display text-xl font-extrabold text-foreground">Who We Serve</h2>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Students building robotics projects, service technicians working daily on bench rework, and companies deploying IoT networks across Sri Lanka.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link
            to="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground transition-all hover:bg-primary-dark shadow-md"
          >
            Get In Touch With Us
          </Link>
        </div>
      </div>
    </SiteLayout>
  );
}

