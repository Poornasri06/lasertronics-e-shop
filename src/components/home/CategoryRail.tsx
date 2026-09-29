import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { productsByCategory, type Category } from "@/data/products";

export function CategoryRail({ category }: { category: Category }) {
  const items = productsByCategory(category.slug, 6);

  return (
    <section className="container-page py-8 lg:py-12">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pb-1">
        <div className="min-w-0">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#0066FF] sm:text-sm">
            {category.tagline}
          </span>
          <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            {category.name}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {category.description}
          </p>
        </div>
        <Link
          to="/category/$slug"
          params={{ slug: category.slug }}
          className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-bold text-foreground shadow-xs hover:border-[#0066FF] hover:text-[#0066FF]"
        >
          View all 10 products <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      {/* Amazon-style 2 pictures per row (down by down) on mobile, scaling on larger screens */}
      <div className="mt-5 grid grid-cols-2 gap-3.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <div className="mt-4 sm:hidden">
        <Link
          to="/category/$slug"
          params={{ slug: category.slug }}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-foreground shadow-xs hover:bg-slate-50"
        >
          View all {category.name} <ArrowRight className="size-3.5 text-[#0066FF]" aria-hidden />
        </Link>
      </div>
    </section>
  );
}


