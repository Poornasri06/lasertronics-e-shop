import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { categories, getCategory, productsByCategory } from "@/data/products";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = getCategory(params.slug);
    if (!category) throw notFound();
    return { category };
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

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const items = productsByCategory(category.slug);

  return (
    <SiteLayout>
      {/* iOS Frosted Glass Banner */}
      <div className="relative overflow-hidden border-b border-white/60 bg-gradient-to-b from-blue-50/40 via-white/50 to-white/70 py-10 backdrop-blur-xl lg:py-14">
        <div className="container-page">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <Link to="/shop" className="hover:text-primary transition-colors">
              Categories
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <span className="truncate font-semibold text-foreground">{category.name}</span>
          </nav>
          <span className="mt-4 inline-block rounded-full border border-white/80 bg-white/75 px-3.5 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-primary shadow-xs backdrop-blur-md">
            {category.tagline}
          </span>
          <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            {category.name}
          </h1>
          <p className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-muted-foreground">
            {category.description}
          </p>
        </div>
      </div>

      <div className="container-page py-10 lg:py-14">
        <div className="flex items-center justify-between border-b border-white/80 pb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Showing all {items.length} products
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-50/80 px-2.5 py-0.5 text-xs font-bold text-emerald-800 backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sri Lanka In-Stock
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        {/* Other categories as iOS frosted pills */}
        <div className="mt-14 border-t border-white/80 pt-8">
          <h2 className="font-display text-base font-bold text-foreground">Explore Other Ranges</h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {categories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="apple-btn-glass rounded-full px-4.5 py-2 text-xs font-bold text-foreground transition-all hover:text-primary active:scale-95"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

