import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock } from "lucide-react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { formatLKR } from "@/data/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Lasertronics" },
      { name: "description", content: "Complete your Lasertronics order with island-wide delivery across Sri Lanka." },
      { property: "og:title", content: "Checkout | Lasertronics" },
      { property: "og:description", content: "Secure checkout for your Lasertronics order." },
    ],
  }),
  component: CheckoutPage,
});

const fields = [
  { id: "name", label: "Full name", type: "text", autoComplete: "name" },
  { id: "email", label: "Email", type: "email", autoComplete: "email" },
  { id: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { id: "address", label: "Delivery address", type: "text", autoComplete: "street-address" },
  { id: "city", label: "City", type: "text", autoComplete: "address-level2" },
  { id: "postal", label: "Postal code", type: "text", autoComplete: "postal-code" },
];

function CheckoutPage() {
  const { items, subtotal, shipping, total, clear } = useCart();
  const [placed, setPlaced] = useState(false);
  const [payment, setPayment] = useState("cod");

  if (placed) {
    return (
      <SiteLayout>
        <div className="container-page py-20 text-center">
          <CheckCircle2 className="mx-auto size-14 text-primary" aria-hidden />
          <h1 className="mt-5 text-2xl font-extrabold sm:text-3xl">Order confirmed</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Thank you. Our team will call you on the number you provided to confirm delivery within
            one working day.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
          >
            Continue shopping
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container-page py-10 lg:py-14">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Checkout</h1>

        {items.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-surface p-10 text-center">
            <p className="text-sm text-muted-foreground">There is nothing to check out yet.</p>
            <Link
              to="/shop"
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              clear();
              setPlaced(true);
            }}
            className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]"
          >
            <div className="space-y-6">
              <section className="rounded-2xl border border-border bg-surface p-5">
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Delivery details
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {fields.map((f) => (
                    <label key={f.id} className="block min-w-0">
                      <span className="text-xs font-semibold text-muted-foreground">{f.label}</span>
                      <input
                        required
                        type={f.type}
                        autoComplete={f.autoComplete}
                        className="mt-1.5 min-h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none focus:border-primary"
                      />
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-surface p-5">
                <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Payment method
                </h2>
                <div className="mt-4 space-y-2">
                  {[
                    { id: "cod", label: "Cash on delivery", note: "Pay the courier on arrival" },
                    { id: "bank", label: "Bank transfer", note: "Details emailed after ordering" },
                    { id: "card", label: "Card on delivery", note: "Portable POS terminal" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-4 transition-colors ${
                        payment === o.id ? "border-primary bg-accent" : "border-border"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={o.id}
                        checked={payment === o.id}
                        onChange={() => setPayment(o.id)}
                        className="size-4 accent-current text-primary"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{o.label}</span>
                        <span className="block text-xs text-muted-foreground">{o.note}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-28">
              <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Order summary
              </h2>
              <ul className="mt-4 space-y-3">
                {items.map(({ product, qty }) => (
                  <li key={product.slug} className="flex gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      width={800}
                      height={800}
                      loading="lazy"
                      className="size-12 shrink-0 rounded-md object-cover"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-xs font-semibold">{product.name}</span>
                      <span className="block text-xs text-muted-foreground">Qty {qty}</span>
                    </span>
                    <span className="shrink-0 text-xs font-bold">
                      {formatLKR(product.price * qty)}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 space-y-2.5 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-semibold">{formatLKR(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="font-semibold">{shipping === 0 ? "Free" : formatLKR(shipping)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base">
                  <dt className="font-bold">Total</dt>
                  <dd className="font-display font-extrabold">{formatLKR(total)}</dd>
                </div>
              </dl>
              <button
                type="submit"
                className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary-dark"
              >
                <Lock className="size-4" aria-hidden /> Place order
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                Prototype checkout — no real payment is taken.
              </p>
            </aside>
          </form>
        )}
      </div>
    </SiteLayout>
  );
}
