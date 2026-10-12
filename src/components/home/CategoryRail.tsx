import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { productsByCategory, type Category, type Product } from "@/data/products";

export function CategoryRail({
  category,
  products,
}: {
  category: Category;
  products?: Product[];
}) {
  const items = products && products.length > 0 ? products : productsByCategory(category.slug, 6);

  if (items.length === 0) return null;

  return (
    <section className="container-page py-6 sm:py-10 lg:py-14">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2.5 pb-2">
        <div className="min-w-0">
          <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-wider text-[#0066FF]">
            {category.tagline}
          </span>
          <h2 className="mt-1 font-display text-xl xs:text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            {category.name}
          </h2>
          <p className="mt-1 sm:mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted-foreground line-clamp-2 sm:line-clamp-none">
            {category.description}
          </p>
        </div>
        <Link
          to="/category/$slug"
          params={{ slug: category.slug }}
          className="hidden sm:inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-bold text-foreground shadow-xs hover:border-[#0066FF] hover:text-[#0066FF] transition-colors"
        >
          View all products <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      {/* Responsive Grid: 2 columns on mobile, 3 on tablet, 4 on desktop, 6 on wide screens */}
      <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <div className="mt-3.5 sm:hidden">
        <Link
          to="/category/$slug"
          params={{ slug: category.slug }}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-foreground shadow-xs hover:bg-slate-50 transition-colors"
        >
          View all {category.name} <ArrowRight className="size-3.5 text-[#0066FF]" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
