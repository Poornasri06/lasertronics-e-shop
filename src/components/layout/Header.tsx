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
      {/* Slim iOS-style announcement bar */}
      <div className="border-b border-white/10 bg-[#0A192F]/90 text-white backdrop-blur-md">
        <div className="container-page flex h-8 items-center justify-between gap-3 text-[11px] sm:text-xs">
          <p className="flex items-center gap-1.5 truncate font-medium text-white/90">
            <span className="inline-block size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Island-wide delivery · Free delivery over LKR 15,000
          </p>
          <a
            href="tel:+94777882156"
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-white/90 transition-all hover:bg-white/20 hover:text-white"
          >
            <Phone className="size-3 text-sky-300" aria-hidden />
            <span className="font-semibold">+94 77 788 2156</span>
          </a>
        </div>
      </div>

      {/* Main Apple Frosted Glass Header */}
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-2xl shadow-[0_4px_24px_rgba(10,30,60,0.04)]">
        <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Logo & Brand Name */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="relative">
              <img
                src={logoAsset}
                alt="Lasertronics PVT LTD logo"
                width={44}
                height={44}
                className="size-9 shrink-0 rounded-full object-cover ring-2 ring-white/90 shadow-sm transition-transform duration-300 group-hover:scale-105 lg:size-11"
              />
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-blue-500" />
            </div>
            <span className="min-w-0">
              <span className="block font-display text-base font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors lg:text-lg">
                Lasertronics PVT LTD
              </span>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-primary/90 sm:block">
                Electronics & Technology
              </span>
            </span>
          </Link>

          {/* Center iOS Segmented / Pill Navigation (Desktop) */}
          <nav className="hidden items-center gap-1 rounded-full border border-white/80 bg-white/50 p-1.5 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] xl:flex">
            {desktopNavLinks.map((l) =>
              l.params ? (
                <Link
                  key={l.label}
                  to={l.to}
                  params={l.params}
                  activeProps={{
                    className:
                      "bg-primary text-primary-foreground font-bold shadow-[0_2px_8px_rgba(8,120,209,0.3)]",
                  }}
                  className="rounded-full px-3.5 py-1 text-xs font-semibold text-foreground/80 transition-all hover:bg-white/80 hover:text-primary active:scale-95"
                >
                  {l.label}
                </Link>
              ) : (
                <Link
                  key={l.label}
                  to={l.to}
                  activeProps={{
                    className:
                      "bg-primary text-primary-foreground font-bold shadow-[0_2px_8px_rgba(8,120,209,0.3)]",
                  }}
                  className="rounded-full px-3.5 py-1 text-xs font-semibold text-foreground/80 transition-all hover:bg-white/80 hover:text-primary active:scale-95"
                >
                  {l.label}
                </Link>
              )
            )}
          </nav>

          {/* Right iOS Glass Action Icons */}
          <div className="flex items-center justify-end gap-1.5">
            <Link
              to="/shop"
              aria-label="Search products"
              className="grid size-10 place-items-center rounded-full border border-white/70 bg-white/60 text-foreground/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all hover:bg-white hover:text-primary hover:shadow-md active:scale-95"
            >
              <Search className="size-4.5" aria-hidden />
            </Link>

            <Link
              to="/shop"
              aria-label="Wishlist"
              className="hidden size-10 place-items-center rounded-full border border-white/70 bg-white/60 text-foreground/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all hover:bg-white hover:text-primary hover:shadow-md active:scale-95 sm:grid"
            >
              <Heart className="size-4.5" aria-hidden />
            </Link>

            <Link
              to="/cart"
              aria-label="Cart"
              className="relative grid size-10 place-items-center rounded-full border border-white/70 bg-white/60 text-foreground/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all hover:bg-white hover:text-primary hover:shadow-md active:scale-95"
            >
              <ShoppingCart className="size-4.5" aria-hidden />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-4.5 h-4.5 place-items-center rounded-full bg-[#ff3b30] px-1 text-[10px] font-extrabold text-white shadow-[0_2px_8px_rgba(255,59,48,0.5)] ring-2 ring-white">
                  {count}
                </span>
              )}
            </Link>

            <Link
              to="/about"
              aria-label="Account"
              className="hidden size-10 place-items-center rounded-full border border-white/70 bg-white/60 text-foreground/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all hover:bg-white hover:text-primary hover:shadow-md active:scale-95 sm:grid"
            >
              <User className="size-4.5" aria-hidden />
            </Link>

            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-full border border-white/70 bg-white/60 text-foreground/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all hover:bg-white hover:text-primary active:scale-95 xl:hidden"
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </div>

        {/* Sub-nav Category Rail for medium screens */}
        <div className="hidden border-t border-white/50 bg-white/40 backdrop-blur-lg lg:block xl:hidden">
          <div className="container-page flex h-10 items-center justify-between gap-1 overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                activeProps={{ className: "text-primary font-bold bg-white/60 shadow-xs" }}
                className="whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold text-foreground/75 transition-all hover:bg-white/50 hover:text-primary"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile iOS Frosted Glass slide-out sheet */}
      <div
        className={`fixed inset-0 z-50 xl:hidden ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          tabIndex={open ? 0 : -1}
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col border-r border-white/60 bg-white/85 backdrop-blur-2xl shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/60 px-5">
            <div className="flex items-center gap-2.5">
              <img src={logoAsset} alt="Logo" className="size-8 rounded-full object-cover ring-2 ring-primary/20" />
              <span className="font-display text-sm font-bold text-foreground">
                LASERTRONICS PVT LTD
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="grid size-9 place-items-center rounded-full border border-white/80 bg-white/60 text-foreground/70 transition-all hover:bg-white hover:text-foreground active:scale-95"
            >
              <X className="size-4.5" aria-hidden />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-6">
            <nav className="flex flex-col space-y-1.5">
              {desktopNavLinks.map((l) =>
                l.params ? (
                  <Link
                    key={l.label}
                    to={l.to}
                    params={l.params}
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "bg-primary text-primary-foreground font-bold shadow-md" }}
                    className="flex min-h-12 items-center justify-between rounded-xl border border-white/60 bg-white/50 px-4 text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:bg-white hover:shadow-sm active:scale-98"
                  >
                    <span>{l.label}</span>
                    <ChevronRight className="size-4 shrink-0 opacity-60" aria-hidden />
                  </Link>
                ) : (
                  <Link
                    key={l.label}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    activeProps={{ className: "bg-primary text-primary-foreground font-bold shadow-md" }}
                    className="flex min-h-12 items-center justify-between rounded-xl border border-white/60 bg-white/50 px-4 text-sm font-semibold text-foreground backdrop-blur-md transition-all hover:bg-white hover:shadow-sm active:scale-98"
                  >
                    <span>{l.label}</span>
                    <ChevronRight className="size-4 shrink-0 opacity-60" aria-hidden />
                  </Link>
                )
              )}
            </nav>
          </div>

          <div className="shrink-0 border-t border-white/60 bg-white/50 p-4 backdrop-blur-md">
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              className="apple-btn-primary flex min-h-12 w-full items-center justify-center gap-2 rounded-full font-bold shadow-md"
            >
              <ShoppingCart className="size-4" aria-hidden />
              View Cart {count > 0 ? `(${count})` : ""}
            </Link>
            <a
              href="tel:+94777882156"
              className="apple-btn-glass mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-xs font-bold text-foreground"
            >
              <Phone className="size-3.5 text-primary" aria-hidden /> +94 77 788 2156
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}

