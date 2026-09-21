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
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[26px] apple-glass transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(0,113,227,0.15)] hover:border-white/90">
      {/* Specular glass reflection top accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-90" />

      <div className="relative block aspect-[4/3] sm:aspect-square overflow-hidden bg-gradient-to-b from-slate-100/60 to-slate-200/40 backdrop-blur-md">
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
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-108"
          />
        </Link>

        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full border border-white/50 bg-[#0071e3]/90 px-3 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-sm backdrop-blur-md">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => setWished(!wished)}
          className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-white/80 bg-white/80 backdrop-blur-md shadow-xs transition-all hover:bg-white hover:scale-105 active:scale-90 ${
            wished ? "text-[#ff3b30]" : "text-muted-foreground hover:text-[#0071e3]"
          }`}
        >
          <Heart className={`size-4 ${wished ? "fill-[#ff3b30] text-[#ff3b30]" : ""}`} aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1 rounded-full border border-amber-300/40 bg-amber-50/80 px-2 py-0.5">
            <Star className="size-3 fill-amber-400 text-amber-400" aria-hidden />
            <span className="font-bold text-amber-900">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground/80">({product.reviews} reviews)</span>
        </div>

        <h3 className="mt-2.5 line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-[#1d1d1f]">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-[#0071e3]"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-lg font-bold tracking-tight text-[#0071e3]">
              {formatLKR(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatLKR(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="mt-3.5 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            <button
              type="button"
              onClick={() => {
                add(product.slug);
                navigate({ to: "/checkout" });
              }}
              className="apple-pill-primary min-h-10 text-xs font-semibold shadow-sm tracking-wide"
            >
              Buy Now
            </button>
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={() => add(product.slug)}
              className="grid size-10 place-items-center rounded-full border border-white/80 bg-white/70 text-[#1d1d1f] backdrop-blur-md shadow-xs transition-all hover:border-[#0071e3] hover:bg-[#0071e3] hover:text-white active:scale-95"
            >
              <ShoppingCart className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

