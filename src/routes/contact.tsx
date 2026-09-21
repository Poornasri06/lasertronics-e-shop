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
      {/* iOS Frosted Glass Banner */}
      <div className="relative overflow-hidden border-b border-white/60 bg-gradient-to-b from-blue-50/40 via-white/50 to-white/70 py-12 backdrop-blur-xl lg:py-16">
        <div className="container-page">
          <span className="inline-block rounded-full border border-white/80 bg-white/75 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-primary shadow-xs backdrop-blur-md">
            Customer Support & Inquiries
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
            Talk to Our Engineering Team
          </h1>
          <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
            Bulk quotes, project sourcing or technical guidance — we reply within one working day.
          </p>
        </div>
      </div>

      <div className="container-page grid gap-8 py-12 lg:grid-cols-2 lg:py-16">
        {/* Contact info list in frosted cards */}
        <ul className="space-y-4">
          {[
            { icon: MapPin, title: "Store Location", value: "91 1st Cross St, Colombo 00110, Sri Lanka" },
            { icon: Phone, title: "Phone Hotline", value: "+94 77 788 2156", href: "tel:+94777882156" },
            {
              icon: Mail,
              title: "Email Address",
              value: "lasertronicss@gmail.com",
              href: "mailto:lasertronicss@gmail.com",
            },
            { icon: Clock, title: "Store Working Hours", value: "Mon - Sat: 9:00 AM – 7:00 PM" },
          ].map((c) => (
            <li
              key={c.title}
              className="glass-card group flex min-w-0 items-center gap-4.5 rounded-2xl border border-white/80 bg-white/75 p-5 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.05),inset_0_1px_0_0_rgba(255,255,255,0.95)] backdrop-blur-xl transition-all hover:bg-white/88 hover:shadow-md"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-500/15 via-sky-400/10 to-transparent text-primary shadow-xs transition-transform duration-300 group-hover:scale-105">
                <c.icon className="size-5.5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
                  {c.title}
                </span>
                {c.href ? (
                  <a href={c.href} className="mt-0.5 block break-words text-sm font-bold text-foreground transition-colors hover:text-primary">
                    {c.value}
                  </a>
                ) : (
                  <span className="mt-0.5 block break-words text-sm font-bold text-foreground">{c.value}</span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {/* Frosted Glass Contact Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="glass-card rounded-3xl border border-white/85 bg-white/80 p-7 shadow-[0_12px_40px_-6px_rgba(10,35,80,0.1),inset_0_1px_0_0_rgba(255,255,255,1)] backdrop-blur-2xl sm:p-8"
        >
          <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground">Send Us a Message</h2>
          <p className="mt-1 text-xs text-muted-foreground">Directly dispatched to our engineering desk in Colombo.</p>

          {sent ? (
            <div className="mt-6 rounded-2xl border border-emerald-300/50 bg-emerald-50/80 p-5 text-sm font-semibold text-emerald-900 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-emerald-600" aria-hidden />
                <span>Thank you — our team will be in touch shortly!</span>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {[
                { label: "Your Full Name", type: "text", autoComplete: "name", placeholder: "e.g. Ruwan Silva" },
                { label: "Email Address", type: "email", autoComplete: "email", placeholder: "e.g. name@example.com" },
                { label: "Phone Number", type: "tel", autoComplete: "tel", placeholder: "e.g. +94 77 123 4567" },
              ].map((f) => (
                <label key={f.label} className="block">
                  <span className="text-xs font-bold text-foreground/80">{f.label}</span>
                  <input
                    required
                    type={f.type}
                    autoComplete={f.autoComplete}
                    placeholder={f.placeholder}
                    className="glass-input mt-1.5 min-h-12 w-full rounded-xl border border-white/80 bg-white/70 px-4 text-sm text-foreground shadow-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                </label>
              ))}
              <label className="block">
                <span className="text-xs font-bold text-foreground/80">Message / Project Requirement</span>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us what components or tools you require..."
                  className="glass-input mt-1.5 w-full rounded-xl border border-white/80 bg-white/70 px-4 py-3 text-sm text-foreground shadow-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </label>
              <button
                type="submit"
                className="apple-btn-primary mt-2 min-h-12 w-full rounded-full px-6 text-sm font-bold shadow-lg"
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

