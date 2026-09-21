import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Heart,
  User,
  ChevronRight,
  Phone,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import logoAsset from "@/assets/logo.jpg";
import { categories, products, formatLKR } from "@/data/products";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { items, count, subtotal, shipping, total, setQty, remove } = useCart();
  const navigate = useNavigate();

  // Handle scroll detection for dynamic glass opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when any modal or drawer is open
  useEffect(() => {
    const anyOpen = mobileMenuOpen || searchOpen || cartDrawerOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, searchOpen, cartDrawerOpen]);

  // Live search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 6);
  }, [searchQuery]);

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="bg-[#071A2B] text-slate-300">
        <div className="container-page flex h-8 items-center justify-between gap-3 text-[11px] sm:text-xs">
          <p className="truncate font-medium">
            Island-wide delivery across Sri Lanka · Free delivery over LKR 15,000
          </p>
          <a
            href="tel:+94777882156"
            className="flex shrink-0 items-center gap-1.5 font-semibold text-slate-300 transition-colors hover:text-[#12A8E8]"
          >
            <Phone className="size-3 text-[#0878D1]" aria-hidden />
            <span>+94 77 788 2156</span>
          </a>
        </div>
      </div>

      {/* Apple-style Floating Sticky Glass Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "glass-header-scrolled" : "glass-header-top"
        }`}
      >
        <div className="container-page flex h-16 items-center justify-between gap-3 lg:h-20">
          {/* Brand Logo & Title */}
          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <div className="relative overflow-hidden rounded-full p-0.5 shadow-sm transition-transform group-hover:scale-105">
              <img
                src={logoAsset}
                alt="Lasertronics PVT LTD logo"
                width={42}
                height={42}
                className="size-9 rounded-full object-cover sm:size-10"
              />
            </div>
            <div className="min-w-0">
              <span className="block font-display text-base font-extrabold tracking-tight text-[#111827] sm:text-lg">
                Lasertronics PVT LTD
              </span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0878D1] sm:block">
                Electronics & Technology
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-0.5 xl:flex">
            {desktopNavLinks.map((link) =>
              link.params ? (
                <Link
                  key={link.label}
                  to={link.to}
                  params={link.params}
                  activeProps={{
                    className:
                      "text-[#0878D1] font-bold bg-[#0878D1]/10 shadow-xs",
                  }}
                  className="rounded-full px-3 py-1.5 text-[13px] font-medium text-[#111827]/80 transition-all duration-200 hover:bg-[#0878D1]/8 hover:text-[#0878D1]"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.label}
                  to={link.to}
                  activeProps={{
                    className:
                      "text-[#0878D1] font-bold bg-[#0878D1]/10 shadow-xs",
                  }}
                  className="rounded-full px-3 py-1.5 text-[13px] font-medium text-[#111827]/80 transition-all duration-200 hover:bg-[#0878D1]/8 hover:text-[#0878D1]"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Right Action Icons: Search, Wishlist, Cart, Account, Mobile Menu */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Search Trigger */}
            <button
              type="button"
              aria-label="Open search"
              onClick={() => setSearchOpen(true)}
              className="grid size-10 place-items-center rounded-full text-[#111827]/80 transition-all duration-200 hover:bg-black/5 hover:text-[#0878D1] active:scale-95"
            >
              <Search className="size-5" aria-hidden />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/shop"
              aria-label="Wishlist"
              className="hidden size-10 place-items-center rounded-full text-[#111827]/80 transition-all duration-200 hover:bg-black/5 hover:text-[#0878D1] active:scale-95 sm:grid"
            >
              <Heart className="size-5" aria-hidden />
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              aria-label="Open shopping cart"
              onClick={() => setCartDrawerOpen(true)}
              className="relative grid size-10 place-items-center rounded-full text-[#111827]/80 transition-all duration-200 hover:bg-black/5 hover:text-[#0878D1] active:scale-95"
            >
              <ShoppingCart className="size-5" aria-hidden />
              {count > 0 && (
                <span className="absolute right-1 top-1 grid min-w-4.5 h-4.5 place-items-center rounded-full bg-[#0878D1] px-1 text-[10px] font-bold text-white shadow-xs">
                  {count}
                </span>
              )}
            </button>

            {/* Account Link */}
            <Link
              to="/about"
              aria-label="Account"
              className="hidden size-10 place-items-center rounded-full text-[#111827]/80 transition-all duration-200 hover:bg-black/5 hover:text-[#0878D1] active:scale-95 sm:grid"
            >
              <User className="size-5" aria-hidden />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(true)}
              className="grid size-10 place-items-center rounded-full text-[#111827]/80 transition-all duration-200 hover:bg-black/5 hover:text-[#0878D1] xl:hidden"
            >
              <Menu className="size-6" aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          GLASS SEARCH EXPERIENCE
          ======================================================== */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:p-6 sm:pt-24">
          {/* Backdrop with strong blur */}
          <div
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 bg-[#071A2B]/40 backdrop-blur-md transition-opacity duration-300"
          />

          {/* Large Centered Glass Search Container */}
          <div className="relative z-10 w-full max-w-2xl glass-panel p-6 shadow-2xl animate-fade-up">
            <div className="flex items-center justify-between gap-3 border-b border-black/10 pb-4">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#0878D1]"
                  aria-hidden
                />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories and accessories..."
                  className="w-full rounded-full border border-black/10 bg-white/80 py-3 pl-11 pr-4 text-sm font-medium text-[#111827] outline-none placeholder:text-[#667085] focus:border-[#0878D1] focus:ring-2 focus:ring-[#0878D1]/20"
                />
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="grid size-10 shrink-0 place-items-center rounded-full text-[#667085] transition-colors hover:bg-black/5 hover:text-[#111827]"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Suggested Categories */}
            <div className="mt-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                Popular Categories
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to="/category/$slug"
                    params={{ slug: cat.slug }}
                    onClick={() => setSearchOpen(false)}
                    className="glass-pill px-3.5 py-1.5 text-xs font-semibold text-[#111827] transition-all hover:bg-[#0878D1] hover:text-white"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Live Search Matching Products */}
            {searchQuery.trim() && (
              <div className="mt-5 border-t border-black/5 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#667085]">
                  Search Results ({searchResults.length})
                </p>
                {searchResults.length === 0 ? (
                  <p className="py-6 text-center text-sm text-[#667085]">
                    No products found for "{searchQuery}".
                  </p>
                ) : (
                  <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
                    {searchResults.map((prod) => (
                      <Link
                        key={prod.slug}
                        to="/product/$slug"
                        params={{ slug: prod.slug }}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/80"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="size-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate text-xs font-bold text-[#111827]">
                            {prod.name}
                          </h4>
                          <span className="text-[11px] text-[#667085]">
                            {prod.category}
                          </span>
                        </div>
                        <span className="font-display text-xs font-bold text-[#0878D1]">
                          {formatLKR(prod.price)}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          GLASS CART PANEL (Right-side Drawer on Desktop / Sheet on Mobile)
          ======================================================== */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop with blur */}
          <div
            onClick={() => setCartDrawerOpen(false)}
            className="fixed inset-0 bg-[#071A2B]/40 backdrop-blur-md transition-opacity duration-300"
          />

          {/* Drawer Body */}
          <aside className="relative z-10 flex h-full w-full max-w-md flex-col glass-panel rounded-none sm:rounded-l-3xl shadow-2xl animate-fade-up">
            {/* Header */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-black/10 px-6">
              <div className="flex items-center gap-2">
                <ShoppingCart className="size-5 text-[#0878D1]" />
                <h3 className="font-display text-base font-bold text-[#111827]">
                  Your Cart {count > 0 ? `(${count})` : ""}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCartDrawerOpen(false)}
                aria-label="Close cart"
                className="grid size-9 place-items-center rounded-full text-[#667085] hover:bg-black/5 hover:text-[#111827]"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="grid size-16 place-items-center rounded-full bg-[#0878D1]/10 text-[#0878D1]">
                    <ShoppingCart className="size-8" />
                  </div>
                  <h4 className="mt-4 text-base font-bold text-[#111827]">Your cart is empty</h4>
                  <p className="mt-1 text-xs text-[#667085]">
                    Explore our electronics, kits, and accessories to get started.
                  </p>
                  <Link
                    to="/shop"
                    onClick={() => setCartDrawerOpen(false)}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0878D1] px-6 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#0662ab]"
                  >
                    Start Shopping <ArrowRight className="size-4" />
                  </Link>
                </div>
              ) : (
                items.map(({ product, qty }) => (
                  <div
                    key={product.slug}
                    className="flex gap-3.5 rounded-2xl border border-white/60 bg-white/70 p-3 shadow-xs"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-16 rounded-xl object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <h4 className="line-clamp-1 text-xs font-bold text-[#111827]">
                          {product.name}
                        </h4>
                        <p className="mt-0.5 font-display text-xs font-bold text-[#0878D1]">
                          {formatLKR(product.price)}
                        </p>
                      </div>

                      {/* Quantity Controls & Remove */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-black/10 bg-white/90 px-2 py-0.5">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQty(product.slug, qty - 1)}
                            className="p-1 text-[#667085] hover:text-[#111827]"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#111827]">
                            {qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQty(product.slug, qty + 1)}
                            className="p-1 text-[#667085] hover:text-[#111827]"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${product.name}`}
                          onClick={() => remove(product.slug)}
                          className="p-1 text-[#667085] hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with Subtotal & Checkout */}
            {items.length > 0 && (
              <div className="border-t border-black/10 p-6 space-y-3">
                <div className="flex justify-between text-xs text-[#667085]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#111827]">{formatLKR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#667085]">
                  <span>Shipping</span>
                  <span className="font-bold text-[#111827]">
                    {shipping === 0 ? "FREE" : formatLKR(shipping)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-black/5 pt-2 text-sm font-extrabold text-[#111827]">
                  <span>Total</span>
                  <span className="text-[#0878D1]">{formatLKR(total)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCartDrawerOpen(false);
                    navigate({ to: "/checkout" });
                  }}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#0878D1] py-3.5 text-xs font-bold text-white shadow-md transition-all hover:bg-[#0662ab] hover:shadow-lg active:scale-98"
                >
                  Checkout Now <ArrowRight className="size-4" />
                </button>

                <Link
                  to="/cart"
                  onClick={() => setCartDrawerOpen(false)}
                  className="block text-center text-xs font-semibold text-[#0878D1] hover:underline"
                >
                  View Full Cart Page
                </Link>
              </div>
            )}
          </aside>
        </div>
      )}

      {/* ========================================================
          APPLE-STYLE GLASS MOBILE MENU
          ======================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col xl:hidden">
          {/* Backdrop with blur */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#071A2B]/40 backdrop-blur-md"
          />

          {/* Full Screen / Large Glass Panel */}
          <div className="relative z-10 flex h-full w-full flex-col glass-panel rounded-none p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div className="flex items-center gap-2.5">
                <img
                  src={logoAsset}
                  alt="Lasertronics PVT LTD logo"
                  className="size-8 rounded-full object-cover"
                />
                <span className="font-display text-sm font-bold text-[#111827]">
                  Lasertronics PVT LTD
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="grid size-10 place-items-center rounded-full text-[#667085] hover:bg-black/5 hover:text-[#111827]"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Large Comfortable Touch Target Navigation */}
            <div className="flex-1 overflow-y-auto py-6">
              <nav className="space-y-2">
                {desktopNavLinks.map((link) =>
                  link.params ? (
                    <Link
                      key={link.label}
                      to={link.to}
                      params={link.params}
                      onClick={() => setMobileMenuOpen(false)}
                      activeProps={{
                        className:
                          "bg-[#0878D1] text-white font-bold shadow-sm",
                      }}
                      className="flex min-h-14 items-center justify-between rounded-2xl px-5 text-base font-semibold text-[#111827] transition-all hover:bg-white/80 active:scale-98"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="size-5 opacity-60" />
                    </Link>
                  ) : (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      activeProps={{
                        className:
                          "bg-[#0878D1] text-white font-bold shadow-sm",
                      }}
                      className="flex min-h-14 items-center justify-between rounded-2xl px-5 text-base font-semibold text-[#111827] transition-all hover:bg-white/80 active:scale-98"
                    >
                      <span>{link.label}</span>
                      <ChevronRight className="size-5 opacity-60" />
                    </Link>
                  )
                )}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-black/10 pt-4 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCartDrawerOpen(true);
                }}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#0878D1] px-5 text-sm font-bold text-white shadow-md"
              >
                <ShoppingCart className="size-4" />
                View Cart {count > 0 ? `(${count})` : ""}
              </button>
              <a
                href="tel:+94777882156"
                className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 text-xs font-bold text-[#111827]"
              >
                <Phone className="size-3.5 text-[#0878D1]" /> +94 77 788 2156
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
