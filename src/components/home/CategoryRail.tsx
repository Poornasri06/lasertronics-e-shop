import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { productsByCategory, type Category } from "@/data/products";

export function CategoryRail({ category }: { category: Category }) {
  const items = productsByCategory(category.slug, 6);

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="flex items-end justify-between gap-4 border-b border-white/70 pb-5">
        <div className="min-w-0">
          <span className="inline-block rounded-full border border-white/80 bg-white/70 px-3 py-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0071e3] shadow-xs backdrop-blur-md">
            {category.tagline}
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#1d1d1f] sm:text-3xl">
            {category.name}
          </h2>
          <p className="mt-1.5 max-w-xl text-xs text-slate-500 sm:text-sm">
            {category.description}
          </p>
        </div>
        <Link
          to="/category/$slug"
          params={{ slug: category.slug }}
          className="apple-pill-secondary hidden shrink-0 items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#1d1d1f] hover:text-[#0071e3] sm:inline-flex"
        >
          View all 10 products <ArrowRight className="size-3.5 text-[#0071e3]" aria-hidden />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <Link
        to="/category/$slug"
        params={{ slug: category.slug }}
        className="apple-pill-secondary mt-6 flex min-h-11 items-center justify-center gap-2 text-xs font-semibold text-[#1d1d1f] sm:hidden"
      >
        Explore all {category.name} <ArrowRight className="size-3.5 text-[#0071e3]" aria-hidden />
      </Link>
    </section>
  );
}


