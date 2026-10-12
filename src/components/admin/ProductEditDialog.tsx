import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProductRecord,
  CategoryRecord,
  MediaRecord,
  calculateSellingPrice,
  formatINR,
} from "@/lib/catalog-store";
import { ProductImage } from "./ProductImage";
import { Plus, Trash2, Upload, AlertCircle, Sparkles, Check } from "lucide-react";

interface ProductEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: ProductRecord | null;
  categories: CategoryRecord[];
  mediaList: MediaRecord[];
  onSave: (data: {
    sku: string;
    name: string;
    categoryId: string;
    basePrice: number;
    isPriceOverridden: boolean;
    overridePrice: number | null;
    image: string | null;
    stock: number;
    blurb: string;
    badge?: string;
    specs: { label: string; value: string }[];
  }) => Promise<void>;
  onUploadImage?: (file: File) => Promise<string>;
}

export function ProductEditDialog({
  open,
  onOpenChange,
  product,
  categories,
  mediaList,
  onSave,
  onUploadImage,
}: ProductEditDialogProps) {
  const isEditing = Boolean(product);

  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [basePrice, setBasePrice] = useState<number>(0);
  const [isPriceOverridden, setIsPriceOverridden] = useState(false);
  const [overridePrice, setOverridePrice] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [stock, setStock] = useState<number>(10);
  const [blurb, setBlurb] = useState("");
  const [badge, setBadge] = useState("");
  const [specs, setSpecs] = useState<{ label: string; value: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when dialog opens or product changes
  useEffect(() => {
    if (product) {
      setSku(product.sku);
      setName(product.name);
      setCategoryId(product.categoryId);
      setBasePrice(product.basePrice);
      setIsPriceOverridden(product.isPriceOverridden);
      setOverridePrice(product.overridePrice);
      setImage(product.image);
      setStock(product.stock);
      setBlurb(product.blurb || "");
      setBadge(product.badge || "");
      setSpecs(product.specs || []);
    } else {
      const defaultCat = categories[0]?.id || "electronics";
      setSku(`LT-${Math.floor(1000 + Math.random() * 9000)}`);
      setName("");
      setCategoryId(defaultCat);
      setBasePrice(100);
      setIsPriceOverridden(false);
      setOverridePrice(null);
      setImage(null);
      setStock(25);
      setBlurb("");
      setBadge("");
      setSpecs([
        { label: "Warranty", value: "6 Months" },
        { label: "Condition", value: "Brand New" },
      ]);
    }
    setError(null);
  }, [product, open, categories]);

  // Selected Category markup calculation
  const currentCategory = categories.find((c) => c.id === categoryId) || categories[0];
  const categoryMarkup = currentCategory?.markupPercentage ?? 15;
  const calculatedSellingPrice = calculateSellingPrice(basePrice, categoryMarkup);
  const markupAmount = Math.round(((basePrice * categoryMarkup) / 100) * 100) / 100;
  const finalSellingPrice = isPriceOverridden && overridePrice != null ? overridePrice : calculatedSellingPrice;

  // Handle image upload from computer
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds maximum allowed size of 5MB.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"].includes(file.type)) {
      setError("Unsupported format. Please select JPEG, PNG, WebP, GIF, or SVG.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      if (onUploadImage) {
        const uploadedUrl = await onUploadImage(file);
        setImage(uploadedUrl);
      } else {
        // Fallback to local data URL preview
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { label: "", value: "" }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: "label" | "value", val: string) => {
    const next = [...specs];
    next[index][field] = val;
    setSpecs(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    if (!sku.trim()) {
      setError("Product SKU is required.");
      return;
    }
    if (basePrice < 0) {
      setError("Base price cannot be negative.");
      return;
    }
    if (isPriceOverridden && (overridePrice == null || overridePrice <= 0)) {
      setError("Please specify a valid override selling price greater than 0.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSave({
        sku: sku.trim(),
        name: name.trim(),
        categoryId,
        basePrice,
        isPriceOverridden,
        overridePrice: isPriceOverridden ? overridePrice : null,
        image: image ? image.trim() : null,
        stock: Math.max(0, stock),
        blurb: blurb.trim(),
        badge: badge.trim() || undefined,
        specs: specs.filter((s) => s.label.trim() && s.value.trim()),
      });
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto p-0 rounded-2xl bg-white border border-slate-200/80 shadow-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight text-slate-900">
                  {isEditing ? `Edit Product: ${product?.name}` : "Add New Product"}
                </DialogTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage product specifications, category assignment, and category-based pricing.
                </p>
              </div>
            </div>
          </DialogHeader>

          {error && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Primary Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="product-name" className="text-xs font-semibold text-slate-700">
                  Product Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="product-name"
                  placeholder="e.g. 65W GaN Fast Charger"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl h-10 text-sm"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="product-sku" className="text-xs font-semibold text-slate-700">
                  SKU / Identifier <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="product-sku"
                  placeholder="e.g. LT-1001"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  disabled={isEditing}
                  className="rounded-xl h-10 text-sm uppercase font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="product-category" className="text-xs font-semibold text-slate-700">
                  Category Assignment <span className="text-rose-500">*</span>
                </Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="product-category" className="rounded-xl h-10 text-sm">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-sm">
                        {c.name} ({c.markupPercentage}% markup rule)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="product-stock" className="text-xs font-semibold text-slate-700">
                  Inventory Stock Level
                </Label>
                <Input
                  id="product-stock"
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(parseInt(e.target.value) || 0)}
                  className="rounded-xl h-10 text-sm"
                />
              </div>
            </div>

            {/* Category-Based Pricing Section */}
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="grid size-7 place-items-center rounded-lg bg-blue-600 text-white shadow-xs">
                    <span className="font-bold text-xs">₹</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Category-Based Pricing Configuration
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Rule: Base Price + ({categoryMarkup}% category markup) = Selling Price
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs">
                  <Switch
                    id="price-override"
                    checked={isPriceOverridden}
                    onCheckedChange={setIsPriceOverridden}
                  />
                  <Label htmlFor="price-override" className="text-xs font-medium cursor-pointer text-slate-700">
                    Manual Price Override
                  </Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="base-price" className="text-xs font-semibold text-slate-700">
                    Base Cost Price (₹) <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-semibold text-sm">₹</span>
                    <Input
                      id="base-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={basePrice}
                      onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                      className="rounded-xl pl-8 h-10 text-sm font-semibold text-slate-800"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500">Purchase or factory unit price</span>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    Calculated Rule Price
                  </Label>
                  <div className="h-10 rounded-xl bg-white border border-slate-200 px-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500 text-xs">+{categoryMarkup}% markup</span>
                    <span className="font-bold text-slate-900">{formatINR(calculatedSellingPrice)}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Markup amount: +{formatINR(markupAmount)}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="override-price" className="text-xs font-semibold text-slate-700">
                    Final Selling Price {isPriceOverridden && <span className="text-amber-600 font-bold">(Overridden)</span>}
                  </Label>
                  {isPriceOverridden ? (
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-amber-600 font-bold text-sm">₹</span>
                      <Input
                        id="override-price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Custom selling price"
                        value={overridePrice ?? ""}
                        onChange={(e) => setOverridePrice(parseFloat(e.target.value) || null)}
                        className="rounded-xl pl-8 h-10 text-sm font-bold text-amber-800 border-amber-300 bg-amber-50/50"
                      />
                    </div>
                  ) : (
                    <div className="h-10 rounded-xl bg-emerald-50 border border-emerald-200 px-3 flex items-center justify-between text-sm font-bold text-emerald-800">
                      <span>Automated</span>
                      <span>{formatINR(calculatedSellingPrice)}</span>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-500">
                    {isPriceOverridden
                      ? "Individual override preserved across category rule updates."
                      : "Dynamically synced with category markup."}
                  </span>
                </div>
              </div>
            </div>

            {/* Product Image Management */}
            <div className="space-y-3">
              <Label className="text-xs font-semibold text-slate-700">
                Product Image & Media Management
              </Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50">
                <ProductImage
                  src={image}
                  alt={name || "Product preview"}
                  category={categoryId}
                  size="xl"
                  className="rounded-xl shadow-xs"
                />

                <div className="space-y-3 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-primary transition-colors">
                        <Upload className="size-3.5 text-blue-600" />
                        {isUploading ? "Uploading..." : "Upload New Image"}
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isUploading}
                      />
                    </label>

                    {image && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setImage(null)}
                        className="h-8 rounded-xl text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      >
                        Remove Image (Use Placeholder)
                      </Button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-medium text-slate-600">
                      Or select from Media Library:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
                      {mediaList.slice(0, 8).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setImage(m.url)}
                          className={`relative size-10 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                            image === m.url
                              ? "border-blue-600 ring-2 ring-blue-100 scale-105"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={m.url} alt={m.filename} className="size-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Supports JPG, PNG, WebP, SVG up to 5MB. Products without images cleanly display the category default placeholder.
                  </p>
                </div>
              </div>
            </div>

            {/* Blurb & Badge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="product-badge" className="text-xs font-semibold text-slate-700">
                  Promotional Badge (Optional)
                </Label>
                <Input
                  id="product-badge"
                  placeholder="e.g. Bestseller, Special Deal, New"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  className="rounded-xl h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="product-blurb" className="text-xs font-semibold text-slate-700">
                  Short Description / Blurb
                </Label>
                <Textarea
                  id="product-blurb"
                  placeholder="Key features, application notes, or warranty details..."
                  value={blurb}
                  onChange={(e) => setBlurb(e.target.value)}
                  rows={2}
                  className="rounded-xl text-sm resize-none"
                />
              </div>
            </div>

            {/* Specifications Key-Value Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-700">
                  Technical Specifications
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSpec}
                  className="h-7 text-xs rounded-lg gap-1 border-slate-200"
                >
                  <Plus className="size-3" /> Add Spec
                </Button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto p-1">
                {specs.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      placeholder="Label (e.g. Output, Voltage)"
                      value={s.label}
                      onChange={(e) => handleSpecChange(idx, "label", e.target.value)}
                      className="h-8 text-xs rounded-lg flex-1"
                    />
                    <Input
                      placeholder="Value (e.g. 5V 2A, 100W)"
                      value={s.value}
                      onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                      className="h-8 text-xs rounded-lg flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSpec(idx)}
                      className="size-8 p-0 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Selling Price: <strong className="text-slate-900">{formatINR(finalSellingPrice)}</strong>
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-xl h-9 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                {isSaving ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
