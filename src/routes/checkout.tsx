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
          <div className="glass-card mx-auto max-w-lg rounded-3xl border border-white/80 bg-white/80 p-10 shadow-xl backdrop-blur-2xl">
            <div className="mx-auto grid size-16 place-items-center rounded-full border border-emerald-300/50 bg-emerald-50 text-emerald-600 shadow-sm">
              <CheckCircle2 className="size-8" aria-hidden />
            </div>
            <h1 className="mt-5 font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
              Order Confirmed
            </h1>
            <p className="mx-auto mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Thank you. Our team will call you on the number provided to verify your order and dispatch from Colombo within 24 hours.
            </p>
            <Link
              to="/shop"
              className="apple-btn-primary mt-7 inline-flex min-h-12 items-center rounded-full px-8 text-xs font-bold shadow-md"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container-page py-10 lg:py-14">
        <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl text-foreground">
          Secure Checkout
        </h1>

        {items.length === 0 ? (
          <div className="glass-card mt-10 rounded-3xl border border-white/80 bg-white/70 p-12 text-center backdrop-blur-xl">
            <p className="text-sm font-semibold text-muted-foreground">There is nothing in your cart to checkout yet.</p>
            <Link
              to="/shop"
              className="apple-btn-primary mt-6 inline-flex min-h-12 items-center rounded-full px-8 text-xs font-bold shadow-md"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              clear();
              setPlaced(true);
            }}
            className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]"
          >
            <div className="space-y-6">
              {/* Delivery Details Glass Card */}
              <section className="glass-card rounded-3xl border border-white/85 bg-white/80 p-6 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.06),inset_0_1px_0_0_rgba(255,255,255,1)] backdrop-blur-2xl sm:p-7">
                <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  1. Delivery Details
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {fields.map((f) => (
                    <label key={f.id} className="block min-w-0">
                      <span className="text-xs font-bold text-foreground/80">{f.label}</span>
                      <input
                        required
                        type={f.type}
                        autoComplete={f.autoComplete}
                        className="glass-input mt-1.5 min-h-12 w-full rounded-xl border border-white/80 bg-white/70 px-4 text-sm text-foreground shadow-xs outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </label>
                  ))}
                </div>
              </section>

              {/* Payment Method Glass Card */}
              <section className="glass-card rounded-3xl border border-white/85 bg-white/80 p-6 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.06),inset_0_1px_0_0_rgba(255,255,255,1)] backdrop-blur-2xl sm:p-7">
                <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  2. Payment Method
                </h2>
                <div className="mt-5 space-y-2.5">
                  {[
                    { id: "cod", label: "Cash on Delivery", note: "Pay the courier safely on doorstep arrival" },
                    { id: "bank", label: "Direct Bank Transfer", note: "Account details sent via email & SMS after order" },
                    { id: "card", label: "Card on Delivery (POS)", note: "Courier carries handheld wireless terminal" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`flex min-h-14 cursor-pointer items-center gap-3.5 rounded-2xl border px-4.5 py-3 transition-all ${
                        payment === o.id
                          ? "border-blue-500/80 bg-blue-50/70 shadow-[0_2px_12px_rgba(8,120,209,0.12)]"
                          : "border-white/80 bg-white/60 hover:bg-white/90"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={o.id}
                        checked={payment === o.id}
                        onChange={() => setPayment(o.id)}
                        className="size-4 accent-blue-600 text-blue-600"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-foreground">{o.label}</span>
                        <span className="block text-xs text-muted-foreground">{o.note}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* Apple Floating Glass Receipt Panel */}
            <aside className="h-fit rounded-3xl border border-white/85 bg-white/80 p-6 shadow-[0_12px_40px_-6px_rgba(10,35,80,0.12),inset_0_1px_0_0_rgba(255,255,255,1)] backdrop-blur-2xl lg:sticky lg:top-28">
              <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Order Summary
              </h2>
              <ul className="mt-4 space-y-3.5 divide-y divide-slate-200/50">
                {items.map(({ product, qty }) => (
                  <li key={product.slug} className="flex gap-3 pt-3.5 first:pt-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      width={800}
                      height={800}
                      loading="lazy"
                      className="size-12 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-xs font-bold text-foreground">{product.name}</span>
                      <span className="block text-[11px] text-muted-foreground font-medium">Qty: {qty}</span>
                    </span>
                    <span className="shrink-0 text-xs font-extrabold text-foreground">
                      {formatLKR(product.price * qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-5 space-y-3 border-t border-slate-200/60 pt-4 text-xs sm:text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <dt>Subtotal</dt>
                  <dd className="font-semibold text-foreground">{formatLKR(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <dt>Island-Wide Delivery</dt>
                  <dd className="font-semibold text-foreground">
                    {shipping === 0 ? <span className="font-bold text-emerald-600">FREE</span> : formatLKR(shipping)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-slate-200/60 pt-3 text-base">
                  <dt className="font-bold text-foreground">Total</dt>
                  <dd className="font-display font-extrabold text-foreground">{formatLKR(total)}</dd>
                </div>
              </dl>

              <button
                type="submit"
                className="apple-btn-primary mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-bold shadow-lg"
              >
                <Lock className="size-4" aria-hidden /> Confirm & Place Order
              </button>
              <p className="mt-3 text-center text-[11px] text-muted-foreground">
                🔒 256-Bit Encrypted · Authentic Sri Lanka Store
              </p>
            </aside>
          </form>
        )}
      </div>
    </SiteLayout>
  );
}
