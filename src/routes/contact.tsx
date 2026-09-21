import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | LASERTRONICS PVT LTD Colombo" },
      {
        name: "description",
        content:
          "Visit LASERTRONICS PVT LTD at 91 1st Cross St, Colombo 00110 or call +94 77 788 2156 for electronics, IoT and repair supplies.",
      },
      { property: "og:title", content: "Contact LASERTRONICS PVT LTD" },
      {
        property: "og:description",
        content: "Call, email or visit our Colombo store for electronics and repair supplies.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <SiteLayout>
      <div className="bg-ink py-14 text-ink-foreground lg:py-20 border-b border-ink-muted/15">
        <div className="container-page">
          <span className="inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Contact Us
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl text-white">
            Talk to Our Engineering Team
          </h1>
          <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-ink-muted">
            Bulk quotes, project sourcing or technical inquiries — we reply within one working day.
          </p>
        </div>
      </div>

      <div className="container-page grid gap-8 py-12 lg:grid-cols-2 lg:py-16">
        <ul className="space-y-4">
          {[
            { icon: MapPin, title: "Location", value: "91 1st Cross St, Colombo 00110, Sri Lanka" },
            { icon: Phone, title: "Phone", value: "+94 77 788 2156", href: "tel:+94777882156" },
            {
              icon: Mail,
              title: "Email",
              value: "lasertronicss@gmail.com",
              href: "mailto:lasertronicss@gmail.com",
            },
            { icon: Clock, title: "Opening Status", value: "Closes soon · 7 PM / Opens 9 AM Thu" },
          ].map((c) => (
            <li
              key={c.title}
              className="flex min-w-0 gap-4 rounded-xl border border-border bg-surface p-5 shadow-card transition-all hover:border-primary/40"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-primary">
                <c.icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  {c.title}
                </span>
                {c.href ? (
                  <a href={c.href} className="block break-words text-sm font-semibold text-foreground hover:text-primary">
                    {c.value}
                  </a>
                ) : (
                  <span className="block break-words text-sm font-semibold text-foreground">{c.value}</span>
                )}
              </span>
            </li>
          ))}
        </ul>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="rounded-2xl border border-border bg-surface p-6 shadow-card"
        >
          <h2 className="font-display text-lg font-extrabold text-foreground">Send Us a Message</h2>
          {sent ? (
            <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
              <CheckCircle2 className="size-5" aria-hidden /> Thank you — our team will be in touch shortly.
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {[
                { label: "Your Name", type: "text", autoComplete: "name" },
                { label: "Email Address", type: "email", autoComplete: "email" },
                { label: "Phone Number", type: "tel", autoComplete: "tel" },
              ].map((f) => (
                <label key={f.label} className="block">
                  <span className="text-xs font-semibold text-muted-foreground">{f.label}</span>
                  <input
                    required
                    type={f.type}
                    autoComplete={f.autoComplete}
                    className="mt-1.5 min-h-11 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </label>
              ))}
              <label className="block">
                <span className="text-xs font-semibold text-muted-foreground">Message / Project Requirement</span>
                <textarea
                  required
                  rows={4}
                  className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </label>
              <button
                type="submit"
                className="min-h-12 w-full rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-all hover:bg-primary-dark shadow-md"
              >
                Send Message
              </button>
            </div>
          )}
        </form>
      </div>
    </SiteLayout>
  );
}

