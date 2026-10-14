import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { categories, products as defaultFallbackProducts, registerLiveProducts } from "@/data/products";
import { fetchAllProductsFn } from "@/lib/server-products";

export const Route = createFileRoute("/shop")({
  loader: async () => {
    try {
      const live = await fetchAllProductsFn();
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
        content: "The full LASERTRONICS PVT LTD electronics catalogue, live from InTouch ERP.",
      },
    ],
  }),
  component: ShopPage,
});

type Sort = "featured" | "price-asc" | "price-desc" | "rating";
const PAGE_SIZE = 36;

function ShopPage() {
  const { liveProducts } = Route.useLoaderData();
  const allProducts = useMemo(() => {
    const raw = liveProducts && liveProducts.length > 0 ? liveProducts : defaultFallbackProducts;
    return raw.filter((p) => (p.stock || 0) > 0);
  }, [liveProducts]);

  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = allProducts.filter((p) => {
      const matchesCategory = active === "all" || p.category === active;
      if (!matchesCategory) return false;
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
  }, [allProducts, query, active, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const handleCategoryChange = (catSlug: string) => {
    setActive(catSlug);
    setPage(1);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  return (
    <SiteLayout>
      {/* iOS Frosted Glass Banner */}
      <div className="relative overflow-hidden border-b border-white/60 bg-gradient-to-b from-blue-50/40 via-white/50 to-white/70 py-8 sm:py-12 backdrop-blur-xl lg:py-14">
        <div className="container-page">
          <span className="inline-block rounded-full border border-white/80 bg-white/70 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-primary shadow-xs backdrop-blur-md">
            Live ERP Inventory
          </span>
          <h1 className="mt-2.5 font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            All Products
          </h1>
          <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-muted-foreground">
            {allProducts.length.toLocaleString()} genuine products synchronized live from InTouch ERP, priced in Sri Lankan rupees.
          </p>
        </div>
      </div>

      <div className="container-page py-6 sm:py-10 lg:py-12">
        {/* iOS Glass Search & Filter Bar */}
        <div className="grid gap-2.5 sm:gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block min-w-0">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <span className="sr-only">Search products</span>
            <input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search components, SKU, ICs, accessories, tools..."
              className="glass-input min-h-11 sm:min-h-12 w-full rounded-full border border-white/80 bg-white/75 pl-11 pr-4 text-xs sm:text-sm text-foreground shadow-[0_2px_12px_rgba(10,30,60,0.04)] backdrop-blur-xl outline-none transition-all placeholder:text-muted-foreground/70 focus:border-blue-500 focus:bg-white"
            />
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort products"
            className="min-h-11 sm:min-h-12 rounded-full border border-white/80 bg-white/75 px-5 text-xs font-bold text-foreground shadow-[0_2px_12px_rgba(10,30,60,0.04)] backdrop-blur-xl outline-none transition-all focus:border-blue-500 focus:bg-white"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* iOS Segmented Category Filter Pills */}
        <div className="no-scrollbar -mx-4 mt-4 sm:mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ slug: "all", name: "All Products" }, ...categories].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => handleCategoryChange(c.slug)}
              className={`min-h-9 sm:min-h-10 shrink-0 rounded-full px-3.5 sm:px-4 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                active === c.slug
                  ? "apple-btn-primary border border-transparent shadow-md"
                  : "border border-white/80 bg-white/70 text-foreground/80 shadow-xs backdrop-blur-md hover:bg-white hover:text-primary hover:border-blue-400/30"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-5 sm:mt-7 flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">
            Showing <span className="font-bold text-foreground">{paginatedResults.length}</span> of{" "}
            <span className="font-bold text-foreground">{filtered.length.toLocaleString()}</span> items
          </p>
          {totalPages > 1 && (
            <p className="text-xs font-semibold text-muted-foreground">
              Page {currentPage} of {totalPages}
            </p>
          )}
        </div>

        {/* Responsive Grid */}
        <div className="mt-3.5 sm:mt-4 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {paginatedResults.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => {
                setPage((prev) => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-1 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-bold text-foreground shadow-xs backdrop-blur-md disabled:opacity-40 disabled:pointer-events-none hover:bg-white hover:text-primary"
            >
              <ChevronLeft className="size-4" /> Previous
            </button>

            <span className="px-3 text-xs font-bold text-muted-foreground">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => {
                setPage((prev) => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-1 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-xs font-bold text-foreground shadow-xs backdrop-blur-md disabled:opacity-40 disabled:pointer-events-none hover:bg-white hover:text-primary"
            >
              Next <ChevronRight className="size-4" />
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="glass-card mt-8 rounded-2xl sm:rounded-3xl border border-white/80 bg-white/70 py-12 sm:py-16 text-center backdrop-blur-xl">
            <p className="text-sm font-semibold text-muted-foreground">
              No products found matching "{query}".
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActive("all");
                setPage(1);
              }}
              className="apple-btn-glass mt-4 rounded-full px-6 py-2.5 text-xs font-bold cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
