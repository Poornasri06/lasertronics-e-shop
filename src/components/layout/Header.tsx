import { Link } from "@tanstack/react-router";
import { ShoppingCart, Search, Heart, User, Phone } from "lucide-react";
import logoAsset from "@/assets/logo.jpg";
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
  const { count } = useCart();

  return (
    <>
      {/* Slim iOS-style announcement bar */}
      <div className="border-b border-white/10 bg-[#0A192F]/90 text-white backdrop-blur-md">
        <div className="container-page flex h-8 items-center justify-between gap-3 text-xs">
          <p className="flex items-center gap-1.5 font-medium text-white/90">
            <span className="inline-block size-1.5 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
            <span>Island-wide delivery · Free delivery over LKR 15,000</span>
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
        <div className="container-page flex h-20 items-center justify-between gap-4">
          {/* Logo & Brand Name - complete and never truncated, matching Pic 2 */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="relative shrink-0">
              <img
                src={logoAsset}
                alt="Lasertronics PVT LTD logo"
                width={44}
                height={44}
                className="size-11 shrink-0 rounded-full object-cover ring-2 ring-white/90 shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-blue-500" />
            </div>
            <div className="shrink-0">
              <span className="block whitespace-nowrap font-display text-lg font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
                Lasertronics PVT LTD
              </span>
              <span className="block whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.18em] text-primary/90">
                ELECTRONICS & TECHNOLOGY
              </span>
            </div>
          </Link>

          {/* Center iOS Segmented / Pill Navigation - identical across mobile and desktop */}
          <nav className="flex items-center gap-0.5 rounded-full border border-white/80 bg-white/50 p-1 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
            {desktopNavLinks.map((l) =>
              l.params ? (
                <Link
                  key={l.label}
                  to={l.to}
                  params={l.params}
                  activeProps={{
                    className:
                      "!bg-primary !text-primary-foreground font-bold shadow-[0_2px_8px_rgba(8,120,209,0.3)]",
                  }}
                  className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full px-3 text-xs font-semibold text-foreground/80 transition-all hover:bg-white/80 hover:text-primary active:scale-95"
                >
                  {l.label}
                </Link>
              ) : (
                <Link
                  key={l.label}
                  to={l.to}
                  activeProps={{
                    className:
                      "!bg-primary !text-primary-foreground font-bold shadow-[0_2px_8px_rgba(8,120,209,0.3)]",
                  }}
                  className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full px-3 text-xs font-semibold text-foreground/80 transition-all hover:bg-white/80 hover:text-primary active:scale-95"
                >
                  {l.label}
                </Link>
              )
            )}
          </nav>

          {/* Right iOS Glass Action Icons - Search, Wishlist, Cart, Account */}
          <div className="flex shrink-0 items-center justify-end gap-1.5">
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
              className="grid size-10 place-items-center rounded-full border border-white/70 bg-white/60 text-foreground/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all hover:bg-white hover:text-primary hover:shadow-md active:scale-95"
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
              className="grid size-10 place-items-center rounded-full border border-white/70 bg-white/60 text-foreground/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all hover:bg-white hover:text-primary hover:shadow-md active:scale-95"
            >
              <User className="size-4.5" aria-hidden />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
