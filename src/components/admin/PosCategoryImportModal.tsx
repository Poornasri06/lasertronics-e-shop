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
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CheckSquare,
  Square,
  ArrowUpDown,
  Tag,
  DollarSign,
  Layers,
  Sparkles,
} from "lucide-react";

interface PosCategoryImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoryRecord[];
  defaultCategoryId?: string | undefined;
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
  categoryId?: string;
  categoryName?: string;
}

const PRICE_RANGES = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-500", label: "Under LKR 500", min: 0, max: 500 },
  { id: "500-2000", label: "LKR 500 – 2,000", min: 500, max: 2000 },
  { id: "2000-10000", label: "LKR 2,000 – 10,000", min: 2000, max: 10000 },
  { id: "over-10000", label: "Over LKR 10,000", min: 10000, max: Infinity },
];

const STOCK_FILTERS = [
  { id: "all", label: "All Stock Levels" },
  { id: "in-stock", label: "In Stock (> 0)" },
  { id: "low-stock", label: "Low Stock (1 – 10)" },
  { id: "high-stock", label: "High Stock (≥ 50)" },
  { id: "out-of-stock", label: "Out of Stock (0)" },
];

const SORT_OPTIONS = [
  { id: "name-asc", label: "Name (A → Z)" },
  { id: "name-desc", label: "Name (Z → A)" },
  { id: "price-asc", label: "Base Price (Low → High)" },
  { id: "price-desc", label: "Base Price (High → Low)" },
  { id: "stock-desc", label: "Stock (High → Low)" },
  { id: "stock-asc", label: "Stock (Low → High)" },
  { id: "sku-asc", label: "SKU (Ascending)" },
];

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
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCurrentCategory, setFilterCurrentCategory] = useState<string>("all");
  const [filterPriceRange, setFilterPriceRange] = useState<string>("all");
  const [filterStockStatus, setFilterStockStatus] = useState<string>("in-stock");
  const [filterOnlyNotInTarget, setFilterOnlyNotInTarget] = useState(true);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("name-asc");
  
  // Pagination States
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Selection Set
  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());

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
    setCurrentPage(1);
  }, [selectedCategoryId, sourceMode]);

  // Reset page to 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchQuery,
    filterCurrentCategory,
    filterPriceRange,
    filterStockStatus,
    filterOnlyNotInTarget,
    showSelectedOnly,
    sortBy,
  ]);

  const targetCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) || categories[0];
  }, [categories, selectedCategoryId]);

  // Compute category product counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    if (sourceMode === "store") {
      counts["all"] = allStoreProducts.length;
      for (const p of allStoreProducts) {
        const cat = p.categoryId || "uncategorized";
        counts[cat] = (counts[cat] || 0) + 1;
      }
    } else {
      counts["all"] = liveItems.length;
      const storeProductCategoryMap = new Map<string, string>();
      for (const p of allStoreProducts) {
        if (p.sku && p.categoryId) {
          storeProductCategoryMap.set(p.sku.toLowerCase(), p.categoryId);
        }
      }
      for (const p of liveItems) {
        const cat = storeProductCategoryMap.get(p.sku.toLowerCase()) || p.categoryId || "electronics";
        counts[cat] = (counts[cat] || 0) + 1;
      }
    }
    return counts;
  }, [allStoreProducts, liveItems, sourceMode]);

  // Check if any filter is actively applied
  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery.trim() !== "" ||
      filterCurrentCategory !== "all" ||
      filterPriceRange !== "all" ||
      filterStockStatus !== "in-stock" ||
      !filterOnlyNotInTarget ||
      showSelectedOnly ||
      sortBy !== "name-asc"
    );
  }, [
    searchQuery,
    filterCurrentCategory,
    filterPriceRange,
    filterStockStatus,
    filterOnlyNotInTarget,
    showSelectedOnly,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterCurrentCategory("all");
    setFilterPriceRange("all");
    setFilterStockStatus("in-stock");
    setFilterOnlyNotInTarget(true);
    setShowSelectedOnly(false);
    setSortBy("name-asc");
    setCurrentPage(1);
  };

  // Fetch live items from InTouch POS ERP when switching to live mode
  const handleFetchLiveItems = async () => {
    try {
      setIsFetchingLive(true);
      toast.loading("Querying live products from InTouch POS ERP...", { id: "live-pos-fetch" });
      const res = await fetchLivePosItemsFn({ data: filterStockStatus === "in-stock" });
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

  // Displayed items based on source mode and all applied filters
  const displayedItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    let list: Array<{
      sku: string;
      name: string;
      basePrice: number;
      sellingPrice: number;
      stock: number;
      currentCategoryId?: string | undefined;
      categoryName?: string | undefined;
      unit?: string | undefined;
      variation?: string | undefined;
      image?: string | null | undefined;
    }> = [];

    if (sourceMode === "store") {
      list = allStoreProducts.map((p) => ({
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
      const storeProductCategoryMap = new Map<string, string>();
      for (const p of allStoreProducts) {
        storeProductCategoryMap.set(p.sku.toLowerCase(), p.categoryId);
      }

      list = liveItems.map((item) => ({
        sku: item.sku,
        name: item.name,
        basePrice: item.basePrice,
        sellingPrice: item.sellingPrice,
        stock: item.stock,
        currentCategoryId: storeProductCategoryMap.get(item.sku.toLowerCase()) || item.categoryId || "electronics",
        categoryName: item.categoryName,
        unit: item.unit,
        variation: item.variation,
        image: null,
      }));
    }

    // 1. Text Search Filter (Name, SKU, variation)
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.variation && p.variation.toLowerCase().includes(q))
      );
    }

    // 2. Exclude items already in target category (bypass if user explicitly selected this category in filter)
    if (filterOnlyNotInTarget && filterCurrentCategory !== selectedCategoryId) {
      list = list.filter((p) => p.currentCategoryId !== selectedCategoryId);
    }

    // 3. Current Category Filter
    if (filterCurrentCategory !== "all") {
      list = list.filter((p) => p.currentCategoryId === filterCurrentCategory);
    }

    // 4. Stock Filter
    if (filterStockStatus === "in-stock") {
      list = list.filter((p) => p.stock > 0);
    } else if (filterStockStatus === "low-stock") {
      list = list.filter((p) => p.stock > 0 && p.stock <= 10);
    } else if (filterStockStatus === "high-stock") {
      list = list.filter((p) => p.stock >= 50);
    } else if (filterStockStatus === "out-of-stock") {
      list = list.filter((p) => p.stock <= 0);
    }

    // 5. Base Price Range Filter
    if (filterPriceRange !== "all") {
      const bucket = PRICE_RANGES.find((b) => b.id === filterPriceRange);
      if (bucket) {
        list = list.filter((p) => p.basePrice >= bucket.min && p.basePrice < bucket.max);
      }
    }

    // 6. Show Selected Only Filter
    if (showSelectedOnly) {
      list = list.filter((p) => selectedSkus.has(p.sku));
    }

    // 7. Sorting
    list = [...list].sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "price-asc") return a.basePrice - b.basePrice;
      if (sortBy === "price-desc") return b.basePrice - a.basePrice;
      if (sortBy === "stock-desc") return b.stock - a.stock;
      if (sortBy === "stock-asc") return a.stock - b.stock;
      if (sortBy === "sku-asc") return a.sku.localeCompare(b.sku);
      return 0;
    });

    return list;
  }, [
    sourceMode,
    allStoreProducts,
    liveItems,
    searchQuery,
    selectedCategoryId,
    filterOnlyNotInTarget,
    filterCurrentCategory,
    filterStockStatus,
    filterPriceRange,
    showSelectedOnly,
    sortBy,
    selectedSkus,
  ]);

  // Paginated Sliced View for Lightning Fast 60fps Rendering
  const totalItems = displayedItems.length;
  const totalPages = pageSize === Infinity ? 1 : Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    if (pageSize === Infinity) return displayedItems;
    const start = (safePage - 1) * pageSize;
    return displayedItems.slice(start, start + pageSize);
  }, [displayedItems, safePage, pageSize]);

  // Selection Helpers
  const pageSkus = paginatedItems.map((i) => i.sku);
  const isAllPageSelected =
    pageSkus.length > 0 && pageSkus.every((s) => selectedSkus.has(s));

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

  const handleTogglePageVisible = () => {
    setSelectedSkus((prev) => {
      const next = new Set(prev);
      if (isAllPageSelected) {
        pageSkus.forEach((s) => next.delete(s));
      } else {
        pageSkus.forEach((s) => next.add(s));
      }
      return next;
    });
  };

  const handleSelectAllFiltered = () => {
    setSelectedSkus((prev) => {
      const next = new Set(prev);
      displayedItems.forEach((item) => next.add(item.sku));
      return next;
    });
    toast.success(`Selected all ${displayedItems.length.toLocaleString()} matching products!`);
  };

  const handleClearSelection = () => {
    setSelectedSkus(new Set());
    toast.info("Cleared all product selections.");
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
            unit: i.unit || "Pc(s)",
            image: i.image ?? null,
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[96vw] bg-slate-900 border border-slate-800 text-slate-100 p-5 sm:p-7 rounded-2xl max-h-[94vh] flex flex-col overflow-hidden shadow-2xl">
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
            <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 shrink-0">Target:</span>
              <Select
                value={selectedCategoryId}
                onValueChange={setSelectedCategoryId}
              >
                <SelectTrigger className="h-8 min-w-[190px] rounded-lg bg-slate-800 border-slate-700 text-xs text-white font-semibold">
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
        <div className="py-2.5 shrink-0 space-y-2.5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
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
                <span>Synced POS Catalog ({allStoreProducts.length.toLocaleString()})</span>
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
                <span>Live InTouch ERP {liveItems.length > 0 ? `(${liveItems.length.toLocaleString()})` : "(8,641)"}</span>
              </button>
            </div>

            {/* Target Category Rule Notice */}
            <div className="px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-900/50 text-xs text-blue-300 flex items-center gap-2">
              <span className="font-semibold">{targetCategory?.name}:</span>
              <span className="font-mono font-bold text-white">+{targetCategory?.markupPercentage}% Markup</span>
              <span className="text-[11px] text-blue-400/80">(Auto calculates Selling Price in LKR)</span>
            </div>
          </div>

          {/* ADVANCED FILTER TOOLBAR */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2.5">
            {/* Row 1: Search, Category Filter, Sort Filter */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              {/* Search Box */}
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <Input
                  placeholder="Search by Name, SKU, variation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 rounded-xl bg-slate-900 border-slate-700 text-xs text-white placeholder:text-slate-400"
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

              {/* Current Category Filter */}
              <div className="md:col-span-4">
                <Select
                  value={filterCurrentCategory}
                  onValueChange={(val) => {
                    setFilterCurrentCategory(val);
                    if (val === selectedCategoryId) {
                      setFilterOnlyNotInTarget(false);
                    }
                  }}
                >
                  <SelectTrigger className="h-9 rounded-xl bg-slate-900 border-slate-700 text-xs text-white">
                    <div className="flex items-center gap-1.5 truncate">
                      <Tag className="size-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">
                        {filterCurrentCategory === "all"
                          ? `All Categories (${(categoryCounts["all"] || allStoreProducts.length).toLocaleString()})`
                          : `${categories.find((c) => c.id === filterCurrentCategory)?.name || filterCurrentCategory} (${
                              categoryCounts[filterCurrentCategory] || 0
                            })`}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs max-h-60">
                    <SelectItem value="all">
                      All Current Categories ({(categoryCounts["all"] || allStoreProducts.length).toLocaleString()})
                    </SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} ({categoryCounts[c.id] || 0})
                      </SelectItem>
                    ))}
                    {categoryCounts["uncategorized"] && (
                      <SelectItem value="uncategorized">
                        Uncategorized ({categoryCounts["uncategorized"]})
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By Filter */}
              <div className="md:col-span-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 rounded-xl bg-slate-900 border-slate-700 text-xs text-white">
                    <div className="flex items-center gap-1.5 truncate">
                      <ArrowUpDown className="size-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">
                        {SORT_OPTIONS.find((s) => s.id === sortBy)?.label || "Sort"}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                    {SORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 2: Price Range, Stock Filter, Checkbox Toggles, Selected Pill & Reset */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-800/60">
              <div className="flex flex-wrap items-center gap-2">
                {/* Price Filter Dropdown */}
                <Select value={filterPriceRange} onValueChange={setFilterPriceRange}>
                  <SelectTrigger className="h-8 rounded-lg bg-slate-900 border-slate-700 text-[11px] text-slate-200 min-w-[125px]">
                    <div className="flex items-center gap-1 truncate">
                      <DollarSign className="size-3 text-emerald-400 shrink-0" />
                      <span className="truncate">
                        {PRICE_RANGES.find((p) => p.id === filterPriceRange)?.label || "Price"}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                    {PRICE_RANGES.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Stock Filter Dropdown */}
                <Select value={filterStockStatus} onValueChange={setFilterStockStatus}>
                  <SelectTrigger className="h-8 rounded-lg bg-slate-900 border-slate-700 text-[11px] text-slate-200 min-w-[130px]">
                    <div className="flex items-center gap-1 truncate">
                      <Package className="size-3 text-amber-400 shrink-0" />
                      <span className="truncate">
                        {STOCK_FILTERS.find((s) => s.id === filterStockStatus)?.label || "Stock"}
                      </span>
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                    {STOCK_FILTERS.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Exclude in Target Category Checkbox */}
                {sourceMode === "store" && (
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300 ml-1">
                    <Checkbox
                      checked={filterOnlyNotInTarget}
                      onCheckedChange={(c) => {
                        const checked = Boolean(c);
                        setFilterOnlyNotInTarget(checked);
                        if (checked && filterCurrentCategory === selectedCategoryId) {
                          setFilterCurrentCategory("all");
                        }
                      }}
                      className="border-slate-600 data-[state=checked]:bg-blue-600 size-3.5"
                    />
                    <span>Exclude already in {targetCategory?.name}</span>
                  </label>
                )}

                {/* Show Selected Only Button */}
                <button
                  type="button"
                  onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                  className={`h-7 px-2.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    showSelectedOnly
                      ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                      : "bg-slate-900 text-slate-300 border-slate-700 hover:text-white"
                  }`}
                >
                  <CheckSquare className="size-3" />
                  <span>Selected ({selectedSkus.size})</span>
                </button>

                {/* Reset Filters Button */}
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="h-7 px-2 rounded-lg text-[11px] font-medium text-slate-400 hover:text-white flex items-center gap-1 transition-colors hover:bg-slate-800"
                    title="Reset all search and filters"
                  >
                    <RotateCcw className="size-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Refresh POS button in live mode */}
              {sourceMode === "live" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleFetchLiveItems}
                  disabled={isFetchingLive}
                  className="h-7 rounded-lg border-slate-700 bg-slate-800 text-slate-200 text-[11px] gap-1.5 px-2.5"
                >
                  <RefreshCw className={`size-3 ${isFetchingLive ? "animate-spin text-blue-400" : ""}`} />
                  Refresh POS
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Selection Helper & Pagination Action Bar */}
        <div className="py-2 px-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400">
              Showing{" "}
              <strong className="text-white">
                {totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1}–
                {Math.min(safePage * pageSize, totalItems)}
              </strong>{" "}
              of <strong className="text-white font-mono">{totalItems.toLocaleString()}</strong> products
            </span>

            <span className="text-slate-600">|</span>

            {/* Quick Bulk Select Controls */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleTogglePageVisible}
                disabled={pageSkus.length === 0}
                className="h-6 px-2 text-[11px] text-slate-300 hover:text-white hover:bg-slate-800 rounded-md"
              >
                {isAllPageSelected ? "Deselect Page" : `Select Page (${pageSkus.length})`}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSelectAllFiltered}
                disabled={totalItems === 0 || selectedSkus.size === totalItems}
                className="h-6 px-2 text-[11px] text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-md font-semibold"
              >
                Select All Filtered ({totalItems.toLocaleString()})
              </Button>

              {selectedSkus.size > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  className="h-6 px-2 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-md"
                >
                  Clear ({selectedSkus.size})
                </Button>
              )}
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <Select
                value={String(pageSize)}
                onValueChange={(v) => {
                  setPageSize(v === "all" ? Infinity : Number(v));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-6 w-20 text-[10px] rounded-md bg-slate-900 border-slate-700 text-slate-300 px-1.5 py-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-xs">
                  <SelectItem value="50">50 / page</SelectItem>
                  <SelectItem value="100">100 / page</SelectItem>
                  <SelectItem value="250">250 / page</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="size-6 p-0 rounded-md border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <ChevronLeft className="size-3" />
              </Button>

              <span className="text-[11px] font-mono text-slate-400 px-1">
                {safePage} / {totalPages}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="size-6 p-0 rounded-md border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                <ChevronRight className="size-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Products Table Scroll Container */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/50 min-h-[300px]">
          {paginatedItems.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Package className="size-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No matching POS products found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {hasActiveFilters
                  ? "Try resetting filters or search terms."
                  : sourceMode === "live" && liveItems.length === 0
                  ? "Click 'Refresh POS' above to fetch products live from InTouch POS ERP."
                  : "Try clearing search keywords or unchecking 'Exclude items already in this category'."}
              </p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="mt-3 text-xs border-slate-700 bg-slate-800 text-slate-200"
                >
                  <RotateCcw className="size-3 mr-1" /> Reset Filters
                </Button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] sticky top-0 z-10 border-b border-slate-800 shadow-sm">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">
                    <Checkbox
                      checked={isAllPageSelected}
                      onCheckedChange={handleTogglePageVisible}
                      className="border-slate-600 data-[state=checked]:bg-blue-600"
                      title="Select / Deselect all visible on this page"
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
                {paginatedItems.map((item) => {
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
                      <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSku(item.sku)}
                          className="border-slate-600 data-[state=checked]:bg-blue-600"
                        />
                      </td>

                      {/* Product Name & SKU */}
                      <td className="py-2 px-3">
                        <div className="font-semibold text-white max-w-[280px] truncate" title={item.name}>
                          {item.name}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                          SKU: {item.sku}
                        </div>
                      </td>

                      {/* Current Category */}
                      <td className="py-2 px-3">
                        {isAlreadyInTarget ? (
                          <Badge className="bg-emerald-950/80 text-emerald-300 border-emerald-800 text-[10px]">
                            Current Category
                          </Badge>
                        ) : curCatObj ? (
                          <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                            {curCatObj.name}
                          </Badge>
                        ) : item.categoryName ? (
                          <Badge variant="outline" className="border-slate-700 text-slate-300 text-[10px]">
                            {item.categoryName}
                          </Badge>
                        ) : (
                          <span className="text-slate-500 text-[10px] italic">Not categorized</span>
                        )}
                      </td>

                      {/* Base Price */}
                      <td className="py-2 px-3 text-right font-mono text-slate-300">
                        {formatLKR(item.basePrice)}
                      </td>

                      {/* Stock */}
                      <td className="py-2 px-3 text-center">
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
                      <td className="py-2 px-3 text-right">
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
        <div className="pt-3 border-t border-slate-800 mt-2 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
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
