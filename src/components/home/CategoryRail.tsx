import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { productsByCategory, type Category } from "@/data/products";

export function CategoryRail({ category }: { category: Category }) {
  const items = productsByCategory(category.slug, 6);

  return (
    <section className="container-page py-10 lg:py-14">
      <div className="flex items-end justify-between gap-4 border-b border-border/70 pb-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {category.tagline}
          </p>
          <h2 className="mt-1 font-display text-2xl font-extrabold sm:text-3xl">{category.name}</h2>
          <p className="mt-1.5 max-w-xl text-xs text-muted-foreground sm:text-sm">
            {category.description}
          </p>
        </div>
        <Link
          to="/category/$slug"
          params={{ slug: category.slug }}
          className="hidden shrink-0 items-center gap-1.5 text-sm font-bold text-primary hover:underline sm:inline-flex"
        >
          View all 10 products <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <Link
        to="/category/$slug"
        params={{ slug: category.slug }}
        className="mt-6 flex min-h-11 items-center justify-center gap-2 rounded-full border border-primary/30 bg-accent/30 text-xs font-bold text-primary sm:hidden"
      >
        Explore all {category.name} <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </section>
  );
}

