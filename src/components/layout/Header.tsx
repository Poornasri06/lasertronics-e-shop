import { Link, useNavigate } from "@tanstack/react-router";
import {
  ShoppingCart,
  Search,
  Heart,
  Phone,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Home,
  LayoutGrid,
  Truck,
  Sparkles,
  MapPin,
  Cpu,
  Smartphone,
  Tv,
  CircuitBoard,
  Wrench,
  Layers,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import logoAsset from "@/assets/logo.jpg";
import { useCart } from "@/lib/cart";
import { useStoreCategories, formatLKR } from "@/data/products";

const categoryIconsMap: Record<string, typeof Smartphone> = {
  "mobile-accessories": Smartphone,
  electronics: CircuitBoard,
  "tv-accessories": Tv,
  "iot-and-microcontrollers": Cpu,
  "repair-kits": Wrench,
};

export function Header() {
  const categories = useStoreCategories();
  const { count, subtotal } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile drawer on resize to desktop (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
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

  // Close category dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate({ to: "/shop", search: { q } as any });
    } else {
      navigate({ to: "/shop" });
    }
  };

  return (
    <>
      {/* 1. Top Utility Bar (Desktop & Mobile) */}
      <div className="border-b border-slate-800 bg-[#0A192F] text-white">
        <div className="container-page flex h-8 sm:h-9 items-center justify-between text-[11px] sm:text-xs">
          {/* Left: Island-wide delivery value prop */}
          <div className="flex items-center gap-2 font-medium text-slate-300">
            <span className="inline-flex size-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate">
              Island-wide Sri Lanka delivery • Free courier shipping on orders over LKR 15,000
            </span>
          </div>

          {/* Right: Store info & customer care */}
          <div className="hidden md:flex items-center gap-4 text-slate-300 shrink-0 font-medium">
            <div className="flex items-center gap-1.5 text-slate-400">
              <MapPin className="size-3.5 text-sky-400" />
              <span>Colombo 00110, Sri Lanka</span>
            </div>
            <span className="text-slate-700">|</span>
            <a
              href="tel:+94777882156"
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="size-3.5 text-sky-400" />
              <span className="font-semibold">+94 77 788 2156</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Brand & Search Header (Sticky) */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-xl shadow-xs">
        <div className="container-page flex h-16 sm:h-20 items-center justify-between gap-3 lg:gap-6">
          {/* Brand Logo & Wordmark */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5 sm:gap-3">
            <div className="relative shrink-0">
              <img
                src={logoAsset}
                alt="Lasertronics PVT LTD logo"
                width={44}
                height={44}
                className="size-9 sm:size-11 rounded-full object-cover ring-2 ring-blue-500/20 shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-white bg-blue-600" />
            </div>
            <div className="min-w-0">
              <span className="block font-display text-sm sm:text-lg lg:text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                LASERTRONICS
              </span>
              <span className="hidden xs:block text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-[0.16em] text-blue-600 leading-tight">
                PVT LTD • ELECTRONICS & TECH
              </span>
            </div>
          </Link>

          {/* Desktop Prominent Global Search Bar (Center, 420px - 580px) */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              <div className="relative w-full">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4.5 -translate-y-1/2 text-slate-400"
                  aria-hidden
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 10,000+ components, ICs, microcontrollers, fast chargers, repair kits..."
                  className="h-11 w-full rounded-l-xl border border-r-0 border-slate-300 bg-slate-50/70 pl-10 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>
              <button
                type="submit"
                className="h-11 rounded-r-xl bg-blue-600 hover:bg-blue-700 text-white px-5 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
              >
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Right Action Utilities (Hotline, Wishlist, Cart) */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            {/* Mobile Search Button (< lg) */}
            <Link
              to="/shop"
              aria-label="Search catalog"
              className="grid lg:hidden size-9 sm:size-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-white hover:text-blue-600 transition-colors"
            >
              <Search className="size-4 sm:size-4.5" />
            </Link>

            {/* Desktop Quick Hotline Info Badge */}
            <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="size-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Phone className="size-4" />
              </div>
              <div className="text-left text-xs">
                <span className="block text-[10px] text-slate-500 font-medium leading-none">Hotline Order</span>
                <span className="font-bold text-slate-800 font-mono text-[11px]">+94 77 788 2156</span>
              </div>
            </div>

            {/* Wishlist Link */}
            <Link
              to="/shop"
              aria-label="Wishlist"
              className="hidden sm:grid size-9 sm:size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-all shadow-xs"
              title="Saved Items"
            >
              <Heart className="size-4.5" />
            </Link>

            {/* Cart Button with Count & Subtotal */}
            <Link
              to="/cart"
              className="flex items-center gap-2.5 rounded-xl border border-blue-600 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 h-10 shadow-sm transition-all active:scale-95"
            >
              <div className="relative">
                <ShoppingCart className="size-4.5" />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2.5 grid min-w-4 h-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white ring-2 ring-white">
                    {count}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] font-medium text-blue-100 uppercase tracking-wider">Cart</span>
                <span className="text-xs font-bold text-white font-mono">
                  {subtotal > 0 ? formatLKR(subtotal) : "LKR 0"}
                </span>
              </div>
            </Link>

            {/* Mobile Hamburger Menu Button (< lg) */}
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid lg:hidden size-9 sm:size-10 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:text-blue-600 transition-colors"
            >
              {mobileMenuOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
            </button>
          </div>
        </div>

        {/* 3. Primary Desktop Category Navigation Bar (>= lg) */}
        <nav className="hidden lg:block border-t border-slate-100 bg-slate-50/80">
          <div className="container-page flex h-11 items-center justify-between gap-4">
            {/* Left: All Categories Dropdown + Primary Departments */}
            <div className="flex items-center gap-1 xl:gap-2">
              {/* "All Categories" Dropdown Trigger */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="flex items-center gap-2 h-9 px-3.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  <Layers className="size-3.5" />
                  <span>All Categories</span>
                  <ChevronDown
                    className={`size-3.5 transition-transform duration-200 ${
                      categoryDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Categories Dropdown Panel */}
                {categoryDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-fade-up">
                    <div className="p-2 border-b border-slate-100">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Product Catalog Departments
                      </span>
                    </div>
                    <div className="py-1 space-y-0.5">
                      {categories.map((c) => {
                        const Icon = categoryIconsMap[c.slug] ?? Cpu;
                        return (
                          <Link
                            key={c.slug}
                            to="/category/$slug"
                            params={{ slug: c.slug }}
                            onClick={() => setCategoryDropdownOpen(false)}
                            className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 group transition-colors"
                          >
                            <div className="size-8 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                              <Icon className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors block truncate">
                                {c.name}
                              </span>
                              <span className="text-[10px] text-slate-400 block truncate">{c.tagline}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50 rounded-xl mt-1">
                      <Link
                        to="/shop"
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-between"
                      >
                        <span>Browse Entire Catalog</span>
                        <ChevronRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Category Links */}
              <div className="flex items-center gap-1 xl:gap-2 ml-1">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    activeProps={{
                      className: "!text-blue-600 !bg-blue-50/80 font-bold",
                    }}
                    className="h-8 px-2.5 xl:px-3 rounded-lg text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-white transition-colors inline-flex items-center whitespace-nowrap"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Secondary Links (Deals, Solutions, About, Contact) */}
            <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
              <Link
                to="/shop"
                className="h-8 px-2.5 rounded-lg text-rose-600 hover:bg-rose-50 font-bold inline-flex items-center gap-1"
              >
                <Sparkles className="size-3.5" />
                <span>Featured Deals</span>
              </Link>
              <span className="text-slate-300">|</span>
              <a
                href="/#solutions"
                className="h-8 px-2.5 rounded-lg hover:text-blue-600 hover:bg-white transition-colors inline-flex items-center"
              >
                Engineering Solutions
              </a>
              <Link
                to="/about"
                className="h-8 px-2.5 rounded-lg hover:text-blue-600 hover:bg-white transition-colors inline-flex items-center"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="h-8 px-2.5 rounded-lg hover:text-blue-600 hover:bg-white transition-colors inline-flex items-center"
              >
                Contact
              </Link>
            </div>
          </div>
        </nav>

        {/* 4. Mobile Navigation Drawer (< lg) */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div
              className="fixed inset-0 top-[calc(2.25rem+4rem)] z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-50 max-h-[calc(100vh-6rem)] overflow-y-auto border-t border-slate-200 bg-white p-4 sm:p-6 shadow-2xl animate-fade-up">
              <div className="mb-3 flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
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

              {/* Mobile Search Input in Drawer */}
              <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, SKU, components..."
                    className="w-full h-10 rounded-xl bg-slate-100 pl-9 pr-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>

              <nav className="flex flex-col space-y-1">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                >
                  <span>Home</span>
                  <ChevronRight className="size-3.5 text-slate-400" />
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                >
                  <span>All Products</span>
                  <ChevronRight className="size-3.5 text-slate-400" />
                </Link>

                <div className="pt-2 pb-1 px-3.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    Categories
                  </span>
                </div>

                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                  >
                    <span>{c.name}</span>
                    <ChevronRight className="size-3.5 text-slate-400" />
                  </Link>
                ))}

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                >
                  <span>About Us</span>
                  <ChevronRight className="size-3.5 text-slate-400" />
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                >
                  <span>Contact & Store Location</span>
                  <ChevronRight className="size-3.5 text-slate-400" />
                </Link>
              </nav>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                <a
                  href="tel:+94777882156"
                  className="flex items-center justify-between rounded-xl bg-blue-50/70 p-3 text-xs font-bold text-blue-700 hover:bg-blue-100/70 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="size-4" /> Call Hotline: +94 77 788 2156
                  </span>
                  <ChevronRight className="size-3.5" />
                </a>
                <p className="px-1 text-[11px] text-slate-500">
                  Store: 91 1st Cross St, Colombo 00110, Sri Lanka
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 5. Mobile Sticky Bottom Navigation Dock (mobile phones only, < 768px, hidden on desktop) */}
      <div className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="container-page flex items-center justify-around py-1.5">
          <Link
            to="/"
            activeProps={{ className: "!text-blue-600 font-bold" }}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <Home className="size-5" />
            <span>Home</span>
          </Link>

          <Link
            to="/shop"
            activeProps={{ className: "!text-blue-600 font-bold" }}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <LayoutGrid className="size-5" />
            <span>Shop</span>
          </Link>

          <Link
            to="/cart"
            activeProps={{ className: "!text-blue-600 font-bold" }}
            className="relative flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <div className="relative">
              <ShoppingCart className="size-5" />
              {count > 0 && (
                <span className="absolute -top-1.5 -right-2 grid min-w-4 h-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-extrabold text-white">
                  {count}
                </span>
              )}
            </div>
            <span>Cart</span>
          </Link>

          <Link
            to="/contact"
            activeProps={{ className: "!text-blue-600 font-bold" }}
            className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 text-[10px] font-medium text-slate-500 hover:text-blue-600 transition-colors"
          >
            <Phone className="size-5" />
            <span>Contact</span>
          </Link>
        </div>
      </div>
    </>
  );
}
