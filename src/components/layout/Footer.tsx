import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import logoAsset from "@/assets/logo.jpg";
import { categories } from "@/data/products";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#080d1a] text-ink-foreground backdrop-blur-2xl shadow-[0_-12px_40px_rgba(0,0,0,0.3)]">
      {/* Top Apple Callout Banner */}
      <div className="border-b border-white/10 bg-gradient-to-r from-blue-950/40 via-[#0071e3]/10 to-indigo-950/40 py-12">
        <div className="container-page flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Let&apos;s build something smarter.
            </h2>
            <p className="mt-1.5 text-sm text-slate-300/80 max-w-xl">
              From IoT hardware to repair benches, we supply Sri Lankan engineers and makers with genuine components.
            </p>
          </div>
          <Link
            to="/contact"
            className="apple-pill-primary shrink-0 px-7 py-3 text-sm font-semibold tracking-wide shadow-lg"
          >
            Contact Lasertronics →
          </Link>
        </div>
      </div>

      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <img
              src={logoAsset}
              alt="LASERTRONICS PVT LTD logo"
              width={40}
              height={40}
              loading="lazy"
              className="size-10 rounded-full object-cover ring-2 ring-white/20 shadow-md"
            />
            <span className="font-display text-base font-extrabold tracking-tight text-white">
              LASERTRONICS
            </span>
          </div>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-slate-400">
            Sri Lanka&apos;s trusted hub for electronics, IoT microcontrollers, mobile accessories, and bench-grade repair equipment.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-slate-300">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            Island-wide delivery active
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0071e3]">SHOP</h3>
          <ul className="mt-4 space-y-2.5 text-xs">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="text-slate-400 transition-colors hover:text-white"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0071e3]">ENGINEERING</h3>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
            <li className="hover:text-white transition-colors cursor-default">IoT Nodes & Gateways</li>
            <li className="hover:text-white transition-colors cursor-default">Embedded Hardware</li>
            <li className="hover:text-white transition-colors cursor-default">Robotics & Prototyping</li>
            <li className="hover:text-white transition-colors cursor-default">Bench Repair Equipment</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0071e3]">COMPANY</h3>
          <ul className="mt-4 space-y-2.5 text-xs">
            <li>
              <Link to="/about" className="text-slate-400 transition-colors hover:text-white">
                About Lasertronics
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-slate-400 transition-colors hover:text-white">
                Technical Support
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-slate-400 transition-colors hover:text-white">
                All Products Catalog
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-slate-400 transition-colors hover:text-white">
                Shopping Cart
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#0071e3]">VISIT US</h3>
          <ul className="mt-4 space-y-3 text-xs text-slate-400">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#0071e3]" aria-hidden />
              <span>91 1st Cross St, Colombo 00110, Sri Lanka</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-[#0071e3]" aria-hidden />
              <a href="tel:+94777882156" className="hover:text-white font-medium">
                +94 77 788 2156
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-[#0071e3]" aria-hidden />
              <span>Open 9:00 AM – 7:00 PM</span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-[#0071e3]" aria-hidden />
              <a href="mailto:lasertronicss@gmail.com" className="break-all hover:text-white">
                lasertronicss@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/40">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LASERTRONICS PVT LTD. All Rights Reserved.</p>
          <p className="text-[11px] text-slate-500">Prototype by ValGrow Labs</p>
        </div>
      </div>
    </footer>
  );
}

