import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/data/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "All Products | Lasertronics Sri Lanka" },
      {
        name: "description",
        content:
          "Browse every Lasertronics product: mobile accessories, components, TV accessories, IoT boards and repair kits with LKR pricing.",
      },
      { property: "og:title", content: "All Products | Lasertronics" },
      {
        property: "og:description",
        content: "The full Lasertronics electronics catalogue, priced in LKR.",
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
      <div className="bg-ink py-10 text-ink-foreground lg:py-14">
        <div className="container-page">
          <h1 className="text-3xl font-extrabold sm:text-4xl">All products</h1>
          <p className="mt-3 max-w-xl text-sm text-ink-muted">
            {products.length} products across five categories, priced in Sri Lankan rupees.
          </p>
        </div>
      </div>

      <div className="container-page py-8 lg:py-12">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <label className="relative block min-w-0">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <span className="sr-only">Search products</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="min-h-12 w-full rounded-full border border-border bg-surface pl-11 pr-4 text-sm outline-none focus:border-primary"
            />
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort products"
            className="min-h-12 rounded-full border border-border bg-surface px-4 text-sm outline-none focus:border-primary"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>

        <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ slug: "all", name: "All" }, ...categories].map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => setActive(c.slug)}
              className={`min-h-10 shrink-0 rounded-full border px-4 text-xs font-bold transition-colors ${
                active === c.slug
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{results.length} products</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {results.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        {results.length === 0 && (
          <p className="py-16 text-center text-sm text-muted-foreground">
            No products match that search.
          </p>
        )}
      </div>
    </SiteLayout>
  );
}
