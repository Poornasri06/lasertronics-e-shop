import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { formatLKR } from "@/data/products";
import { useCart, FREE_SHIPPING_THRESHOLD } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Lasertronics" },
      { name: "description", content: "Review the electronics in your Lasertronics cart before checkout." },
      { property: "og:title", content: "Your Cart | Lasertronics" },
      { property: "og:description", content: "Review your Lasertronics order before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, subtotal, shipping, total, setQty, remove } = useCart();

  return (
    <SiteLayout>
      <div className="container-page py-10 lg:py-14">
        <div className="flex items-center justify-between border-b border-white/80 pb-4">
          <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
            Shopping Cart
          </h1>
          <span className="text-xs font-semibold text-muted-foreground">
            {items.length} unique item{items.length === 1 ? "" : "s"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="glass-card mt-10 rounded-3xl border border-white/80 bg-white/70 p-12 text-center backdrop-blur-xl">
            <div className="mx-auto grid size-16 place-items-center rounded-full border border-white/80 bg-white/80 shadow-sm">
              <ShoppingBag className="size-8 text-primary" aria-hidden />
            </div>
            <h2 className="mt-4 font-display text-lg font-bold text-foreground">Your cart is currently empty</h2>
            <p className="mt-1 text-xs text-muted-foreground">Browse our electronics collection and find what you need.</p>
            <Link
              to="/shop"
              className="apple-btn-primary mt-6 inline-flex min-h-12 items-center rounded-full px-8 text-xs font-bold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <ul className="space-y-3.5">
              {items.map(({ product, qty }) => (
                <li
                  key={product.slug}
                  className="glass-card group relative grid grid-cols-[5rem_minmax(0,1fr)] gap-4 rounded-2xl border border-white/80 bg-white/75 p-4 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.05)] backdrop-blur-xl transition-all hover:bg-white/88 sm:grid-cols-[6rem_minmax(0,1fr)_auto]"
                >
                  <Link to="/product/$slug" params={{ slug: product.slug }} className="shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      width={800}
                      height={800}
                      loading="lazy"
                      className="aspect-square w-full rounded-xl object-cover ring-1 ring-black/5"
                    />
                  </Link>
                  <div className="min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        to="/product/$slug"
                        params={{ slug: product.slug }}
                        className="line-clamp-2 text-sm font-bold text-foreground transition-colors hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="mt-1 text-sm font-semibold text-primary">{formatLKR(product.price)}</p>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-white/80 bg-white/70 p-0.5 shadow-xs backdrop-blur-md">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(product.slug, qty - 1)}
                          className="grid size-8 place-items-center rounded-full text-foreground transition-colors hover:bg-white active:scale-90"
                        >
                          <Minus className="size-3.5" aria-hidden />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-foreground">{qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQty(product.slug, qty + 1)}
                          className="grid size-8 place-items-center rounded-full text-foreground transition-colors hover:bg-white active:scale-90"
                        >
                          <Plus className="size-3.5" aria-hidden />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(product.slug)}
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" aria-hidden /> Remove
                      </button>
                    </div>
                  </div>
                  <p className="hidden self-center text-right font-display text-base font-extrabold text-foreground sm:block">
                    {formatLKR(product.price * qty)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Apple Floating Glass Summary Panel */}
            <aside className="h-fit rounded-3xl border border-white/85 bg-white/80 p-6 shadow-[0_12px_40px_-6px_rgba(10,35,80,0.12),inset_0_1px_0_0_rgba(255,255,255,1)] backdrop-blur-2xl lg:sticky lg:top-28">
              <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Order Summary
              </h2>
              <dl className="mt-5 space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <dt>Subtotal</dt>
                  <dd className="font-semibold text-foreground">{formatLKR(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <dt>Island-Wide Delivery</dt>
                  <dd className="font-semibold text-foreground">
                    {shipping === 0 ? (
                      <span className="font-bold text-emerald-600">FREE</span>
                    ) : (
                      formatLKR(shipping)
                    )}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-slate-200/60 pt-3.5 text-base">
                  <dt className="font-bold text-foreground">Total</dt>
                  <dd className="font-display font-extrabold text-foreground">{formatLKR(total)}</dd>
                </div>
              </dl>
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="mt-4 rounded-xl border border-blue-200/50 bg-blue-50/70 p-3 text-xs text-blue-900 backdrop-blur-sm">
                  Add <strong>{formatLKR(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> more for FREE delivery.
                </div>
              )}
              <Link
                to="/checkout"
                className="apple-btn-primary mt-6 flex min-h-12 w-full items-center justify-center rounded-full text-sm font-bold shadow-lg"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/shop"
                className="apple-btn-glass mt-2.5 flex min-h-11 w-full items-center justify-center rounded-full text-xs font-bold text-foreground"
              >
                Continue Shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
