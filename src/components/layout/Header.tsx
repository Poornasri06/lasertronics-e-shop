import { Link } from "@tanstack/react-router";
import {
  ShoppingCart,
  Search,
  Heart,
  User,
  Phone,
  Menu,
  X,
  ChevronRight,
  Home,
  LayoutGrid,
} from "lucide-react";
import { useState, useEffect } from "react";
import logoAsset from "@/assets/logo.jpg";
import { useCart } from "@/lib/cart";

interface NavLinkItem {
  label: string;
  to: string;
  params?: { slug: string };
}

const desktopNavLinks: NavLinkItem[] = [
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile drawer on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Slim iOS-style announcement bar */}
      <div className="border-b border-white/10 bg-[#0A192F]/95 text-white backdrop-blur-md">
        <div className="container-page flex h-8 items-center justify-between gap-2 text-[10.5px] sm:text-xs">
          <p className="flex items-center gap-1.5 font-medium text-white/90 truncate">
            <span className="inline-block size-1.5 shrink-0 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">Island-wide delivery • Free delivery over LKR 15,000</span>
          </p>
          <a
            href="tel:+94777882156"
            className="hidden sm:flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-white/90 transition-all hover:bg-white/20 hover:text-white"
          >
            <Phone className="size-3 text-sky-300" aria-hidden />
            <span className="font-semibold">+94 77 788 2156</span>
          </a>
        </div>
      </div>

      {/* Main Apple Frosted Glass Header */}
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/85 backdrop-blur-2xl shadow-[0_4px_24px_rgba(10,30,60,0.04)]">
        <div className="container-page flex h-14 sm:h-18 lg:h-20 items-center justify-between gap-2 sm:gap-3">
          {/* Logo & Brand Name */}
          <Link to="/" className="group flex shrink-0 items-center gap-2 sm:gap-2.5">
            <div className="relative shrink-0">
              <img
                src={logoAsset}
                alt="Lasertronics PVT LTD logo"
                width={40}
                height={40}
                className="size-8 sm:size-10 lg:size-11 shrink-0 rounded-full object-cover ring-2 ring-white/90 shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute -bottom-0.5 -right-0.5 size-2 sm:size-2.5 rounded-full border-2 border-white bg-blue-500" />
            </div>
            <div className="min-w-0">
              <span className="block font-display text-xs sm:text-base lg:text-lg font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors whitespace-nowrap leading-tight">
                Lasertronics PVT LTD
              </span>
              <span className="hidden xs:block text-[8px] sm:text-[9.5px] lg:text-[10px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-primary/90 whitespace-nowrap leading-tight">
                ELECTRONICS & TECHNOLOGY
              </span>
            </div>
          </Link>

          {/* Desktop Center Navigation - hidden on mobile/tablet */}
          <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1 rounded-full border border-white/80 bg-white/50 p-1 backdrop-blur-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
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
                  className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full px-2.5 2xl:px-3 text-[11px] 2xl:text-xs font-semibold text-foreground/80 transition-all hover:bg-white/80 hover:text-primary active:scale-95"
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
                  className="inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full px-2.5 2xl:px-3 text-[11px] 2xl:text-xs font-semibold text-foreground/80 transition-all hover:bg-white/80 hover:text-primary active:scale-95"
                >
                  {l.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Action Icons */}
          <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-1.5">
            <Link
              to="/shop"
              aria-label="Search products"
              className="grid size-8.5 sm:size-10 place-items-center rounded-full border border-white/70 bg-white/60 text-foreground/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all hover:bg-white hover:text-primary hover:shadow-md active:scale-95"
            >
              <Search className="size-4 sm:size-4.5" aria-hidden />
            </Link>

            <Link
              to="/shop"
              aria-label="Wishlist"
              className="hidden md:grid size-10 place-items-center rounded-full border border-white/70 bg-white/60 text-foreground/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all hover:bg-white hover:text-primary hover:shadow-md active:scale-95"
            >
              <Heart className="size-4.5" aria-hidden />
            </Link>

            <Link
              to="/cart"
              aria-label="Cart"
              className="relative grid size-8.5 sm:size-10 place-items-center rounded-full border border-white/70 bg-white/60 text-foreground/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all hover:bg-white hover:text-primary hover:shadow-md active:scale-95"
            >
              <ShoppingCart className="size-4 sm:size-4.5" aria-hidden />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-4 h-4 sm:min-w-4.5 sm:h-4.5 place-items-center rounded-full bg-[#ff3b30] px-1 text-[9px] sm:text-[10px] font-extrabold text-white shadow-[0_2px_8px_rgba(255,59,48,0.5)] ring-2 ring-white">
                  {count}
                </span>
              )}
            </Link>

            <Link
              to="/about"
              aria-label="Account"
              className="hidden md:grid size-10 place-items-center rounded-full border border-white/70 bg-white/60 text-foreground/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all hover:bg-white hover:text-primary hover:shadow-md active:scale-95"
            >
              <User className="size-4.5" aria-hidden />
            </Link>

            {/* Mobile Menu Button - visible on screens < xl */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid size-8.5 sm:size-10 xl:hidden place-items-center rounded-full border border-white/70 bg-white/60 text-foreground/80 shadow-[0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all hover:bg-white hover:text-primary active:scale-95"
            >
              {mobileMenuOpen ? (
                <X className="size-4.5 text-foreground" />
              ) : (
                <Menu className="size-4.5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer with Modal Overlay */}
        {mobileMenuOpen && (
          <div className="xl:hidden">
            <div
              className="fixed inset-0 top-[calc(2rem+3.5rem)] z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-50 max-h-[calc(100vh-6rem)] overflow-y-auto border-t border-slate-200/80 bg-white/98 backdrop-blur-2xl p-4 sm:p-6 shadow-2xl animate-fade-up">
              <div className="mb-3 flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  Navigation Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="size-4" />
                </button>
              </div>

              <nav className="flex flex-col space-y-1">
                {desktopNavLinks.map((l) =>
                  l.params ? (
                    <Link
                      key={l.label}
                      to={l.to}
                      params={l.params}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-foreground hover:bg-slate-100 hover:text-primary transition-colors"
                    >
                      <span>{l.label}</span>
                      <ChevronRight className="size-3.5 text-muted-foreground" />
                    </Link>
                  ) : (
                    <Link
                      key={l.label}
                      to={l.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-foreground hover:bg-slate-100 hover:text-primary transition-colors"
                    >
                      <span>{l.label}</span>
                      <ChevronRight className="size-3.5 text-muted-foreground" />
                    </Link>
                  )
                )}
              </nav>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <a
                  href="tel:+94777882156"
                  className="flex items-center justify-between rounded-xl bg-blue-50/70 p-3 text-xs font-bold text-primary hover:bg-blue-100/70 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="size-4" /> Call Hotline: +94 77 788 2156
                  </span>
                  <ChevronRight className="size-3.5" />
                </a>
                <p className="px-1 text-[11px] text-muted-foreground">
                  Store: 91 1st Cross St, Colombo 00110, Sri Lanka
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Ergonomic Mobile Sticky Bottom Navigation Dock (sm / md / mobile only) */}
      <div className="fixed bottom-0 inset-x-0 z-40 xl:hidden border-t border-white/80 bg-white/92 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="container-page flex items-center justify-around py-1.5">
          <Link
            to="/"
            activeProps={{ className: "!text-primary font-bold" }}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <Home className="size-5" />
            <span>Home</span>
          </Link>

          <Link
            to="/shop"
            activeProps={{ className: "!text-primary font-bold" }}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <LayoutGrid className="size-5" />
            <span>Shop</span>
          </Link>

          <Link
            to="/cart"
            activeProps={{ className: "!text-primary font-bold" }}
            className="relative flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <div className="relative">
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 grid min-w-4 h-4 place-items-center rounded-full bg-[#ff3b30] px-1 text-[9px] font-extrabold text-white">
                  {count}
                </span>
              )}
            </div>
            <span>Cart</span>
          </Link>

          <Link
            to="/contact"
            activeProps={{ className: "!text-primary font-bold" }}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="size-5" />
            <span>Contact</span>
          </Link>
        </div>
      </div>
    </>
  );
}
