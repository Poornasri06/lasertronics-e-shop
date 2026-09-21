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
      <div className="bg-ink py-10 text-ink-foreground lg:py-14 border-b border-ink-muted/15">
        <div className="container-page">
          <nav className="flex items-center gap-1.5 text-xs text-ink-muted">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <span className="truncate text-ink-foreground font-medium">{category.name}</span>
          </nav>
          <span className="mt-4 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {category.tagline}
          </span>
          <h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl text-white">
            {category.name}
          </h1>
          <p className="mt-2.5 max-w-xl text-xs sm:text-sm leading-relaxed text-ink-muted">
            {category.description}
          </p>
        </div>
      </div>

      <div className="container-page py-10 lg:py-14">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Showing all {items.length} products
          </p>
          <span className="text-xs font-semibold text-primary">Sri Lanka In-Stock</span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <h2 className="text-base font-bold font-display">Other Categories</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold text-foreground/80 transition-all hover:border-primary hover:bg-accent/40 hover:text-primary"
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

