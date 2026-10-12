import React, { useState } from "react";
import { Package, Cpu, Wrench, Smartphone, Tv, Image as ImageIcon } from "lucide-react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  category?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

function getCategoryIcon(category?: string) {
  switch (category) {
    case "mobile-accessories":
      return Smartphone;
    case "tv-accessories":
      return Tv;
    case "iot-and-microcontrollers":
      return Cpu;
    case "repair-kits":
      return Wrench;
    case "electronics":
    default:
      return Package;
  }
}

export function ProductImage({
  src,
  alt,
  category,
  className = "",
  size = "md",
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const Icon = getCategoryIcon(category);

  const sizeClasses = {
    sm: "size-10 text-xs",
    md: "size-14 text-sm",
    lg: "size-20 text-base",
    xl: "size-32 text-lg",
  }[size];

  const hasValidImage = Boolean(src && src.trim() !== "" && !hasError);

  if (!hasValidImage) {
    return (
      <div
        className={`relative inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-slate-100 text-slate-500 shadow-inner overflow-hidden select-none ${sizeClasses} ${className}`}
        title={`No image available for ${alt}`}
      >
        <div className="flex flex-col items-center justify-center p-1 text-center">
          <Icon className="size-1/2 text-slate-400 mb-0.5" />
          <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
            No Image
          </span>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:8px_8px] opacity-40 pointer-events-none" />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white shadow-xs overflow-hidden ${sizeClasses} ${className}`}
    >
      <img
        src={src as string}
        alt={alt}
        loading="lazy"
        onError={() => setHasError(true)}
        className="size-full object-cover object-center transition-transform duration-300 hover:scale-105"
      />
    </div>
  );
}
