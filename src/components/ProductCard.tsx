import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useState } from "react";
import { formatLKR, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const [wished, setWished] = useState(false);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/75 shadow-[0_4px_20px_-2px_rgba(12,32,68,0.06),inset_0_1px_0_0_rgba(255,255,255,0.95)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400/40 hover:bg-white/88 hover:shadow-[0_16px_36px_-6px_rgba(8,70,150,0.14),inset_0_1px_0_0_rgba(255,255,255,1)]">
      {/* Specular glass highlight reflection at top edge */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />

      <div className="relative block aspect-square overflow-hidden bg-gradient-to-b from-slate-100/80 to-slate-200/50 backdrop-blur-md">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="block size-full"
        >
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-106"
          />
        </Link>

        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full border border-white/40 bg-gradient-to-r from-blue-600 to-indigo-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-md backdrop-blur-md">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => setWished(!wished)}
          className={`absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full border border-white/80 bg-white/75 backdrop-blur-md shadow-sm transition-all hover:bg-white hover:scale-105 active:scale-90 ${
            wished ? "text-[#ff3b30]" : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Heart className={`size-4 ${wished ? "fill-[#ff3b30] text-[#ff3b30]" : ""}`} aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-50/80 px-2 py-0.5">
            <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden />
            <span className="font-bold text-amber-900">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground">({product.reviews})</span>
        </div>

        <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-foreground/90">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto pt-3.5">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-base font-bold text-foreground">
              {formatLKR(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatLKR(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            <button
              type="button"
              onClick={() => {
                add(product.slug);
                navigate({ to: "/checkout" });
              }}
              className="apple-btn-primary min-h-10 rounded-full px-3 text-xs font-bold"
            >
              Buy Now
            </button>
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={() => add(product.slug)}
              className="grid size-10 place-items-center rounded-full border border-white/80 bg-white/70 text-foreground backdrop-blur-md shadow-xs transition-all hover:border-primary hover:bg-primary hover:text-white active:scale-90"
            >
              <ShoppingCart className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

