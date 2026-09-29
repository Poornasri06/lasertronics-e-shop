import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useState } from "react";
import { formatLKR, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const navigate = useNavigate();

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-md">
      {/* Product Image Area */}
      <div className="relative block aspect-square overflow-hidden bg-[#F6F7F9]">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="flex size-full items-center justify-center p-3"
        >
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            loading="lazy"
            className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-[#0066FF] px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-xs">
            {product.badge}
          </span>
        )}
      </div>

      {/* Product Details Area */}
      <div className="flex flex-1 flex-col p-3.5 sm:p-4 bg-white">
        {/* Rating Line: Blue star + rating + reviews */}
        <div className="flex items-center gap-1.5 text-xs">
          <Star className="size-3.5 fill-[#0066FF] text-[#0066FF]" aria-hidden />
          <span className="font-bold text-slate-900">{product.rating.toFixed(1)}</span>
          <span className="text-slate-500">({product.reviews})</span>
        </div>

        {/* Title */}
        <h3 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug tracking-tight text-slate-900">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-[#0066FF]"
          >
            {product.name}
          </Link>
        </h3>

        {/* Price & Actions */}
        <div className="mt-auto pt-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-extrabold text-base text-slate-900">
              {formatLKR(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-slate-400 line-through">
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
              className="h-10 rounded-xl bg-[#0066FF] px-3 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#0055d4] active:scale-[0.98]"
            >
              Buy now
            </button>
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={() => add(product.slug)}
              className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs transition-colors hover:bg-slate-50 active:scale-95"
            >
              <ShoppingCart className="size-4.5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

