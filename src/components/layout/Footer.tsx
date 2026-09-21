import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import logoAsset from "@/assets/logo.jpg";
import { categories } from "@/data/products";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#071A2B] text-white">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand Column */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <img
              src={logoAsset}
              alt="LASERTRONICS PVT LTD logo"
              width={40}
              height={40}
              loading="lazy"
              className="size-10 rounded-full object-cover shadow-sm"
            />
            <span className="font-display text-base font-extrabold tracking-tight text-white">
              Lasertronics PVT LTD
            </span>
          </div>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-slate-300">
            Apple-inspired electronics, high-grade bench equipment, and genuine components stocked in Sri Lanka.
          </p>
        </div>

        {/* Shop Range */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#12A8E8]">SHOP</h3>
          <ul className="mt-4 space-y-2.5 text-xs">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="text-slate-300 transition-colors hover:text-[#12A8E8]"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#12A8E8]">SERVICES</h3>
          <ul className="mt-4 space-y-2.5 text-xs text-slate-300">
            <li>IoT Solutions & Gateways</li>
            <li>Embedded Systems Design</li>
            <li>Electronics Prototyping</li>
            <li>Bench Tool Calibration</li>
          </ul>
        </div>

        {/* Support & Company */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#12A8E8]">SUPPORT & COMPANY</h3>
          <ul className="mt-4 space-y-2.5 text-xs">
            <li>
              <Link to="/contact" className="text-slate-300 transition-colors hover:text-[#12A8E8]">
                Contact & Support
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-slate-300 transition-colors hover:text-[#12A8E8]">
                About Lasertronics
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-slate-300 transition-colors hover:text-[#12A8E8]">
                Full Catalogue
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-slate-300 transition-colors hover:text-[#12A8E8]">
                Cart & Checkout
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#12A8E8]">CONTACT</h3>
          <ul className="mt-4 space-y-3 text-xs text-slate-300">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-[#0878D1]" aria-hidden />
              <span>91 1st Cross St, Colombo 00110, Sri Lanka</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-[#0878D1]" aria-hidden />
              <a href="tel:+94777882156" className="font-medium hover:text-[#12A8E8]">
                +94 77 788 2156
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-[#0878D1]" aria-hidden />
              <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-[#0878D1]" aria-hidden />
              <a href="mailto:lasertronicss@gmail.com" className="break-all hover:text-[#12A8E8]">
                lasertronicss@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LASERTRONICS PVT LTD. All Rights Reserved.</p>
          <p className="font-mono text-[11px] opacity-75">Island-wide Electronics Distribution</p>
        </div>
      </div>
    </footer>
  );
}
