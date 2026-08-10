import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, Search, ChevronRight, Phone } from "lucide-react";
import logoAsset from "@/assets/logo.jpg";
import { categories } from "@/data/products";
import { useCart } from "@/lib/cart";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Slim utility bar */}
      <div className="bg-ink text-ink-foreground">
        <div className="container-page flex h-9 items-center justify-between gap-3 text-[11px] sm:text-xs">
          <p className="truncate">Island-wide delivery · Free over LKR 15,000</p>
          <a
            href="tel:+94777882156"
            className="flex shrink-0 items-center gap-1.5 text-ink-muted transition-colors hover:text-primary"
          >
            <Phone className="size-3.5" aria-hidden />
            <span className="hidden sm:inline">+94 77 788 2156</span>
            <span className="sm:hidden">Call us</span>
          </a>
        </div>
      </div>

      {/* Sticky nav */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="container-page grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 lg:h-20">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <img
              src={logoAsset}
              alt="Lasertronics logo"
              width={40}
              height={40}
              className="size-9 shrink-0 rounded-full object-cover lg:size-11"
            />
            <span className="min-w-0">
              <span className="block truncate font-display text-base font-extrabold tracking-tight lg:text-lg">
                Lasertronics
              </span>
              <span className="hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">
                Electronics Store
              </span>
            </span>
          </Link>

          <nav className="hidden justify-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "text-primary" }}
                className="rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-1">
            <Link
              to="/shop"
              aria-label="Search products"
              className="grid size-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-primary"
            >
              <Search className="size-5" aria-hidden />
            </Link>
            <Link
              to="/cart"
              aria-label="Cart"
              className="relative grid size-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-primary"
            >
              <ShoppingCart className="size-5" aria-hidden />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-muted lg:hidden"
            >
              <Menu className="size-6" aria-hidden />
            </button>
          </div>
        </div>

        {/* Desktop category rail */}
        <div className="hidden border-t border-border lg:block">
          <div className="container-page flex h-11 items-center gap-1">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                activeProps={{ className: "text-primary" }}
                className="rounded-md px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/60 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-surface shadow-lift transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
            <span className="font-display text-sm font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Menu
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid size-10 place-items-center rounded-full text-foreground/70 hover:bg-muted"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
            <nav className="flex flex-col">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center justify-between rounded-lg px-2 text-[15px] font-semibold text-foreground hover:bg-muted"
                >
                  <span>{l.label}</span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              ))}
            </nav>

            <p className="mt-6 mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Shop by category
            </p>
            <nav className="flex flex-col">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center justify-between gap-3 rounded-lg px-2 hover:bg-muted"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-medium text-foreground">
                      {c.name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {c.tagline}
                    </span>
                  </span>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              ))}
            </nav>
          </div>

          <div className="shrink-0 border-t border-border p-4">
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground"
            >
              <ShoppingCart className="size-4" aria-hidden />
              View cart{count > 0 ? ` (${count})` : ""}
            </Link>
            <a
              href="tel:+94777882156"
              className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-foreground"
            >
              <Phone className="size-4" aria-hidden /> +94 77 788 2156
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
