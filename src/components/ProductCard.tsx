import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Star, Package } from "lucide-react";
import { formatLKR, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      {/* Product Image Area */}
      <div className="relative block aspect-square overflow-hidden bg-[#F6F7F9]">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          aria-label={product.name}
          className="flex size-full items-center justify-center p-2.5 sm:p-3.5"
        >
          {imgError || !product.image ? (
            <div className="flex size-full flex-col items-center justify-center rounded-xl bg-slate-100 text-slate-400 p-2 select-none">
              <Package className="size-9 sm:size-11 text-slate-400 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Lasertronics
              </span>
            </div>
          ) : (
            <img
              src={product.image}
              alt=""
              aria-hidden="true"
              width={800}
              height={800}
              loading="lazy"
              onError={() => setImgError(true)}
              className="size-full object-contain transition-transform duration-300 group-hover:scale-105 text-transparent select-none"
            />
          )}
        </Link>

        {product.badge && (
          <span className="pointer-events-none absolute left-2 top-2 sm:left-2.5 sm:top-2.5 z-10 rounded-full bg-[#0066FF] px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wide text-white shadow-xs">
            {product.badge}
          </span>
        )}
      </div>

      {/* Product Details Area */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3.5 md:p-4 bg-white">
        {/* Rating Line: Blue star + rating + reviews */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs">
          <Star className="size-3 sm:size-3.5 fill-[#0066FF] text-[#0066FF]" aria-hidden />
          <span className="font-bold text-slate-900">{product.rating.toFixed(1)}</span>
          <span className="text-slate-500">({product.reviews})</span>
        </div>

        {/* Title */}
        <h3 className="mt-1 sm:mt-1.5 line-clamp-2 text-xs sm:text-sm font-bold leading-tight sm:leading-snug tracking-tight text-slate-900 min-h-[2rem] sm:min-h-[2.5rem]">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-[#0066FF]"
          >
            {product.name}
          </Link>
        </h3>

        {/* Price & Actions */}
        <div className="mt-auto pt-2 sm:pt-3">
          <div className="flex flex-wrap items-baseline gap-1 sm:gap-2">
            <span className="font-extrabold text-xs sm:text-base text-slate-900">
              {formatLKR(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                {formatLKR(product.oldPrice)}
              </span>
            )}
          </div>

          <div className="mt-2.5 sm:mt-3 grid grid-cols-[minmax(0,1fr)_auto] gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                add(product.slug);
                navigate({ to: "/checkout" });
              }}
              className="h-9.5 sm:h-10 rounded-xl bg-[#0066FF] px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#0055d4] active:scale-[0.98] truncate"
            >
              Buy now
            </button>
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={() => add(product.slug)}
              className="grid size-9.5 sm:size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-50 active:scale-95 shrink-0"
            >
              <ShoppingCart className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
