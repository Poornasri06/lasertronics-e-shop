import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import logoAsset from "@/assets/logo.jpg";
import { categories } from "@/data/products";

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-ink-foreground border-t border-ink-muted/10">
      <div className="container-page grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5">
            <img
              src={logoAsset}
              alt="LASERTRONICS PVT LTD logo"
              width={40}
              height={40}
              loading="lazy"
              className="size-10 rounded-full object-cover"
            />
            <span className="font-display text-base font-extrabold tracking-tight">
              LASERTRONICS PVT LTD
            </span>
          </div>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-ink-muted">
            Electronics, technology and repair solutions for makers, technicians and businesses.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">SHOP</h3>
          <ul className="mt-4 space-y-2.5 text-xs">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="text-ink-muted transition-colors hover:text-primary"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">SERVICES</h3>
          <ul className="mt-4 space-y-2.5 text-xs text-ink-muted">
            <li>IoT Solutions</li>
            <li>Embedded Systems</li>
            <li>Prototyping</li>
            <li>Repair Services</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">SUPPORT & COMPANY</h3>
          <ul className="mt-4 space-y-2.5 text-xs">
            <li>
              <Link to="/contact" className="text-ink-muted transition-colors hover:text-primary">
                Contact & Support
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-ink-muted transition-colors hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/shop" className="text-ink-muted transition-colors hover:text-primary">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-ink-muted transition-colors hover:text-primary">
                Cart & Checkout
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">CONTACT</h3>
          <ul className="mt-4 space-y-3 text-xs text-ink-muted">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>91 1st Cross St, Colombo 00110, Sri Lanka</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <a href="tel:+94777882156" className="hover:text-primary font-medium">
                +94 77 788 2156
              </a>
            </li>
            <li className="flex gap-2.5">
              <Clock className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>Closes soon · 7 PM / Opens 9 AM Thu</span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <a href="mailto:lasertronicss@gmail.com" className="break-all hover:text-primary">
                lasertronicss@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-muted/15">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 LASERTRONICS PVT LTD. All Rights Reserved.</p>
          <p className="font-mono text-[11px] opacity-75">Prototype by ValGrow Labs</p>
        </div>
      </div>
    </footer>
  );
}

