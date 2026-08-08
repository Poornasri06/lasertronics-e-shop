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
        <h1 className="text-2xl font-extrabold sm:text-3xl">Your cart</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-surface p-10 text-center">
            <ShoppingBag className="mx-auto size-10 text-muted-foreground" aria-hidden />
            <p className="mt-4 text-sm text-muted-foreground">Your cart is empty.</p>
            <Link
              to="/shop"
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <ul className="space-y-3">
              {items.map(({ product, qty }) => (
                <li
                  key={product.slug}
                  className="grid grid-cols-[5rem_minmax(0,1fr)] gap-4 rounded-xl border border-border bg-surface p-3 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:p-4"
                >
                  <Link to="/product/$slug" params={{ slug: product.slug }} className="shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      width={800}
                      height={800}
                      loading="lazy"
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                  </Link>
                  <div className="min-w-0">
                    <Link
                      to="/product/$slug"
                      params={{ slug: product.slug }}
                      className="line-clamp-2 text-sm font-semibold hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm font-bold">{formatLKR(product.price)}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() => setQty(product.slug, qty - 1)}
                          className="grid size-9 place-items-center rounded-full hover:text-primary"
                        >
                          <Minus className="size-3.5" aria-hidden />
                        </button>
                        <span className="w-7 text-center text-sm font-bold">{qty}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() => setQty(product.slug, qty + 1)}
                          className="grid size-9 place-items-center rounded-full hover:text-primary"
                        >
                          <Plus className="size-3.5" aria-hidden />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(product.slug)}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="size-3.5" aria-hidden /> Remove
                      </button>
                    </div>
                  </div>
                  <p className="hidden self-center text-right font-display text-base font-bold sm:block">
                    {formatLKR(product.price * qty)}
                  </p>
                </li>
              ))}
            </ul>

            <aside className="h-fit rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-28">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Order summary
              </h2>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold">{formatLKR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="font-semibold">
                    {shipping === 0 ? "Free" : formatLKR(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt className="font-bold">Total</dt>
                  <dd className="font-display font-extrabold">{formatLKR(total)}</dd>
                </div>
              </dl>
              {subtotal < FREE_SHIPPING_THRESHOLD && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Add {formatLKR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free delivery.
                </p>
              )}
              <Link
                to="/checkout"
                className="mt-5 flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
              >
                Proceed to checkout
              </Link>
              <Link
                to="/shop"
                className="mt-2 flex min-h-11 items-center justify-center text-xs font-semibold text-muted-foreground hover:text-primary"
              >
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
