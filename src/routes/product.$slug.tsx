import { useState } from "react";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ChevronRight, Minus, Plus, ShoppingCart, Star, Truck, ShieldCheck, Undo2 } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ProductCard } from "@/components/ProductCard";
import { formatLKR, getCategory, getProduct, relatedProducts } from "@/data/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} | Lasertronics` : "Product | Lasertronics";
    const desc = p?.blurb ?? "Shop genuine electronics at Lasertronics Sri Lanka.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const category = getCategory(product.category);
  const related = relatedProducts(product);
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  return (
    <SiteLayout>
      <div className="container-page py-6">
        <nav className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <ChevronRight className="size-3" aria-hidden />
          {category && (
            <>
              <Link
                to="/category/$slug"
                params={{ slug: category.slug }}
                className="hover:text-primary"
              >
                {category.name}
              </Link>
              <ChevronRight className="size-3" aria-hidden />
            </>
          )}
          <span className="truncate text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="container-page grid gap-8 pb-12 lg:grid-cols-2 lg:gap-14">
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {product.badge && (
              <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                {product.badge}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-primary text-primary" aria-hidden />
              <strong className="text-foreground">{product.rating.toFixed(1)}</strong> (
              {product.reviews} reviews)
            </span>
          </div>

          <h1 className="mt-3 text-2xl font-extrabold leading-snug sm:text-3xl">{product.name}</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.blurb}</p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl font-extrabold">{formatLKR(product.price)}</span>
            {product.oldPrice && (
              <span className="text-base text-muted-foreground line-through">
                {formatLKR(product.oldPrice)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs font-semibold text-primary">
            In stock — {product.stock} units available
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-11 place-items-center rounded-full text-foreground hover:text-primary"
              >
                <Minus className="size-4" aria-hidden />
              </button>
              <span className="w-8 text-center text-sm font-bold">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="grid size-11 place-items-center rounded-full text-foreground hover:text-primary"
              >
                <Plus className="size-4" aria-hidden />
              </button>
            </div>
            <span className="text-xs text-muted-foreground">
              Subtotal {formatLKR(product.price * qty)}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                add(product.slug, qty);
                navigate({ to: "/checkout" });
              }}
              className="min-h-12 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-dark"
            >
              Buy now
            </button>
            <button
              type="button"
              onClick={() => add(product.slug, qty)}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-bold transition-colors hover:border-primary hover:text-primary"
            >
              <ShoppingCart className="size-4" aria-hidden /> Add to cart
            </button>
          </div>

          <ul className="mt-6 grid gap-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <Truck className="size-4 text-primary" aria-hidden /> Island-wide delivery, free over
              LKR 15,000
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" aria-hidden /> Genuine product with local
              warranty
            </li>
            <li className="flex items-center gap-2">
              <Undo2 className="size-4 text-primary" aria-hidden /> 7-day replacement on DOA items
            </li>
          </ul>

          <div className="mt-8 rounded-xl border border-border bg-surface p-5">
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Specifications
            </h2>
            <dl className="mt-3 divide-y divide-border text-sm">
              {product.specs.map((s: { label: string; value: string }) => (
                <div key={s.label} className="grid grid-cols-2 gap-3 py-2.5">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-page pb-16">
          <h2 className="text-xl font-extrabold sm:text-2xl">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
