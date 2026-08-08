import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Lasertronics | Electronics Supplier in Colombo" },
      {
        name: "description",
        content:
          "Lasertronics supplies electronic components, accessories and bench tools to makers, service centres and businesses across Sri Lanka.",
      },
      { property: "og:title", content: "About Lasertronics" },
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
      <div className="bg-ink py-14 text-ink-foreground lg:py-20">
        <div className="container-page">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">About us</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-extrabold sm:text-4xl">
            Electronics people who actually build things
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted">
            Lasertronics started at a repair bench in Colombo. Today we supply components,
            accessories and tooling to makers, universities, service centres and businesses across
            Sri Lanka — with the same hands-on advice we have always given.
          </p>
        </div>
      </div>

      <div className="container-page py-12 lg:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <p className="font-display text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="text-xl font-extrabold">What we stand for</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Genuine stock, honest pricing in rupees and technical support that goes beyond a
              product listing. If a part is wrong for your project, we will tell you before you buy
              it.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-extrabold">Who we serve</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Students building their first robot, technicians reworking boards daily, and teams
              rolling out sensor networks. Same catalogue, tailored guidance.
            </p>
          </section>
        </div>

        <Link
          to="/contact"
          className="mt-10 inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
        >
          Get in touch
        </Link>
      </div>
    </SiteLayout>
  );
}
