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
    const desc = loaderData?.category.description ?? "Browse Lasertronics products.";
    return {
      meta: [
        { title: `${name} | Lasertronics Sri Lanka` },
        { name: "description", content: desc },
        { property: "og:title", content: `${name} | Lasertronics` },
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
      <div className="bg-ink py-10 text-ink-foreground lg:py-14">
        <div className="container-page">
          <nav className="flex items-center gap-1 text-xs text-ink-muted">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <span className="truncate text-ink-foreground">{category.name}</span>
          </nav>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {category.tagline}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">{category.name}</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
            {category.description}
          </p>
        </div>
      </div>

      <div className="container-page py-10 lg:py-14">
        <p className="text-sm text-muted-foreground">{items.length} products</p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>

        <div className="mt-14 border-t border-border pt-8">
          <h2 className="text-lg font-bold">Other categories</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories
              .filter((c) => c.slug !== category.slug)
              .map((c) => (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="rounded-full border border-border bg-surface px-4 py-2 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
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
