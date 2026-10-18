import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Lock, WifiOff, Package, PhoneCall, MapPin } from "lucide-react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { formatLKR } from "@/data/products";
import { useCart } from "@/lib/cart";
import { usePWA } from "@/hooks/usePWA";
import { createOrderFn } from "@/lib/catalog-store";

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
  { id: "name", label: "Full name", type: "text", autoComplete: "name", placeholder: "e.g. Kasun Perera" },
  { id: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "e.g. kasun@example.com" },
  { id: "phone", label: "Phone", type: "tel", autoComplete: "tel", placeholder: "e.g. 077 123 4567" },
  { id: "address", label: "Delivery address", type: "text", autoComplete: "street-address", placeholder: "e.g. No. 45, Galle Road" },
  { id: "city", label: "City", type: "text", autoComplete: "address-level2", placeholder: "e.g. Colombo 03" },
  { id: "postal", label: "Postal code", type: "text", autoComplete: "postal-code", placeholder: "e.g. 00300" },
];

function CheckoutPage() {
  const { isOnline } = usePWA();
  const { items, subtotal, shipping, total, clear } = useCart();
  const [placed, setPlaced] = useState(false);
  const [payment, setPayment] = useState<"cod" | "bank" | "card">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string>("");
  const [confirmedTotal, setConfirmedTotal] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const orderItems = items.map((it) => ({
        sku: (it.product as any).sku || it.product.slug,
        slug: it.product.slug,
        name: it.product.name,
        price: it.product.price,
        quantity: it.quantity,
        image: it.product.image,
      }));

      const res = await createOrderFn({
        data: {
          customer: formData,
          items: orderItems,
          subtotal,
          shipping,
          total,
          paymentMethod: payment,
        },
      });

      setConfirmedOrderId(res.id);
      setConfirmedTotal(total);
      clear();
      setPlaced(true);
      toast.success(`Order #${res.id} placed successfully!`);
    } catch (err: unknown) {
      console.error("Order submission error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placed) {
    return (
      <SiteLayout>
        <div className="container-page py-10 sm:py-16 text-center">
          <div className="glass-card mx-auto max-w-lg rounded-2xl sm:rounded-3xl border border-white/80 bg-white/75 p-6 sm:p-12 shadow-2xl backdrop-blur-2xl space-y-4">
            <div className="mx-auto grid size-14 sm:size-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
              <CheckCircle2 className="size-8 sm:size-9" />
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Order Confirmed!
              </h1>
              {confirmedOrderId && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-mono text-xs font-bold">
                  <Package className="size-3.5" /> Order ID: #{confirmedOrderId}
                </div>
              )}
            </div>

            <p className="mx-auto text-xs sm:text-sm leading-relaxed text-muted-foreground">
              Thank you, <strong>{formData.name || "Customer"}</strong>. Your order of <strong>{formatLKR(confirmedTotal)}</strong> has been registered in the system.
            </p>

            <div className="p-3.5 rounded-2xl bg-white/80 border border-slate-200/80 text-left text-xs space-y-2 text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <PhoneCall className="size-3.5 text-blue-600 shrink-0" />
                <span>We will call you on <strong>{formData.phone}</strong> to confirm dispatch.</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-blue-600 shrink-0" />
                <span>Delivery: {formData.address}, {formData.city}</span>
              </div>
            </div>

            <Link
              to="/shop"
              className="apple-btn-primary mt-6 inline-flex min-h-11 sm:min-h-12 items-center rounded-full px-7 sm:px-8 text-xs font-bold shadow-md text-center"
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
      <div className="container-page py-6 sm:py-10 lg:py-14">
        <h1 className="font-display text-xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Secure Checkout
        </h1>

        {items.length === 0 ? (
          <div className="glass-card mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl border border-white/80 bg-white/70 p-8 sm:p-12 text-center backdrop-blur-xl">
            <p className="text-sm font-semibold text-muted-foreground">There is nothing in your cart to checkout yet.</p>
            <Link
              to="/shop"
              className="apple-btn-primary mt-6 inline-flex min-h-11 sm:min-h-12 items-center rounded-full px-7 sm:px-8 text-xs font-bold shadow-md text-center"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6 sm:mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]"
          >
            <div className="space-y-5 sm:space-y-6">
              {/* Delivery Details Glass Card */}
              <section className="glass-card rounded-2xl sm:rounded-3xl border border-white/85 bg-white/80 p-4.5 sm:p-7 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.06),inset_0_1px_0_0_rgba(255,255,255,1)] backdrop-blur-2xl">
                <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  1. Delivery Details
                </h2>
                <div className="mt-4 sm:mt-5 grid gap-3.5 sm:gap-4 sm:grid-cols-2">
                  {fields.map((f) => (
                    <label key={f.id} className="block min-w-0">
                      <span className="text-xs font-bold text-foreground/80">{f.label}</span>
                      <input
                        required
                        type={f.type}
                        placeholder={f.placeholder}
                        value={formData[f.id as keyof typeof formData]}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, [f.id]: e.target.value }))
                        }
                        autoComplete={f.autoComplete}
                        className="glass-input mt-1.5 min-h-11 sm:min-h-12 w-full rounded-xl border border-white/80 bg-white/70 px-3.5 sm:px-4 text-xs sm:text-sm text-foreground shadow-xs outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </label>
                  ))}
                </div>
              </section>

              {/* Payment Method Glass Card */}
              <section className="glass-card rounded-2xl sm:rounded-3xl border border-white/85 bg-white/80 p-4.5 sm:p-7 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.06),inset_0_1px_0_0_rgba(255,255,255,1)] backdrop-blur-2xl">
                <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                  2. Payment Method
                </h2>
                <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-2.5">
                  {[
                    { id: "cod", label: "Cash on Delivery", note: "Pay the courier safely on doorstep arrival" },
                    { id: "bank", label: "Direct Bank Transfer", note: "Account details sent via email & SMS after order" },
                    { id: "card", label: "Card on Delivery (POS)", note: "Courier carries handheld wireless terminal" },
                  ].map((o) => (
                    <label
                      key={o.id}
                      className={`flex min-h-12 sm:min-h-14 cursor-pointer items-center gap-3 sm:gap-3.5 rounded-2xl border px-3.5 sm:px-4.5 py-2.5 sm:py-3 transition-all ${
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
                        className="size-4 shrink-0 accent-blue-600 text-blue-600"
                      />
                      <span className="min-w-0">
                        <span className="block text-xs sm:text-sm font-bold text-foreground">{o.label}</span>
                        <span className="block text-[11px] sm:text-xs text-muted-foreground leading-tight">{o.note}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* Apple Floating Glass Receipt Panel */}
            <aside className="h-fit rounded-2xl sm:rounded-3xl border border-white/85 bg-white/80 p-4.5 sm:p-6 shadow-[0_12px_40px_-6px_rgba(10,35,80,0.12),inset_0_1px_0_0_rgba(255,255,255,1)] backdrop-blur-2xl lg:sticky lg:top-28">
              <h2 className="text-xs font-extrabold uppercase tracking-[0.2em] text-primary">
                Order Summary
              </h2>
              <ul className="mt-3.5 sm:mt-4 space-y-3 sm:space-y-3.5 divide-y divide-slate-200/50">
                {items.map(({ product, qty }) => (
                  <li key={product.slug} className="flex gap-2.5 sm:gap-3 pt-3 sm:pt-3.5 first:pt-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      width={800}
                      height={800}
                      loading="lazy"
                      className="size-10 sm:size-12 shrink-0 rounded-xl object-cover ring-1 ring-black/5"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-xs font-bold text-foreground leading-snug">{product.name}</span>
                      <span className="block text-[10.5px] sm:text-[11px] text-muted-foreground font-medium">Qty: {qty}</span>
                    </span>
                    <span className="shrink-0 text-xs font-extrabold text-foreground">
                      {formatLKR(product.price * qty)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 sm:mt-5 space-y-2.5 sm:space-y-3 border-t border-slate-200/60 pt-3.5 sm:pt-4 text-xs sm:text-sm">
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
                <div className="flex justify-between border-t border-slate-200/60 pt-2.5 sm:pt-3 text-sm sm:text-base">
                  <dt className="font-bold text-foreground">Total</dt>
                  <dd className="font-display font-extrabold text-foreground">{formatLKR(total)}</dd>
                </div>
              </dl>

              {!isOnline && (
                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs flex items-start gap-2">
                  <WifiOff className="size-4 shrink-0 mt-0.5" />
                  <span>
                    You are currently offline. Please reconnect to submit and confirm your order with Colombo dispatch.
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={!isOnline}
                className={`mt-5 sm:mt-6 flex min-h-11 sm:min-h-12 w-full items-center justify-center gap-2 rounded-full text-xs sm:text-sm font-bold shadow-lg text-center transition-all ${
                  isOnline
                    ? "apple-btn-primary"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300 shadow-none"
                }`}
              >
                {isOnline ? (
                  <>
                    <Lock className="size-4" aria-hidden /> Confirm & Place Order
                  </>
                ) : (
                  <>
                    <WifiOff className="size-4" aria-hidden /> Connection Required to Order
                  </>
                )}
              </button>
              <p className="mt-3 text-center text-[10.5px] sm:text-[11px] text-muted-foreground">
                🔒 256-Bit Encrypted • Authentic Sri Lanka Store
              </p>
            </aside>
          </form>
        )}
      </div>
    </SiteLayout>
  );
}
