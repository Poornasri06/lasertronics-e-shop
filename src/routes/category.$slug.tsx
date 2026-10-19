import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { categories, getCategory, productsByCategory, registerLiveProducts } from "@/data/products";
import { fetchCategoryProductsFn } from "@/lib/server-products";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    let live: any[] = [];
    try {
      const res = await fetchCategoryProductsFn({ data: params.slug });
      if (res && res.length > 0) {
        live = res;
        registerLiveProducts(res);
      }
    } catch (err) {
      console.error("Failed to load category products in loader:", err);
    }
    return { category, liveProducts: live };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.category.name ?? "Category";
    const desc = loaderData?.category.description ?? "Browse LASERTRONICS PVT LTD products.";
    return {
      meta: [
        { title: `${name} | LASERTRONICS PVT LTD Sri Lanka` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} | LASERTRONICS PVT LTD` },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: CategoryPage,
});

import { useMemo, useState } from "react";

const PAGE_SIZE = 30;

function CategoryPage() {
  const { category, liveProducts } = Route.useLoaderData();
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [page, setPage] = useState<number>(1);

  const allCategoryProducts = useMemo(() => {
    const raw =
      liveProducts && liveProducts.length > 0
        ? liveProducts
        : productsByCategory(category.slug);
    return raw.filter((p) => (p.stock || 0) > 0);
  }, [liveProducts, category.slug]);

  const sortedProducts = useMemo(() => {
    let list = [...allCategoryProducts];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [allCategoryProducts, sort]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedProducts.slice(start, start + PAGE_SIZE);
  }, [sortedProducts, currentPage]);

  const handleSortChange = (newSort: "featured" | "price-asc" | "price-desc" | "rating") => {
    setSort(newSort);
    setPage(1);
  };

  const showingStart = sortedProducts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingEnd = Math.min(currentPage * PAGE_SIZE, sortedProducts.length);

  return (
    <SiteLayout>
      {/* Category Header & Breadcrumb Banner */}
      <div className="relative border-b border-slate-200/80 bg-gradient-to-b from-slate-50 via-white to-white py-6 sm:py-8 lg:py-10">
        <div className="container-page">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3 text-slate-400" aria-hidden />
            <Link to="/shop" className="hover:text-primary transition-colors">
              Categories
            </Link>
            <ChevronRight className="size-3 text-slate-400" aria-hidden />
            <span className="font-bold text-foreground">{category.name}</span>
          </nav>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="inline-block rounded-full bg-blue-50 border border-blue-200/60 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wider text-primary">
                {category.tagline}
              </span>
              <h1 className="mt-2 font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                {category.name}
              </h1>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                {category.description}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-2xs">
              <span className="text-xs font-semibold text-slate-500">Available:</span>
              <span className="text-sm font-extrabold text-foreground">{sortedProducts.length} items</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page py-6 sm:py-8 lg:py-10">
        {/* Toolbar: Count & Sort */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <p className="text-xs font-bold text-slate-600">
            {sortedProducts.length > PAGE_SIZE ? (
              <>
                Showing <strong className="text-foreground">{showingStart}–{showingEnd}</strong> of{" "}
                <strong className="text-foreground">{sortedProducts.length}</strong> items in {category.name}
              </>
            ) : (
              <>
                Showing all <strong className="text-foreground">{sortedProducts.length}</strong> items in {category.name}
              </>
            )}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-foreground outline-none transition-all focus:border-primary cursor-pointer shadow-2xs"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Desktop Product Grid: 4 cols on lg, 5 cols on xl */}
        <div className="mt-6 grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {paginatedProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

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
                      currentPage === pNum
                        ? "bg-primary text-white shadow-xs"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
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

        {/* Related categories shelf */}
        <div className="mt-12 sm:mt-16 border-t border-slate-200 pt-8 sm:pt-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-foreground">
                Explore Other Electronics Ranges
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Browse our other specialized component and tooling departments.
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs font-bold text-primary hover:underline hidden sm:inline-flex items-center gap-1"
            >
              All Categories <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {categories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-primary/50 hover:shadow-sm transition-all group"
                >
                  <h3 className="font-display text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-1">{c.tagline}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
