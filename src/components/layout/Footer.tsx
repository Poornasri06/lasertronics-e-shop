import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail } from "lucide-react";
import logoAsset from "@/assets/logo.jpg";
import { categories } from "@/data/products";

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-ink-foreground">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src={logoAsset}
              alt="Lasertronics logo"
              width={40}
              height={40}
              loading="lazy"
              className="size-10 rounded-full object-cover"
            />
            <span className="font-display text-lg font-extrabold">Lasertronics</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
            Sri Lanka's electronics partner for makers, technicians and businesses — components,
            accessories and bench tools with genuine warranty.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Categories</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
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
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/shop" className="text-ink-muted transition-colors hover:text-primary">
                All products
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-ink-muted transition-colors hover:text-primary">
                About us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-ink-muted transition-colors hover:text-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-ink-muted transition-colors hover:text-primary">
                Cart
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Reach us</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>91 1st Cross St, Colombo 00110, Sri Lanka</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <a href="tel:+94777882156" className="hover:text-primary">
                +94 77 788 2156
              </a>
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

      <div className="border-t border-ink-muted/20">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Lasertronics. All rights reserved.</p>
          <p>Prototype by ValGrow Labs</p>
        </div>
      </div>
    </footer>
  );
}
