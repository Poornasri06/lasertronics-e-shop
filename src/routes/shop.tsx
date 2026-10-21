import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
  Check,
  Star,
  RotateCcw,
  Tag,
  ShieldCheck,
  Package,
} from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import {
  categories,
  products as defaultFallbackProducts,
  registerLiveProducts,
  registerLiveCategories,
  useStoreCategories,
  formatLKR,
} from "@/data/products";
import { fetchAllProductsFn, fetchAllCategoriesFn } from "@/lib/server-products";

type ShopSearch = {
  q?: string;
  category?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "rating";
  priceRange?: string;
  minRating?: number;
};

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
    category: typeof search.category === "string" ? search.category : undefined,
    sort: ["featured", "price-asc", "price-desc", "rating"].includes(search.sort as string)
      ? (search.sort as ShopSearch["sort"])
      : undefined,
    priceRange: typeof search.priceRange === "string" ? search.priceRange : undefined,
    minRating: typeof search.minRating === "number" ? search.minRating : undefined,
  }),
  loader: async () => {
    try {
      const [live, liveCats] = await Promise.all([
        fetchAllProductsFn().catch(() => null),
        fetchAllCategoriesFn().catch(() => null),
      ]);
      if (liveCats && liveCats.length > 0) {
        registerLiveCategories(liveCats);
      }
      if (live && live.length > 0) {
        registerLiveProducts(live);
        return { liveProducts: live };
      }
    } catch (err) {
      console.error("Failed to fetch live products in /shop loader:", err);
    }
    return { liveProducts: defaultFallbackProducts };
  },
  head: () => ({
    meta: [
      { title: "All Products | LASERTRONICS PVT LTD Sri Lanka" },
      {
        name: "description",
        content:
          "Browse LASERTRONICS PVT LTD genuine live inventory: mobile accessories, components, TV accessories, IoT boards and repair kits with live LKR pricing and stock.",
      },
      { property: "og:title", content: "All Products | LASERTRONICS PVT LTD" },
      {
        property: "og:description",
        content: "The full LASERTRONICS PVT LTD electronics, components, and tools catalogue.",
      },
    ],
  }),
  component: ShopPage,
});

type Sort = "featured" | "price-asc" | "price-desc" | "rating";
const PAGE_SIZE = 32;

const PRICE_BUCKETS = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-1k", label: "Under LKR 1,000", min: 0, max: 1000 },
  { id: "1k-5k", label: "LKR 1,000 - 5,000", min: 1000, max: 5000 },
  { id: "5k-15k", label: "LKR 5,000 - 15,000", min: 5000, max: 15000 },
  { id: "over-15k", label: "Over LKR 15,000", min: 15000, max: Infinity },
];

