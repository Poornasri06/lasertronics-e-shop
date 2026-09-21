import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Star, Heart, Check } from "lucide-react";
import { useState } from "react";
import { formatLKR, type Product } from "@/data/products";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const navigate = useNavigate();
  const [wished, setWished] = useState(false);
  const [addedAnim, setAddedAnim] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product.slug);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product.slug);
    navigate({ to: "/checkout" });
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-black/8 bg-white/90 shadow-card backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#0878D1]/40 hover:shadow-lift">
      {/* Product Image Stage with generous whitespace */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F6F9FC] p-4">
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="flex size-full items-center justify-center"
        >
          <img
            src={product.image}
            alt={product.name}
            width={700}
            height={700}
            loading="lazy"
            className="size-full object-contain mix-blend-multiply transition-transform duration-300 ease-out group-hover:scale-106"
          />
        </Link>

        {/* Product Badge */}
        {product.badge && (
          <span className="absolute left-3.5 top-3.5 rounded-full bg-[#0878D1] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setWished(!wished);
          }}
          className={`absolute right-3.5 top-3.5 grid size-8.5 place-items-center rounded-full border border-black/5 bg-white/85 shadow-xs backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-95 ${
            wished ? "text-[#0878D1]" : "text-[#667085] hover:text-[#0878D1]"
          }`}
        >
          <Heart className={`size-4 ${wished ? "fill-[#0878D1]" : ""}`} aria-hidden />
        </button>
      </div>

      {/* Card Content with Apple-style spacing */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 text-xs text-[#667085]">
          <div className="flex items-center text-amber-400">
            <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
          </div>
          <span className="font-bold text-[#111827]">{product.rating.toFixed(1)}</span>
          <span className="text-[11px] text-[#667085]">({product.reviews})</span>
        </div>

        {/* Product Title */}
        <h3 className="mt-2 line-clamp-2 text-sm font-bold leading-snug text-[#111827]">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-[#0878D1]"
          >
            {product.name}
          </Link>
        </h3>

        {/* Price and CTAs */}
        <div className="mt-auto pt-4">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-display text-base font-extrabold text-[#111827]">
              {formatLKR(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-[#667085] line-through">
                {formatLKR(product.oldPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons: Buy Now & Add to Cart */}
          <div className="mt-3.5 grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            {/* Buy Now (Primary Blue Pill - Direct to Checkout) */}
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex min-h-10 items-center justify-center rounded-full bg-[#0878D1] px-4 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:bg-[#0662ab] hover:shadow-md active:scale-97"
            >
              Buy Now
            </button>

            {/* Add to Cart Button */}
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={handleAddToCart}
              className={`grid size-10 place-items-center rounded-full border transition-all duration-200 active:scale-95 ${
                addedAnim
                  ? "border-[#0878D1] bg-[#0878D1] text-white"
                  : "border-black/10 bg-[#0878D1]/8 text-[#0878D1] hover:border-[#0878D1] hover:bg-[#0878D1] hover:text-white"
              }`}
            >
              {addedAnim ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
