import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, Search, Heart, User, ChevronRight, Phone } from "lucide-react";
import logoAsset from "@/assets/logo.jpg";
import { categories } from "@/data/products";
import { useCart } from "@/lib/cart";

const desktopNavLinks = [
  { label: "Home", to: "/" },
  { label: "Mobile Accessories", to: "/category/$slug", params: { slug: "mobile-accessories" } },
  { label: "Electronics", to: "/category/$slug", params: { slug: "electronics" } },
  { label: "TV Accessories", to: "/category/$slug", params: { slug: "tv-accessories" } },
  { label: "IoT & Microcontrollers", to: "/category/$slug", params: { slug: "iot-and-microcontrollers" } },
  { label: "Repair Kits", to: "/category/$slug", params: { slug: "repair-kits" } },
  { label: "Solutions", to: "/#solutions" },
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
      {/* Slim announcement bar */}
      <div className="bg-ink text-ink-foreground">
        <div className="container-page flex h-9 items-center justify-between gap-3 text-[11px] sm:text-xs">
          <p className="truncate font-medium">Island-wide delivery · Free delivery over LKR 15,000</p>
          <a
            href="tel:+94777882156"
            className="flex shrink-0 items-center gap-1.5 text-ink-muted transition-colors hover:text-primary"
          >
            <Phone className="size-3.5 text-primary" aria-hidden />
            <span className="font-semibold">Call Us: +94 77 788 2156</span>
          </a>
        </div>
      </div>

      {/* Main White Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/98 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img
              src={logoAsset}
              alt="Lasertronics PVT LTD logo"
              width={44}
              height={44}
              className="size-9 shrink-0 rounded-full object-cover lg:size-11"
            />
            <span className="min-w-0">
              <span className="block font-display text-base font-extrabold tracking-tight text-foreground lg:text-lg">
                Lasertronics PVT LTD
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-primary sm:block">
                Electronics & Technology
              </span>
            </span>
          </Link>

          {/* Center Organized Navigation (Desktop) */}
          <nav className="hidden items-center gap-1 xl:flex">
            {desktopNavLinks.map((l) =>
              l.params ? (
                <Link
                  key={l.label}
                  to={l.to}
                  params={l.params}
                  activeProps={{ className: "text-primary font-bold bg-accent/60" }}
                  className="rounded-md px-2.5 py-1.5 text-[13px] font-semibold text-foreground/80 transition-colors hover:bg-accent/40 hover:text-primary"
                >
                  {l.label}
                </Link>
              ) : (
                <Link
                  key={l.label}
                  to={l.to}
                  activeProps={{ className: "text-primary font-bold bg-accent/60" }}
                  className="rounded-md px-2.5 py-1.5 text-[13px] font-semibold text-foreground/80 transition-colors hover:bg-accent/40 hover:text-primary"
                >
                  {l.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center justify-end gap-1">
            <Link
              to="/shop"
              aria-label="Search products"
              className="grid size-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-primary"
            >
              <Search className="size-5" aria-hidden />
            </Link>

            <Link
              to="/shop"
              aria-label="Wishlist"
              className="hidden size-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-primary sm:grid"
            >
              <Heart className="size-5" aria-hidden />
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

            <Link
              to="/about"
              aria-label="Account"
              className="hidden size-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-primary sm:grid"
            >
              <User className="size-5" aria-hidden />
            </Link>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-muted xl:hidden"
            >
              <Menu className="size-6" aria-hidden />
            </button>
          </div>
        </div>

        {/* Sub-nav Category Rail for medium screens */}
        <div className="hidden border-t border-border bg-muted/40 lg:block xl:hidden">
          <div className="container-page flex h-10 items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                activeProps={{ className: "text-primary font-bold" }}
                className="whitespace-nowrap px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <div
        className={`fixed inset-0 z-50 xl:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/60 backdrop-blur-xs transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-surface shadow-lift transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
            <div className="flex items-center gap-2">
              <img src={logoAsset} alt="Logo" className="size-8 rounded-full object-cover" />
              <span className="font-display text-sm font-bold text-foreground">
                LASERTRONICS PVT LTD
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid size-10 place-items-center rounded-full text-foreground/70 hover:bg-muted"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-6">
            <nav className="flex flex-col space-y-1">
              {desktopNavLinks.map((l) =>
                l.params ? (
                  <Link
                    key={l.label}
                    to={l.to}
                    params={l.params}
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "bg-accent/70 text-primary font-bold" }}
                    className="flex min-h-12 items-center justify-between rounded-lg px-3 text-sm font-semibold text-foreground hover:bg-muted"
                  >
                    <span>{l.label}</span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </Link>
                ) : (
                  <Link
                    key={l.label}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "bg-accent/70 text-primary font-bold" }}
                    className="flex min-h-12 items-center justify-between rounded-lg px-3 text-sm font-semibold text-foreground hover:bg-muted"
                  >
                    <span>{l.label}</span>
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </Link>
                )
              )}
            </nav>
          </div>

          <div className="shrink-0 border-t border-border p-4">
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground shadow-md"
            >
              <ShoppingCart className="size-4" aria-hidden />
              View Cart {count > 0 ? `(${count})` : ""}
            </Link>
            <a
              href="tel:+94777882156"
              className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-xs font-bold text-foreground"
            >
              <Phone className="size-3.5 text-primary" aria-hidden /> +94 77 788 2156
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}

