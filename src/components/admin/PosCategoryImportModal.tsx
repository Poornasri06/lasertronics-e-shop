import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  type CategoryRecord,
  type ProductRecord,
  formatLKR,
} from "@/lib/catalog-types";
import {
  assignProductsToCategoryFn,
  addPosProductsToCategoryFn,
  fetchLivePosItemsFn,
} from "@/lib/catalog-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Package,
  RefreshCw,
  FolderTree,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Database,
  CloudDownload,
  Filter,
} from "lucide-react";

interface PosCategoryImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoryRecord[];
  defaultCategoryId?: string;
  allStoreProducts: ProductRecord[];
  onSuccess: () => Promise<void>;
}

interface PosLiveItem {
  sku: string;
  name: string;
  basePrice: number;
  sellingPrice: number;
  stock: number;
  unit?: string;
  variation?: string;
}

export function PosCategoryImportModal({
  open,
  onOpenChange,
  categories,
  defaultCategoryId,
  allStoreProducts,
  onSuccess,
}: PosCategoryImportModalProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    defaultCategoryId || categories[0]?.id || "electronics"
  );
  const [sourceMode, setSourceMode] = useState<"store" | "live">("store");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());
  const [filterOnlyNotInTarget, setFilterOnlyNotInTarget] = useState(true);
  const [filterInStockOnly, setFilterInStockOnly] = useState(true);

  // Live POS items state
  const [liveItems, setLiveItems] = useState<PosLiveItem[]>([]);
  const [isFetchingLive, setIsFetchingLive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset or update selected category when defaultCategoryId changes
  useEffect(() => {
    if (defaultCategoryId) {
      setSelectedCategoryId(defaultCategoryId);
    }
  }, [defaultCategoryId]);

  // Clear selections when switching categories or modes
  useEffect(() => {
    setSelectedSkus(new Set());
  }, [selectedCategoryId, sourceMode]);

  const targetCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) || categories[0];
  }, [categories, selectedCategoryId]);

  // Fetch live items from InTouch POS ERP when switching to live mode
  const handleFetchLiveItems = async () => {
    try {
      setIsFetchingLive(true);
      toast.loading("Querying live products from InTouch POS ERP...", { id: "live-pos-fetch" });
      const res = await fetchLivePosItemsFn({ data: filterInStockOnly });
      if (res.success && res.items) {
        setLiveItems(res.items);
        toast.success(`Fetched ${res.items.length.toLocaleString()} live products from InTouch POS!`, {
          id: "live-pos-fetch",
        });
      } else {
        toast.error(res.message || "Failed to fetch products from InTouch POS ERP", {
          id: "live-pos-fetch",
        });
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error connecting to POS API", {
        id: "live-pos-fetch",
      });
    } finally {
      setIsFetchingLive(false);
    }
  };

  // Displayed items based on source mode and filters
  const displayedItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (sourceMode === "store") {
      let list = allStoreProducts;

      if (filterOnlyNotInTarget) {
        list = list.filter((p) => p.categoryId !== selectedCategoryId);
      }

      if (filterInStockOnly) {
        list = list.filter((p) => p.stock > 0);
      }

      if (q) {
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            p.specs.some((s) => s.value.toLowerCase().includes(q))
        );
      }

      return list.map((p) => ({
        sku: p.sku,
        name: p.name,
        basePrice: p.basePrice,
        sellingPrice: p.sellingPrice,
        stock: p.stock,
        currentCategoryId: p.categoryId,
        unit: "Pc(s)",
        image: p.image,
      }));
    } else {
      let list = liveItems;

      if (filterInStockOnly) {
        list = list.filter((p) => p.stock > 0);
      }

      if (q) {
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            (p.variation && p.variation.toLowerCase().includes(q))
        );
      }

      const storeProductCategoryMap = new Map<string, string>();
      for (const p of allStoreProducts) {
        storeProductCategoryMap.set(p.sku.toLowerCase(), p.categoryId);
      }

      return list.map((item) => {
        const curCat = storeProductCategoryMap.get(item.sku.toLowerCase());
        return {
          sku: item.sku,
          name: item.name,
          basePrice: item.basePrice,
          sellingPrice: item.sellingPrice,
          stock: item.stock,
          currentCategoryId: curCat,
          unit: item.unit,
          variation: item.variation,
          image: null,
        };
      });
    }
  }, [
    sourceMode,
    allStoreProducts,
    liveItems,
    searchQuery,
    selectedCategoryId,
    filterOnlyNotInTarget,
    filterInStockOnly,
  ]);

  // Toggle selection
  const handleToggleSku = (sku: string) => {
    setSelectedSkus((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) {
        next.delete(sku);
      } else {
        next.add(sku);
      }
      return next;
    });
  };

  // Toggle all visible items
  const handleToggleAllVisible = () => {
    const visibleSkus = displayedItems.map((i) => i.sku);
    const allSelected = visibleSkus.length > 0 && visibleSkus.every((s) => selectedSkus.has(s));

    setSelectedSkus((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        visibleSkus.forEach((s) => next.delete(s));
      } else {
        visibleSkus.forEach((s) => next.add(s));
      }
      return next;
    });
  };

  // Add / Assign to Category
  const handleSubmit = async () => {
    if (selectedSkus.size === 0) {
      toast.warning("Please select at least one product to add.");
      return;
    }

    try {
      setIsSubmitting(true);
      const skus = Array.from(selectedSkus);

      if (sourceMode === "store") {
        const res = await assignProductsToCategoryFn({
          data: {
            productSkus: skus,
            categoryId: selectedCategoryId,
          },
        });

        toast.success(
          `Successfully assigned ${res.updatedCount} products to "${res.categoryName}"! Selling prices recalculated with +${res.markupPercentage}% markup.`
        );
      } else {
        const itemsToAdd = displayedItems
          .filter((i) => selectedSkus.has(i.sku))
          .map((i) => ({
            sku: i.sku,
            name: i.name,
            basePrice: i.basePrice,
            stock: i.stock,
            unit: i.unit,
            image: i.image,
          }));

        const res = await addPosProductsToCategoryFn({
          data: {
            items: itemsToAdd,
            categoryId: selectedCategoryId,
          },
        });

        toast.success(
          `Successfully added ${res.addedCount + res.updatedCount} POS products to "${res.categoryName}"! (+${res.markupPercentage}% markup applied)`
        );
      }

      await onSuccess();
      onOpenChange(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to add products to category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleSkus = displayedItems.map((i) => i.sku);
  const isAllVisibleSelected =
    visibleSkus.length > 0 && visibleSkus.every((s) => selectedSkus.has(s));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-slate-900 border border-slate-800 text-slate-100 p-5 sm:p-7 rounded-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <DialogHeader className="border-b border-slate-800 pb-4 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                <FolderTree className="size-5 text-blue-400" />
                <span>Add Products from POS to Category</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-1">
                Select products from InTouch POS inventory and assign them to any category with automated markup recalculation.
              </DialogDescription>
            </div>

            {/* Target Category Selector with Markup Chip */}
            <div className="flex items-center gap-2 bg-slate-950/70 p-2 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 shrink-0">Target:</span>
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger className="h-8 min-w-[170px] rounded-lg bg-slate-800 border-slate-700 text-xs text-white font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} (+{c.markupPercentage}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>

        {/* Source Mode Tabs & Target Rule Notice */}
        <div className="py-3 shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Mode Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setSourceMode("store")}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  sourceMode === "store"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Database className="size-3.5" />
                <span>Synced POS Catalog ({allStoreProducts.length})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSourceMode("live");
                  if (liveItems.length === 0) {
                    handleFetchLiveItems();
                  }
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  sourceMode === "live"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <CloudDownload className="size-3.5" />
                <span>Live InTouch ERP {liveItems.length > 0 ? `(${liveItems.length})` : ""}</span>
              </button>
            </div>

            {/* Target Category Rule Notice */}
            <div className="px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-900/50 text-xs text-blue-300 flex items-center gap-2">
              <span className="font-semibold">{targetCategory?.name}:</span>
              <span className="font-mono font-bold text-white">+{targetCategory?.markupPercentage}% Markup</span>
              <span className="text-[11px] text-blue-400/80">(Auto calculates Selling Price in LKR)</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <Input
                placeholder="Search products by Name, SKU, variation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 rounded-xl bg-slate-950/80 border-slate-700 text-xs text-white placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              {sourceMode === "store" && (
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <Checkbox
                    checked={filterOnlyNotInTarget}
                    onCheckedChange={(c) => setFilterOnlyNotInTarget(Boolean(c))}
                    className="border-slate-600 data-[state=checked]:bg-blue-600"
                  />
                  <span>Exclude items already in {targetCategory?.name}</span>
                </label>
              )}

              <label className="flex items-center gap-1.5 cursor-pointer">
                <Checkbox
                  checked={filterInStockOnly}
                  onCheckedChange={(c) => setFilterInStockOnly(Boolean(c))}
                  className="border-slate-600 data-[state=checked]:bg-blue-600"
                />
                <span>In Stock only</span>
              </label>

              {sourceMode === "live" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleFetchLiveItems}
                  disabled={isFetchingLive}
                  className="h-8 rounded-lg border-slate-700 bg-slate-800 text-slate-200 text-xs gap-1.5"
                >
                  <RefreshCw className={`size-3.5 ${isFetchingLive ? "animate-spin text-blue-400" : ""}`} />
                  Refresh POS
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Products Table Scroll Container */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/50 min-h-[300px]">
          {displayedItems.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Package className="size-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No matching POS products found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {sourceMode === "live" && liveItems.length === 0
                  ? "Click 'Refresh POS' above to fetch products live from InTouch POS ERP."
                  : "Try clearing search keywords or unchecking 'Exclude items already in this category'."}
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-slate-800 shadow-sm">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">
                    <Checkbox
                      checked={isAllVisibleSelected}
                      onCheckedChange={handleToggleAllVisible}
                      className="border-slate-600 data-[state=checked]:bg-blue-600"
                      title="Select / Deselect all visible"
                    />
                  </th>
                  <th className="py-2.5 px-3 font-semibold">Product & SKU</th>
                  <th className="py-2.5 px-3 font-semibold">Current Category</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Base Price</th>
                  <th className="py-2.5 px-3 font-semibold text-center">Stock</th>
                  <th className="py-2.5 px-3 font-semibold text-right">
                    New Selling Price ({targetCategory?.name})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {displayedItems.map((item) => {
                  const isSelected = selectedSkus.has(item.sku);
                  const isAlreadyInTarget = item.currentCategoryId === selectedCategoryId;
                  const markupPct = targetCategory?.markupPercentage ?? 15;
                  const newSelling = Math.round(
                    (item.basePrice + (item.basePrice * markupPct) / 100) * 100
                  ) / 100;
                  const curCatObj = categories.find((c) => c.id === item.currentCategoryId);

                  return (
                    <tr
                      key={item.sku}
                      onClick={() => handleToggleSku(item.sku)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-blue-950/40 hover:bg-blue-950/60"
                          : "hover:bg-slate-800/30"
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSku(item.sku)}
                          className="border-slate-600 data-[state=checked]:bg-blue-600"
                        />
                      </td>

                      {/* Product Name & SKU */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-white max-w-[280px] truncate" title={item.name}>
                          {item.name}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                          SKU: {item.sku}
                        </div>
                      </td>

                      {/* Current Category */}
                      <td className="py-2.5 px-3">
                        {isAlreadyInTarget ? (
                          <Badge className="bg-emerald-950/80 text-emerald-300 border-emerald-800 text-[10px]">
                            Current Category
                          </Badge>
                        ) : curCatObj ? (
                          <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                            {curCatObj.name}
                          </Badge>
                        ) : (
                          <span className="text-slate-500 text-[10px] italic">Not categorized</span>
                        )}
                      </td>

                      {/* Base Price */}
                      <td className="py-2.5 px-3 text-right font-mono text-slate-300">
                        {formatLKR(item.basePrice)}
                      </td>

                      {/* Stock */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`font-mono font-bold text-xs ${
                            item.stock <= 5
                              ? "text-rose-400"
                              : item.stock <= 20
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {item.stock}
                        </span>
                      </td>

                      {/* New Selling Price with Formula */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="font-mono font-bold text-white text-xs">
                          {formatLKR(newSelling)}
                        </div>
                        <span className="text-[10px] font-mono text-blue-400">
                          +{markupPct}% markup
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <strong className="text-white font-mono text-sm">{selectedSkus.size}</strong> product{selectedSkus.size === 1 ? "" : "s"} selected for{" "}
            <strong className="text-blue-400 font-semibold">{targetCategory?.name}</strong>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none h-9 rounded-xl border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={selectedSkus.size === 0 || isSubmitting}
              className="flex-1 sm:flex-none h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="size-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5" />
                  Add {selectedSkus.size} to {targetCategory?.name}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
