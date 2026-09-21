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
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative block aspect-square overflow-hidden bg-muted">
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
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {product.badge && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground shadow-xs">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={() => setWished(!wished)}
          className={`absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-surface/90 backdrop-blur-xs transition-colors hover:bg-surface ${
            wished ? "text-primary" : "text-muted-foreground hover:text-primary"
          }`}
        >
          <Heart className={`size-4 ${wished ? "fill-primary" : ""}`} aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Star className="size-3.5 fill-amber-400 text-amber-400" aria-hidden />
          <span className="font-bold text-foreground">{product.rating.toFixed(1)}</span>
          <span>({product.reviews})</span>
        </div>

        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug">
          <Link
            to="/product/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </Link>
        </h3>

        <div className="mt-auto pt-3">
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
              className="min-h-10 rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground transition-all hover:bg-primary-dark hover:shadow-md active:scale-95"
            >
              Buy Now
            </button>
            <button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              onClick={() => add(product.slug)}
              className="grid size-10 place-items-center rounded-full border border-border bg-accent/40 text-foreground transition-all hover:border-primary hover:bg-accent hover:text-primary active:scale-95"
            >
              <ShoppingCart className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