function ShopPage() {
  const { liveProducts } = Route.useLoaderData();
  const searchParams = Route.useSearch();
  const navigate = useNavigate();
  const categories = useStoreCategories();

  const allProducts = useMemo(() => {
    const raw = liveProducts && liveProducts.length > 0 ? liveProducts : defaultFallbackProducts;
    return raw.filter((p) => (p.stock || 0) > 0);
  }, [liveProducts]);

  // State initialized from search params or defaults
  const [query, setQuery] = useState(searchParams.q || "");
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.category || "all");
  const [sort, setSort] = useState<Sort>(searchParams.sort || "featured");
  const [priceBucket, setPriceBucket] = useState<string>(searchParams.priceRange || "all");
  const [minRating, setMinRating] = useState<number>(searchParams.minRating || 0);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state if URL search query changes (e.g. from Header search bar)
  useEffect(() => {
    if (searchParams.q !== undefined && searchParams.q !== query) {
      setQuery(searchParams.q);
      setPage(1);
    }
    if (searchParams.category !== undefined && searchParams.category !== activeCategory) {
      setActiveCategory(searchParams.category);
      setPage(1);
    }
  }, [searchParams.q, searchParams.category]);

  // Compute category product counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allProducts.length };
    for (const cat of categories) {
      counts[cat.slug] = allProducts.filter((p) => p.category === cat.slug).length;
    }
    return counts;
  }, [allProducts, categories]);

  const activeBucket = useMemo(
    () => PRICE_BUCKETS.find((b) => b.id === priceBucket) || PRICE_BUCKETS[0],
    [priceBucket]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allProducts.filter((p) => {
      // Category filter
      if (activeCategory !== "all" && p.category !== activeCategory) return false;

      // In stock filter
      if (inStockOnly && (p.stock || 0) <= 0) return false;

      // Price bucket filter
      if (p.price < activeBucket.min || p.price > activeBucket.max) return false;

      // Rating filter
      if (minRating > 0 && p.rating < minRating) return false;

      // Search query
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.specs.some((s) => s.value.toLowerCase().includes(q))
      );
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return list;
  }, [allProducts, query, activeCategory, sort, activeBucket, minRating, inStockOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleCategoryChange = (catSlug: string) => {
    setActiveCategory(catSlug);
    setPage(1);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  const resetAllFilters = () => {
    setQuery("");
    setActiveCategory("all");
    setPriceBucket("all");
    setMinRating(0);
    setSort("featured");
    setInStockOnly(true);
    setPage(1);
  };

  const hasActiveFilters =
    query.trim() !== "" ||
    activeCategory !== "all" ||
    priceBucket !== "all" ||
    minRating > 0 ||
    !inStockOnly ||
    sort !== "featured";

  return (
    <SiteLayout>
      {/* Breadcrumb & Catalog Banner */}
      <div className="relative border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="container-page py-6 lg:py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
                Lasertronics Hardware Catalog
              </span>
              <h1 className="mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                {activeCategory === "all"
                  ? "All Products & Components"
                  : categories.find((c) => c.slug === activeCategory)?.name || "Catalog"}
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                Showing {filtered.length} products backed by live InTouch ERP inventory.
              </p>
            </div>

            {/* Quick search input */}
            <div className="w-full sm:w-80 lg:w-96">
              <label className="relative block">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Filter by part number, IC or tool..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => handleQueryChange("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-6 sm:py-8 lg:py-10">
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* ========================================================= */}
          {/* DESKTOP LEFT FILTER SIDEBAR (hidden lg:block)            */}
          {/* ========================================================= */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-28 space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="size-4 text-primary" />
                  <h3 className="font-display text-sm font-bold text-foreground">Filters</h3>
                </div>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    <RotateCcw className="size-3" /> Reset
                  </button>
                )}
              </div>

              {/* Department / Categories facet */}
              <div className="pt-4 border-b border-slate-100 pb-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
                  Department
                </h4>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange("all")}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                      activeCategory === "all"
                        ? "bg-primary text-white font-bold"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>All Categories</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        activeCategory === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {categoryCounts.all ?? 0}
                    </span>
                  </button>

                  {categories.map((c) => {
                    const isSelected = activeCategory === c.slug;
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => handleCategoryChange(c.slug)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
                          isSelected
                            ? "bg-primary text-white font-bold"
                            : "text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span className="truncate pr-2">{c.name}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${
                            isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {categoryCounts[c.slug] ?? 0}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price range facet */}
              <div className="pt-4 border-b border-slate-100 pb-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
                  Price Range
                </h4>
                <div className="space-y-1">
                  {PRICE_BUCKETS.map((bucket) => {
                    const isSelected = priceBucket === bucket.id;
                    return (
                      <label
                        key={bucket.id}
                        className="flex items-center gap-2.5 px-2 py-1 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="desktop-price"
                          checked={isSelected}
                          onChange={() => {
                            setPriceBucket(bucket.id);
                            setPage(1);
                          }}
                          className="size-3.5 text-primary accent-primary focus:ring-primary"
                        />
                        <span className={isSelected ? "font-bold text-foreground" : ""}>
                          {bucket.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Customer Rating facet */}
              <div className="pt-4 border-b border-slate-100 pb-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
                  Customer Rating
                </h4>
                <div className="space-y-1">
                  {[4, 3, 0].map((star) => {
                    const isSelected = minRating === star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          setMinRating(star);
                          setPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer text-left ${
                          isSelected ? "bg-slate-100 font-bold text-foreground" : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {star > 0 ? (
                            <>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`size-3 ${
                                      i < star
                                        ? "fill-amber-400 text-amber-400"
                                        : "fill-slate-200 text-slate-200"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs">& Up</span>
                            </>
                          ) : (
                            <span className="text-xs">Any Rating</span>
                          )}
                        </div>
                        {isSelected && <Check className="size-3.5 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability facet */}
              <div className="pt-4">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5">
                  Availability
                </h4>
                <label className="flex items-center gap-2.5 px-2 py-1 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => {
                      setInStockOnly(e.target.checked);
                      setPage(1);
                    }}
                    className="size-3.5 rounded text-primary accent-primary focus:ring-primary"
                  />
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    In Stock Items Only
                  </span>
                </label>
              </div>
            </div>

            {/* Trust box */}
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 text-xs text-muted-foreground space-y-2">
              <div className="flex items-center gap-2 font-bold text-foreground">
                <ShieldCheck className="size-4 text-primary" />
                <span>Genuine Hardware Guarantee</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Direct component sourcing, live inventory levels from InTouch ERP, and local technical warranty support in Colombo.
              </p>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* MAIN CATALOG CONTENT AREA                                 */}
          {/* ========================================================= */}
          <main className="flex-1 min-w-0 w-full">
            {/* Top Toolbar: Search summary, mobile filter trigger, active pills, sort */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Mobile filter button */}
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                    className="lg:hidden inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-foreground hover:bg-slate-100"
                  >
                    <SlidersHorizontal className="size-3.5 text-primary" />
                    <span>Filters</span>
                    {hasActiveFilters && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </button>

                  <p className="text-xs font-medium text-muted-foreground">
                    Showing <strong className="text-foreground">{paginatedResults.length}</strong> of{" "}
                    <strong className="text-foreground">{filtered.length}</strong> products
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort by:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Sort)}
                    aria-label="Sort products"
                    className="rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2 text-xs font-bold text-foreground outline-none transition-all focus:border-primary focus:bg-white cursor-pointer"
                  >
                    <option value="featured">Featured / Best Selling</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>

              {/* Mobile Filter Drawer (when open on sm/md) */}
              {mobileFilterOpen && (
                <div className="lg:hidden mt-4 pt-4 border-t border-slate-100 space-y-4">
                  <div>
                    <span className="text-xs font-bold text-foreground mb-1.5 block">Department</span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCategoryChange("all")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                          activeCategory === "all" ? "bg-primary text-white" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        All
                      </button>
                      {categories.map((c) => (
                        <button
                          key={c.slug}
                          type="button"
                          onClick={() => handleCategoryChange(c.slug)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            activeCategory === c.slug ? "bg-primary text-white" : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-foreground mb-1.5 block">Price</span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRICE_BUCKETS.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => setPriceBucket(b.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                            priceBucket === b.id ? "bg-primary text-white" : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      Reset all filters
                    </button>
                  )}
                </div>
              )}

              {/* Active Filter Chips / Badges */}
              {hasActiveFilters && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 mr-1">Active:</span>

                  {activeCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200/60 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      Category: {categories.find((c) => c.slug === activeCategory)?.name}
                      <button
                        type="button"
                        onClick={() => handleCategoryChange("all")}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}

                  {priceBucket !== "all" && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200/60 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      Price: {activeBucket.label}
                      <button
                        type="button"
                        onClick={() => setPriceBucket("all")}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}

                  {minRating > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 border border-amber-200/60 px-2 py-0.5 text-[11px] font-semibold text-amber-900">
                      Rating: {minRating}★ & Up
                      <button
                        type="button"
                        onClick={() => setMinRating(0)}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}

                  {query && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-800">
                      Search: "{query}"
                      <button
                        type="button"
                        onClick={() => handleQueryChange("")}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <X className="size-3" />
                      </button>
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-[11px] font-bold text-slate-500 hover:text-primary ml-1 cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Desktop Product Grid (3 cols on lg, 4 cols on xl) */}
            {paginatedResults.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
                {paginatedResults.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center">
                <Package className="size-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-display text-base font-bold text-foreground">
                  No matching products found
                </h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                  Try adjusting your search query, selecting another category, or clearing active filters.
                </p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 cursor-pointer"
                >
                  <RotateCcw className="size-3.5" /> Reset Filters
                </button>
              </div>
            )}

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-between border-t border-slate-200 pt-5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => {
                    setPage((prev) => Math.max(1, prev - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-foreground shadow-2xs disabled:opacity-40 disabled:pointer-events-none hover:border-primary hover:text-primary cursor-pointer"
                >
                  <ChevronLeft className="size-4" /> Previous
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pNum = i + 1;
                    if (
                      totalPages > 6 &&
                      pNum !== 1 &&
                      pNum !== totalPages &&
                      Math.abs(pNum - currentPage) > 1
                    ) {
                      if (pNum === 2 || pNum === totalPages - 1) {
                        return (
                          <span key={pNum} className="px-1 text-xs text-slate-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                    return (
                      <button
                        key={pNum}
                        type="button"
                        onClick={() => {
                          setPage(pNum);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`size-8 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                          pNum === currentPage
                            ? "bg-primary text-white shadow-xs"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => {
                    setPage((prev) => Math.min(totalPages, prev + 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-foreground shadow-2xs disabled:opacity-40 disabled:pointer-events-none hover:border-primary hover:text-primary cursor-pointer"
                >
                  Next <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </SiteLayout>
  );
}
