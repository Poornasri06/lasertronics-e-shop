import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/data/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "All Products | LASERTRONICS PVT LTD Sri Lanka" },
      {
        name: "description",
        content:
          "Browse every LASERTRONICS PVT LTD product: mobile accessories, components, TV accessories, IoT boards and repair kits with LKR pricing.",
      },
      { property: "og:title", content: "All Products | LASERTRONICS PVT LTD" },
      {
        property: "og:description",
        content: "The full LASERTRONICS PVT LTD electronics catalogue, priced in LKR.",
      },
    ],
  }),
  component: ShopPage,
});

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

function ShopPage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("featured");

  const results = useMemo(() => {
    let list = products.filter(
      (p) =>
        (active === "all" || p.category === active) &&
        (query.trim() === "" || p.name.toLowerCase().includes(query.trim().toLowerCase())),
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, active, sort]);

  return (
    <SiteLayout>
      {/* iOS Frosted Glass Banner */}
      <div className="relative overflow-hidden border-b border-white/60 bg-gradient-to-b from-blue-50/40 via-white/50 to-white/70 py-10 backdrop-blur-xl lg:py-14">
        <div className="container-page">
          <span className="inline-block rounded-full border border-white/80 bg-white/70 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-primary shadow-xs backdrop-blur-md">
            Product Catalogue
          </span>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            All Products
          </h1>
          <p className="mt-2 max-w-xl text-xs sm:text-sm text-muted-foreground">
            {products.length} products across five categories, priced in Sri Lankan rupees.
          </p>
        </div>
      </div>

      <div className="container-page py-8 lg:py-12">
        {/* iOS Glass Search & Filter Bar */}
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block min-w-0">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <span className="sr-only">Search products</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components, accessories, tools..."
              className="glass-input min-h-12 w-full rounded-full border border-white/80 bg-white/75 pl-11 pr-4 text-sm text-foreground shadow-[0_2px_12px_rgba(10,30,60,0.04)] backdrop-blur-xl outline-none transition-all placeholder:text-muted-foreground/70 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/15"
            />
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort products"
            className="min-h-12 rounded-full border border-white/80 bg-white/75 px-5 text-xs font-bold text-foreground shadow-[0_2px_12px_rgba(10,30,60,0.04)] backdrop-blur-xl outline-none transition-all focus:border-blue-500 focus:bg-white"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* iOS Segmented Category Filter Pills */}
        <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ slug: "all", name: "All Products" }, ...categories].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActive(c.slug)}
              className={`min-h-10 shrink-0 rounded-full px-4 text-xs font-bold transition-all active:scale-95 ${
                active === c.slug
                  ? "apple-btn-primary border border-transparent shadow-md"
                  : "border border-white/80 bg-white/70 text-foreground/80 shadow-xs backdrop-blur-md hover:bg-white hover:text-primary hover:border-blue-400/30"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-between">
          <p className="text-xs font-semibold text-muted-foreground">
            Showing <span className="font-bold text-foreground">{results.length}</span> items
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        {results.length === 0 && (
          <div className="glass-card mt-8 rounded-3xl border border-white/80 bg-white/70 py-16 text-center backdrop-blur-xl">
            <p className="text-sm font-semibold text-muted-foreground">
              No products found matching "{query}".
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActive("all");
              }}
              className="apple-btn-glass mt-4 rounded-full px-6 py-2.5 text-xs font-bold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
