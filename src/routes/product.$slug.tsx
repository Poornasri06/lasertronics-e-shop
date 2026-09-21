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
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="size-3" aria-hidden />
          {category && (
            <>
              <Link
                to="/category/$slug"
                params={{ slug: category.slug }}
                className="hover:text-primary transition-colors"
              >
                {category.name}
              </Link>
              <ChevronRight className="size-3" aria-hidden />
            </>
          )}
          <span className="truncate font-semibold text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="container-page grid gap-8 pb-16 lg:grid-cols-2 lg:gap-14">
        {/* Apple Showcase Frosted Image Frame */}
        <div className="relative overflow-hidden rounded-3xl border border-white/90 bg-white/75 p-3 shadow-[0_20px_50px_-10px_rgba(10,35,80,0.14),inset_0_1px_0_0_rgba(255,255,255,1)] backdrop-blur-2xl sm:p-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100/90 to-slate-200/60">
            <img
              src={product.image}
              alt={product.name}
              width={800}
              height={800}
              className="size-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        <div className="min-w-0 flex flex-col">
          <div className="flex flex-wrap items-center gap-2.5">
            {product.badge && (
              <span className="rounded-full border border-white/40 bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-md backdrop-blur-md">
                {product.badge}
              </span>
            )}
            <div className="flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-50/80 px-2.5 py-0.5 text-xs font-bold text-amber-900 shadow-xs backdrop-blur-sm">
              <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
              <span>{product.rating.toFixed(1)}</span>
              <span className="font-normal text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>

          <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.blurb}</p>

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              {formatLKR(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-base text-muted-foreground line-through">
                {formatLKR(product.oldPrice)}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            In stock — {product.stock} units available in Colombo
          </div>

          {/* iOS Tactile Quantity Selector */}
          <div className="mt-7 flex items-center gap-3.5">
            <div className="flex items-center rounded-full border border-white/80 bg-white/70 p-1 shadow-xs backdrop-blur-md">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-9.5 place-items-center rounded-full transition-colors hover:bg-white active:scale-90"
              >
                <Minus className="size-4" aria-hidden />
              </button>
              <span className="w-8 text-center text-sm font-bold text-foreground">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="grid size-9.5 place-items-center rounded-full transition-colors hover:bg-white active:scale-90"
              >
                <Plus className="size-4" aria-hidden />
              </button>
            </div>
            <span className="text-xs font-semibold text-muted-foreground">
              Subtotal: <strong className="text-foreground">{formatLKR(product.price * qty)}</strong>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                add(product.slug, qty);
                navigate({ to: "/checkout" });
              }}
              className="apple-btn-primary min-h-12 rounded-full px-7 text-sm font-bold shadow-lg"
            >
              Buy Now
            </button>
            <button
              type="button"
              onClick={() => add(product.slug, qty)}
              className="apple-btn-glass inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold text-foreground shadow-xs"
            >
              <ShoppingCart className="size-4.5" aria-hidden /> Add to Cart
            </button>
          </div>

          {/* Perks list as frosted chips */}
          <div className="mt-8 grid gap-2.5 rounded-2xl border border-white/70 bg-white/60 p-4 text-xs font-medium text-foreground/80 backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-2">
              <Truck className="size-4 text-primary" aria-hidden />
              <span>Island-wide delivery, free delivery over LKR 15,000</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" aria-hidden />
              <span>Genuine product with local Sri Lanka warranty support</span>
            </div>
            <div className="flex items-center gap-2">
              <Undo2 className="size-4 text-primary" aria-hidden />
              <span>7-day replacement guarantee on defective items</span>
            </div>
          </div>

          {/* iOS Settings Grouped Specs Card */}
          <div className="mt-8 overflow-hidden rounded-3xl border border-white/80 bg-white/75 p-6 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.06),inset_0_1px_0_0_rgba(255,255,255,0.95)] backdrop-blur-xl">
            <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
              Specifications
            </h2>
            <dl className="mt-4 divide-y divide-slate-200/60 text-xs sm:text-sm">
              {product.specs.map((s: { label: string; value: string }) => (
                <div key={s.label} className="grid grid-cols-2 gap-3 py-3">
                  <dt className="text-muted-foreground">{s.label}</dt>
                  <dd className="font-semibold text-foreground text-right sm:text-left">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-page pb-16">
          <div className="border-t border-white/80 pt-10">
            <h2 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl text-foreground">
              You May Also Like
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
