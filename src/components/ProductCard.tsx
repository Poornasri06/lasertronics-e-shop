import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Star, Package, Heart, Check } from "lucide-react";
import { formatLKR, getCategory, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const category = getCategory(product.category);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product.slug);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discountPercent =
    product.oldPrice && product.oldPrice > product.price
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : null;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:shadow-xl hover:border-blue-400/50 hover:-translate-y-1">
      {/* Product Image Area */}
      <div className="relative block aspect-square overflow-hidden bg-slate-50/70 p-3 sm:p-4">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="flex size-full items-center justify-center"
        >
          {imgError || !product.image ? (
            <div className="flex size-full flex-col items-center justify-center rounded-xl bg-slate-100 text-slate-400 p-2 select-none">
              <Package className="size-10 sm:size-12 text-slate-400 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Lasertronics
              </span>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              width={600}
              height={600}
              loading="lazy"
              onError={() => setImgError(true)}
              className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </Link>

        {/* Promotional / Status Badge */}
        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-blue-600 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-white shadow-xs pointer-events-none">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="Save to Wishlist"
          className={`absolute right-2.5 top-2.5 grid size-7 sm:size-8 place-items-center rounded-full border transition-all ${
            isWishlisted
              ? "border-rose-300 bg-rose-50 text-rose-500"
              : "border-slate-200 bg-white/90 text-slate-400 hover:text-rose-500 hover:border-rose-200 shadow-xs opacity-0 group-hover:opacity-100 sm:opacity-100"
          }`}
        >
          <Heart className={`size-3.5 sm:size-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
        </button>

        {/* Discount Tag */}
        {discountPercent && (
          <span className="absolute right-2.5 bottom-2.5 rounded-md bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[9.5px] font-extrabold text-rose-600 pointer-events-none">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Product Details Area */}
      <div className="flex flex-1 flex-col p-3 sm:p-4 bg-white">
        {/* Category Label */}
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
          {category?.name || product.category}
        </span>

        {/* Title (Standardized 2-line height) */}
        <h3 className="mt-1 line-clamp-2 text-xs sm:text-sm font-bold leading-snug tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors min-h-[2.5rem]">
          <Link to="/product/$slug" params={{ slug: product.slug }}>
            {product.name}
          </Link>
        </h3>

        {/* Rating Line */}
        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
            <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">({product.reviews})</span>
          <span className="mx-1 text-slate-300">•</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
            In Stock
          </span>
        </div>

        {/* Pricing Hierarchy */}
        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-extrabold font-display text-sm sm:text-base text-slate-950">
              {formatLKR(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-[11px] sm:text-xs text-slate-400 line-through">
                {formatLKR(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-2.5 grid grid-cols-[1fr_auto] gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`h-9 sm:h-9.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white active:scale-95"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="size-3.5 stroke-[3]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="size-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                add(product.slug);
                navigate({ to: "/checkout" });
              }}
              className="h-9 sm:h-9.5 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              title="Buy Now"
            >
              Buy
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
