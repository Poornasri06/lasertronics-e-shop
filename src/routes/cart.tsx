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
      <div className="container-page py-6 sm:py-10 lg:py-14">
        <div className="flex items-center justify-between border-b border-white/80 pb-3 sm:pb-4">
          <h1 className="font-display text-xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Shopping Cart
          </h1>
          <span className="text-xs font-semibold text-muted-foreground">
            {items.length} unique item{items.length === 1 ? "" : "s"}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="glass-card mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl border border-white/80 bg-white/70 p-8 sm:p-12 text-center backdrop-blur-xl">
            <div className="mx-auto grid size-14 sm:size-16 place-items-center rounded-full border border-white/80 bg-white/80 shadow-sm">
              <ShoppingBag className="size-7 sm:size-8 text-primary" aria-hidden />
            </div>
            <h2 className="mt-4 font-display text-base sm:text-lg font-bold text-foreground">Your cart is currently empty</h2>
            <p className="mt-1 text-xs text-muted-foreground">Browse our electronics collection and find what you need.</p>
            <Link
              to="/shop"
              className="apple-btn-primary mt-6 inline-flex min-h-11 sm:min-h-12 items-center rounded-full px-7 sm:px-8 text-xs font-bold"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-6 sm:mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <ul className="space-y-3 sm:space-y-3.5">
              {items.map(({ product, qty }) => (
                <li
                  key={product.slug}
                  className="glass-card group relative grid grid-cols-[4.5rem_minmax(0,1fr)] xs:grid-cols-[5.5rem_minmax(0,1fr)] sm:grid-cols-[6rem_minmax(0,1fr)_auto] gap-3 sm:gap-4 rounded-2xl border border-white/80 bg-white/75 p-3 sm:p-4 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.05)] backdrop-blur-xl transition-all hover:bg-white/88"
                >
                  <Link to="/product/$slug" params={{ slug: product.slug }} className="shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      width={800}
                      height={800}
                      loading="lazy"
                      className="aspect-square size-full rounded-xl object-cover ring-1 ring-black/5"
                    />
                  </Link>
                  <div className="min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        to="/product/$slug"
                        params={{ slug: product.slug }}
                        className="line-clamp-2 text-xs sm:text-sm font-bold text-foreground transition-colors hover:text-primary leading-snug"
                      >
                        {product.name}
                      </Link>
                      <div className="mt-1 flex items-baseline justify-between sm:justify-start gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-primary">{formatLKR(product.price)}</span>
                        <span className="text-[11px] text-muted-foreground font-medium sm:hidden">
                          Total: <strong className="text-foreground">{formatLKR(product.price * qty)}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
                      <div className="flex items-center rounded-full border border-white/80 bg-white/70 p-0.5 shadow-xs backdrop-blur-md">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(product.slug, qty - 1)}
                          className="grid size-7 sm:size-8 place-items-center rounded-full text-foreground transition-colors hover:bg-white active:scale-90"
                        >
                          <Minus className="size-3 sm:size-3.5" aria-hidden />
                        </button>
                        <span className="w-6 sm:w-7 text-center text-xs font-bold text-foreground">{qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQty(product.slug, qty + 1)}
                          className="grid size-7 sm:size-8 place-items-center rounded-full text-foreground transition-colors hover:bg-white active:scale-90"
                        >
                          <Plus className="size-3 sm:size-3.5" aria-hidden />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(product.slug)}
                        className="inline-flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs font-medium text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="size-3 sm:size-3.5" aria-hidden /> Remove
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
            <aside className="h-fit rounded-2xl sm:rounded-3xl border border-white/85 bg-white/80 p-4.5 sm:p-6 shadow-[0_12px_40px_-6px_rgba(10,35,80,0.12),inset_0_1px_0_0_rgba(255,255,255,1)] backdrop-blur-2xl lg:sticky lg:top-28">
              <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Order Summary
              </h2>
              <dl className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3 text-xs sm:text-sm">
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
                <div className="flex justify-between border-t border-slate-200/60 pt-3 text-sm sm:text-base">
                  <dt className="font-bold text-foreground">Total</dt>
                  <dd className="font-display font-extrabold text-foreground">{formatLKR(total)}</dd>
                </div>
              </dl>
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <div className="mt-3.5 sm:mt-4 rounded-xl border border-blue-200/50 bg-blue-50/70 p-2.5 sm:p-3 text-xs text-blue-900 backdrop-blur-sm">
                  Add <strong>{formatLKR(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> more for FREE delivery.
                </div>
              )}
              <Link
                to="/checkout"
                className="apple-btn-primary mt-5 sm:mt-6 flex min-h-11 sm:min-h-12 w-full items-center justify-center rounded-full text-xs sm:text-sm font-bold shadow-lg text-center"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/shop"
                className="apple-btn-glass mt-2.5 flex min-h-10 sm:min-h-11 w-full items-center justify-center rounded-full text-xs font-bold text-foreground text-center"
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
