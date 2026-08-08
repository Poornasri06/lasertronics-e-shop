import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { productsByCategory, type Category } from "@/data/products";

export function CategoryRail({ category }: { category: Category }) {
  const items = productsByCategory(category.slug, 6);

  return (
    <section className="container-page py-12 lg:py-16">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            {category.tagline}
          </p>
          <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">{category.name}</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{category.description}</p>
        </div>
        <Link
          to="/category/$slug"
          params={{ slug: category.slug }}
          className="hidden shrink-0 items-center gap-1.5 text-sm font-bold text-primary hover:underline sm:inline-flex"
        >
          View all <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {items.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <Link
        to="/category/$slug"
        params={{ slug: category.slug }}
        className="mt-6 flex min-h-11 items-center justify-center gap-2 rounded-full border border-border text-sm font-bold text-primary sm:hidden"
      >
        View all {category.name} <ArrowRight className="size-4" aria-hidden />
      </Link>
    </section>
  );
}
