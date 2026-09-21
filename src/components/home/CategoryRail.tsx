import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { productsByCategory, type Category } from "@/data/products";

export function CategoryRail({ category }: { category: Category }) {
  const items = productsByCategory(category.slug, 6);

  return (
    <section className="container-page py-10 lg:py-14">
      <div className="flex items-end justify-between gap-4 border-b border-white/80 pb-4">
        <div className="min-w-0">
          <span className="inline-block rounded-full border border-white/80 bg-white/70 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary shadow-xs backdrop-blur-md">
            {category.tagline}
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            {category.name}
          </h2>
          <p className="mt-1.5 max-w-xl text-xs text-muted-foreground sm:text-sm">
            {category.description}
          </p>
        </div>
        <Link
          to="/category/$slug"
          params={{ slug: category.slug }}
          className="apple-btn-glass hidden shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-foreground hover:text-primary sm:inline-flex"
        >
          View all 10 products <ArrowRight className="size-3.5 text-primary" aria-hidden />
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
        className="apple-btn-glass mt-6 flex min-h-11 items-center justify-center gap-2 rounded-full text-xs font-bold text-foreground sm:hidden"
      >
        Explore all {category.name} <ArrowRight className="size-3.5 text-primary" aria-hidden />
      </Link>
    </section>
  );
}


