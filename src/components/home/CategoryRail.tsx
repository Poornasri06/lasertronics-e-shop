import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { productsByCategory, type Category } from "@/data/products";

export function CategoryRail({ category }: { category: Category }) {
  const items = productsByCategory(category.slug, 6);

  return (
    <section className="container-page py-10 lg:py-14">
      <div className="flex items-end justify-between gap-4 border-b border-black/8 pb-4">
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-[#0878D1]/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#0878D1]">
            {category.tagline}
          </span>
          <h2 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
            {category.name}
          </h2>
          <p className="mt-1.5 max-w-xl text-xs text-[#667085] sm:text-sm">
            {category.description}
          </p>
        </div>
        <Link
          to="/category/$slug"
          params={{ slug: category.slug }}
          className="hidden shrink-0 items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-bold text-[#0878D1] shadow-xs backdrop-blur-md transition-all hover:bg-[#0878D1] hover:text-white sm:inline-flex"
        >
          View all 10 products <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3.5 sm:gap-5 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <Link
        to="/category/$slug"
        params={{ slug: category.slug }}
        className="mt-6 flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#0878D1]/30 bg-[#0878D1]/8 text-xs font-bold text-[#0878D1] sm:hidden"
      >
        Explore all {category.name} <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    </section>
  );
}
