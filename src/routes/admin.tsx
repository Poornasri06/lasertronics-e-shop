import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  fetchAdminCatalogFn,
  saveProductFn,
  deleteProductFn,
  saveCategoryFn,
  updateCategoryMarkupFn,
  deleteCategoryFn,
  resetProductOverrideFn,
  deleteMediaFn,
  bulkImportFn,
  uploadImageFn,
  type ProductRecord,
  type CategoryRecord,
  type MediaRecord,
  formatINR,
  calculateSellingPrice,
} from "@/lib/catalog-store";
import { usePWA } from "@/hooks/usePWA";
import { ProductImage } from "@/components/admin/ProductImage";
import { ProductEditDialog } from "@/components/admin/ProductEditDialog";
import { CategoryEditDialog } from "@/components/admin/CategoryEditDialog";
import { PricingCalculatorModal } from "@/components/admin/PricingCalculatorModal";
import { BulkImportDialog } from "@/components/admin/BulkImportDialog";
import { ImageUploadDialog } from "@/components/admin/ImageUploadDialog";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Percent,
  Image as ImageIcon,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Shield,
  Trash2,
  Edit,
  RotateCcw,
  Wifi,
  WifiOff,
  DownloadCloud,
  CheckCircle2,
  AlertTriangle,
  Layers,
  TrendingUp,
  Sliders,
  DollarSign,
  ChevronRight,
  Calculator,
  ArrowRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    return await fetchAdminCatalogFn();
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const initialData = Route.useLoaderData();
  const { isOnline, isInstallable, triggerInstall } = usePWA();

  // Master State
  const [categories, setCategories] = useState<CategoryRecord[]>(initialData.categories);
  const [products, setProducts] = useState<ProductRecord[]>(initialData.products);
  const [media, setMedia] = useState<MediaRecord[]>(initialData.media);
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "categories" | "pricing" | "images"
  >("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dialog States
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductRecord | null>(null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryRecord | null>(null);

  const [pricingCalculatorOpen, setPricingCalculatorOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "product" | "category" | "media";
    id: string;
    name: string;
  }>({ open: false, type: "product", id: "", name: "" });

  // Product Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [imageFilter, setImageFilter] = useState<"all" | "has-image" | "no-image">("all");
  const [priceFilter, setPriceFilter] = useState<"all" | "calculated" | "overridden">("all");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "stock">("name");

  // Media Library Filter State
  const [mediaCategoryFilter, setMediaCategoryFilter] = useState("all");
  const [mediaAssignmentFilter, setMediaAssignmentFilter] = useState<"all" | "assigned" | "unassigned">("all");

  // Refresh data from server
  const refreshData = async (notify = false) => {
    try {
      setIsRefreshing(true);
      const res = await fetchAdminCatalogFn();
      if (res && Array.isArray(res.products)) {
        setCategories(res.categories);
        setProducts(res.products);
        setMedia(res.media);
        if (notify) {
          toast.success("Catalog synced with backend server.");
        }
      }
    } catch (err: unknown) {
      if (notify) {
        toast.error("Failed to sync with backend server.");
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setCategories(initialData.categories);
      setProducts(initialData.products);
      setMedia(initialData.media);
    }
  }, [initialData]);

  useEffect(() => {
    // Purge any old browser caches
    if (typeof window !== "undefined" && "caches" in window) {
      caches.keys().then((keys) => {
        keys.forEach((k) => caches.delete(k));
      });
    }
    refreshData(false);
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    const productsWithoutImages = products.filter((p) => !p.image || p.image.trim() === "").length;
    const overriddenPriceCount = products.filter((p) => p.isPriceOverridden).length;
    const totalStockValue = products.reduce((acc, p) => acc + p.sellingPrice * p.stock, 0);
    const avgMarkup =
      categories.length > 0
        ? Math.round(
            (categories.reduce((acc, c) => acc + c.markupPercentage, 0) / categories.length) * 10
          ) / 10
        : 0;

    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      productsWithoutImages,
      overriddenPriceCount,
      totalStockValue,
      avgMarkup,
    };
  }, [products, categories]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.specs.some((s) => s.value.toLowerCase().includes(q))
      );
    }

    if (selectedCategoryFilter !== "all") {
      result = result.filter((p) => p.categoryId === selectedCategoryFilter);
    }

    if (imageFilter === "has-image") {
      result = result.filter((p) => Boolean(p.image && p.image.trim() !== ""));
    } else if (imageFilter === "no-image") {
      result = result.filter((p) => !p.image || p.image.trim() === "");
    }

    if (priceFilter === "overridden") {
      result = result.filter((p) => p.isPriceOverridden);
    } else if (priceFilter === "calculated") {
      result = result.filter((p) => !p.isPriceOverridden);
    }

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price-asc") {
      result.sort((a, b) => a.sellingPrice - b.sellingPrice);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.sellingPrice - a.sellingPrice);
    } else if (sortBy === "stock") {
      result.sort((a, b) => b.stock - a.stock);
    }

    return result;
  }, [products, searchQuery, selectedCategoryFilter, imageFilter, priceFilter, sortBy]);

  // Filtered Media
  const filteredMedia = useMemo(() => {
    let list = [...media];

    if (mediaCategoryFilter !== "all") {
      list = list.filter((m) => m.categoryId === mediaCategoryFilter);
    }

    if (mediaAssignmentFilter === "assigned") {
      list = list.filter((m) => Boolean(m.productSku));
    } else if (mediaAssignmentFilter === "unassigned") {
      list = list.filter((m) => !m.productSku);
    }

    return list;
  }, [media, mediaCategoryFilter, mediaAssignmentFilter]);

  // Product Actions
  const handleSaveProduct = async (data: Parameters<typeof saveProductFn>[0]["data"]) => {
    try {
      const updated = await saveProductFn({ data });
      setProducts((prev) => {
        const idx = prev.findIndex((p) => p.sku === updated.sku);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updated;
          return next;
        }
        return [updated, ...prev];
      });
      toast.success(`Product "${updated.name}" saved successfully!`);
      await refreshData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    }
  };

  const handleDeleteProduct = async (sku: string) => {
    try {
      await deleteProductFn({ data: sku });
      setProducts((prev) => prev.filter((p) => p.sku !== sku));
      toast.success("Product deleted successfully.");
      await refreshData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    }
  };

  const handleResetOverride = async (sku: string) => {
    try {
      const updated = await resetProductOverrideFn({ data: sku });
      setProducts((prev) => prev.map((p) => (p.sku === sku ? updated : p)));
      toast.success(`Price for ${updated.name} reset to category rule (${formatINR(updated.sellingPrice)})`);
      await refreshData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to reset price");
    }
  };

  // Category Actions
  const handleSaveCategory = async (data: Parameters<typeof saveCategoryFn>[0]["data"]) => {
    try {
      const updated = await saveCategoryFn({ data });
      toast.success(`Category "${updated.name}" configured with ${updated.markupPercentage}% markup!`);
      await refreshData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to save category");
    }
  };

  const handleUpdateCategoryMarkup = async (categoryId: string, markupPercentage: number) => {
    try {
      await updateCategoryMarkupFn({ data: { categoryId, markupPercentage } });
      toast.success(`Category markup updated to ${markupPercentage}%. Selling prices recalculated!`);
      await refreshData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update category markup");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategoryFn({ data: { categoryId } });
      toast.success("Category deleted. Products reassigned safely.");
      await refreshData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete category");
    }
  };

  // Image Upload Action
  const handleUploadImage = async (data: Parameters<typeof uploadImageFn>[0]["data"]) => {
    const record = await uploadImageFn({ data });
    setMedia((prev) => [record, ...prev]);
    toast.success(`Image "${record.filename}" uploaded successfully!`);
    await refreshData();
  };

  const handleDeleteMedia = async (id: string) => {
    try {
      await deleteMediaFn({ data: id });
      setMedia((prev) => prev.filter((m) => m.id !== id));
      toast.success("Media file deleted and unlinked from products.");
      await refreshData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete media");
    }
  };

  // Bulk Import Action
  const handleBulkImport = async (importedList: Parameters<typeof bulkImportFn>[0]["data"]) => {
    const res = await bulkImportFn({ data: importedList });
    await refreshData();
    return res;
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    const { type, id } = deleteConfirm;
    if (type === "product") {
      await handleDeleteProduct(id);
    } else if (type === "category") {
      await handleDeleteCategory(id);
    } else if (type === "media") {
      await handleDeleteMedia(id);
    }
    setDeleteConfirm({ open: false, type: "product", id: "", name: "" });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">

      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-blue-500/20">
              <Shield className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                  Lasertronics Admin
                </span>
                <Badge
                  variant="outline"
                  className="bg-blue-950/80 text-blue-400 border-blue-800/80 text-[10px] font-mono font-bold px-1.5 py-0"
                >
                  PWA v1.0
                </Badge>
              </div>
              <span className="text-[10px] text-slate-400 block font-medium">
                Product, Category & Pricing Control Hub
              </span>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Online / Offline Indicator */}
            {/* Live Server Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-emerald-950/50 border-emerald-800 text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Catalog Connected</span>
            </div>

            {/* PWA Install Button */}
            {isInstallable && (
              <Button
                variant="outline"
                size="sm"
                onClick={triggerInstall}
                className="hidden md:flex items-center gap-1.5 rounded-xl border-blue-500/50 bg-blue-950/40 text-blue-300 hover:bg-blue-900/60 hover:text-white text-xs h-8"
              >
                <DownloadCloud className="size-3.5 text-blue-400" />
                <span>Install Admin App</span>
              </Button>
            )}

            {/* Refresh Sync */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refreshData(true)}
              disabled={isRefreshing}
              className="size-8 p-0 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800"
              title="Refresh Catalog Data"
            >
              <RefreshCw className={`size-4 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
            </Button>

            {/* Public Storefront Link */}
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <span className="hidden sm:inline">Storefront</span>
              <ExternalLink className="size-3.5 text-slate-400" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Navigation Sub-Bar */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between overflow-x-auto py-2 gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <LayoutDashboard className="size-3.5" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "products"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Package className="size-3.5" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "categories"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <FolderTree className="size-3.5" />
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("pricing")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "pricing"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <Percent className="size-3.5" />
              <span>Pricing Rules</span>
              {stats.overriddenPriceCount > 0 && (
                <span className="size-4 rounded-full bg-amber-500 text-amber-950 font-bold text-[10px] flex items-center justify-center">
                  {stats.overriddenPriceCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("images")}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "images"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <ImageIcon className="size-3.5" />
              <span>Media Library</span>
              {stats.productsWithoutImages > 0 && (
                <span className="size-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center" title={`${stats.productsWithoutImages} products without images`}>
                  {stats.productsWithoutImages}
                </span>
              )}
            </button>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBulkImportOpen(true)}
              className="h-8 rounded-xl border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-200 text-xs gap-1.5"
            >
              <Upload className="size-3.5 text-slate-400" />
              <span className="hidden sm:inline">Bulk CSV</span>
            </Button>

            <Button
              size="sm"
              onClick={() => {
                setSelectedProduct(null);
                setProductDialogOpen(true);
              }}
              className="h-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5 shadow-md shadow-blue-600/30 font-semibold"
            >
              <Plus className="size-3.5" />
              <span>Add Product</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ============================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Total Products</span>
                  <div className="size-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Package className="size-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {stats.totalProducts}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Across {stats.totalCategories} active categories
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Average Markup</span>
                  <div className="size-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Percent className="size-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-indigo-300 tracking-tight">
                    +{stats.avgMarkup}%
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Weighted category rules
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Missing Images</span>
                  <div className="size-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                    <ImageIcon className="size-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-rose-300 tracking-tight">
                    {stats.productsWithoutImages}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Showing default placeholders
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Price Overrides</span>
                  <div className="size-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Sliders className="size-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 tracking-tight">
                    {stats.overriddenPriceCount}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Manually overridden prices
                  </p>
                </div>
              </div>
            </div>

            {/* Middle Split: Category Markup Breakdown & Quick Calculator Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Pricing Rules Card */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FolderTree className="size-4 text-blue-400" />
                      Category Pricing Rules
                    </h3>
                    <p className="text-xs text-slate-400">
                      Rule-based selling prices: Base Price + (Base Price × Markup %)
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("pricing")}
                    className="h-8 rounded-xl border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                  >
                    Manage Rules <ChevronRight className="size-3.5 ml-1" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {categories.map((c) => {
                    const count = products.filter((p) => p.categoryId === c.id).length;
                    const sampleCalculated = calculateSellingPrice(100, c.markupPercentage);

                    return (
                      <div
                        key={c.id}
                        className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">{c.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-mono font-bold">
                            +{c.markupPercentage}%
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{c.description || c.tagline}</p>
                        <div className="pt-1 flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80">
                          <span>{count} products</span>
                          <span className="text-slate-300 font-mono text-[11px]">
                            ₹100 → <strong className="text-emerald-400">{formatINR(sampleCalculated)}</strong>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Launchpad & PWA Info */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-900/40 shadow-lg space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Calculator className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Live Pricing Simulator</h4>
                      <p className="text-[11px] text-slate-400">Test base prices across categories</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Test how changing a category's percentage affects profit margins and final selling prices in Indian Rupees (₹).
                  </p>

                  <Button
                    onClick={() => setPricingCalculatorOpen(true)}
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold h-10 shadow-md shadow-blue-600/30 gap-2"
                  >
                    <Calculator className="size-4" />
                    Open Price Simulator
                  </Button>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Catalog Valuation:</span>
                    <strong className="text-white font-mono">{formatINR(stats.totalStockValue)}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>PWA Installation:</span>
                    <strong className="text-emerald-400">{isInstallable ? "Available" : "Active / Browser"}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Product Updates Preview Table */}
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Package className="size-4 text-blue-400" />
                    Recently Updated Products
                  </h3>
                  <p className="text-xs text-slate-400">Latest additions and price updates in catalog</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("products")}
                  className="h-8 rounded-xl border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                >
                  View All Products <ChevronRight className="size-3.5 ml-1" />
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Base Price (₹)</th>
                      <th className="py-2.5 px-3 text-right">Markup %</th>
                      <th className="py-2.5 px-3 text-right">Selling Price (₹)</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {products.slice(0, 5).map((p) => {
                      const cat = categories.find((c) => c.id === p.categoryId);
                      return (
                        <tr key={p.sku} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3 flex items-center gap-3">
                            <ProductImage
                              src={p.image}
                              alt={p.name}
                              category={p.categoryId}
                              size="sm"
                              className="rounded-lg"
                            />
                            <div className="min-w-0">
                              <span className="font-semibold text-white block truncate">{p.name}</span>
                              <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-slate-300">{cat?.name || p.categoryId}</span>
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-slate-300">
                            {formatINR(p.basePrice)}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-blue-400 font-semibold">
                            +{cat?.markupPercentage ?? p.markupPercentage ?? 15}%
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-extrabold text-white">
                            {formatINR(p.sellingPrice)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {p.isPriceOverridden ? (
                              <Badge className="bg-amber-950/80 text-amber-300 border-amber-800 text-[9px] px-1.5 py-0">
                                Overridden
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-950/80 text-emerald-300 border-emerald-800 text-[9px] px-1.5 py-0">
                                Calculated
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PRODUCTS CATALOG MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === "products" && (
          <div className="space-y-5">
            {/* Search and Filters Bar */}
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-2.5 size-4 text-slate-400" />
                  <Input
                    placeholder="Search by product name, SKU, or specs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9.5 h-10 rounded-xl bg-slate-900 border-slate-700 text-sm text-white placeholder:text-slate-500"
                  />
                </div>

                {/* Category Filter */}
                <Select value={selectedCategoryFilter} onValueChange={setSelectedCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48 h-10 rounded-xl bg-slate-900 border-slate-700 text-xs text-white">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="all" className="text-xs">All Categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.name} ({c.markupPercentage}%)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Image Filter */}
                <Select value={imageFilter} onValueChange={(v: "all" | "has-image" | "no-image") => setImageFilter(v)}>
                  <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl bg-slate-900 border-slate-700 text-xs text-white">
                    <SelectValue placeholder="Image Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="all" className="text-xs">All Images</SelectItem>
                    <SelectItem value="has-image" className="text-xs">Has Image</SelectItem>
                    <SelectItem value="no-image" className="text-xs">Missing Image (Placeholder)</SelectItem>
                  </SelectContent>
                </Select>

                {/* Price Override Filter */}
                <Select value={priceFilter} onValueChange={(v: "all" | "calculated" | "overridden") => setPriceFilter(v)}>
                  <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl bg-slate-900 border-slate-700 text-xs text-white">
                    <SelectValue placeholder="Price Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="all" className="text-xs">All Pricing</SelectItem>
                    <SelectItem value="calculated" className="text-xs">Rule-Based</SelectItem>
                    <SelectItem value="overridden" className="text-xs">Manual Override</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sorting */}
                <Select value={sortBy} onValueChange={(v: "name" | "price-asc" | "price-desc" | "stock") => setSortBy(v)}>
                  <SelectTrigger className="w-full sm:w-40 h-10 rounded-xl bg-slate-900 border-slate-700 text-xs text-white">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl bg-slate-900 border-slate-700 text-white">
                    <SelectItem value="name" className="text-xs">Sort: Name (A-Z)</SelectItem>
                    <SelectItem value="price-asc" className="text-xs">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc" className="text-xs">Price: High to Low</SelectItem>
                    <SelectItem value="stock" className="text-xs">Stock Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>
                  Showing <strong className="text-white">{filteredProducts.length}</strong> of {products.length} products
                </span>
                {(searchQuery || selectedCategoryFilter !== "all" || imageFilter !== "all" || priceFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategoryFilter("all");
                      setImageFilter("all");
                      setPriceFilter("all");
                    }}
                    className="text-blue-400 hover:text-blue-300 text-xs"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Item & SKU</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3 text-right">Base Cost (₹)</th>
                      <th className="py-3 px-3 text-right">Category Markup</th>
                      <th className="py-3 px-3 text-right">Final Selling Price (₹)</th>
                      <th className="py-3 px-3 text-center">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          <Package className="size-8 mx-auto mb-2 text-slate-600" />
                          <p className="text-sm font-semibold">No products match your filters</p>
                          <p className="text-xs text-slate-400 mt-1">Try resetting filters or adding a new product</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const cat = categories.find((c) => c.id === p.categoryId);
                        const markupPct = cat?.markupPercentage ?? p.markupPercentage ?? 15;
                        const markupAmount = Math.round(((p.basePrice * markupPct) / 100) * 100) / 100;

                        return (
                          <tr key={p.sku} className="hover:bg-slate-800/60 transition-colors">
                            {/* Product Info + Thumbnail */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <ProductImage
                                  src={p.image}
                                  alt={p.name}
                                  category={p.categoryId}
                                  size="md"
                                  className="rounded-xl shadow-xs"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-bold text-white text-sm truncate max-w-xs">
                                      {p.name}
                                    </span>
                                    {p.badge && (
                                      <Badge className="bg-blue-950 text-blue-300 border-blue-800 text-[9px] px-1.5 py-0">
                                        {p.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-mono">
                                    <span>SKU: {p.sku}</span>
                                    <span>•</span>
                                    <span className={p.image ? "text-emerald-400" : "text-amber-400"}>
                                      {p.image ? "Has Image" : "Default Placeholder"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-3">
                              <Badge
                                variant="outline"
                                className="bg-slate-900 border-slate-700 text-slate-300 text-xs font-medium"
                              >
                                {cat?.name || p.categoryId}
                              </Badge>
                            </td>

                            {/* Base Price */}
                            <td className="py-3 px-3 text-right font-mono font-semibold text-slate-300">
                              {formatINR(p.basePrice)}
                            </td>

                            {/* Category Markup % */}
                            <td className="py-3 px-3 text-right">
                              <div className="font-mono text-blue-400 font-bold">
                                +{markupPct}%
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                (+{formatINR(markupAmount)})
                              </span>
                            </td>

                            {/* Final Selling Price with Override Indicator */}
                            <td className="py-3 px-3 text-right">
                              <div className="font-mono text-sm font-extrabold text-white">
                                {formatINR(p.sellingPrice)}
                              </div>
                              {p.isPriceOverridden ? (
                                <span className="inline-block px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-800 text-[9px] font-bold text-amber-300">
                                  Manual Override
                                </span>
                              ) : (
                                <span className="text-[10px] text-emerald-400 font-medium">
                                  Rule-Based
                                </span>
                              )}
                            </td>

                            {/* Stock */}
                            <td className="py-3 px-3 text-center">
                              <span
                                className={`font-mono text-xs font-bold ${
                                  p.stock <= 5
                                    ? "text-rose-400"
                                    : p.stock <= 20
                                    ? "text-amber-400"
                                    : "text-emerald-400"
                                }`}
                              >
                                {p.stock}
                              </span>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                {p.isPriceOverridden && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleResetOverride(p.sku)}
                                    className="size-8 p-0 rounded-lg text-amber-400 hover:text-amber-300 hover:bg-amber-950/50"
                                    title="Reset to category markup formula"
                                  >
                                    <RotateCcw className="size-3.5" />
                                  </Button>
                                )}

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedProduct(p);
                                    setProductDialogOpen(true);
                                  }}
                                  className="size-8 p-0 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700"
                                  title="Edit product details & pricing"
                                >
                                  <Edit className="size-3.5" />
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setDeleteConfirm({
                                      open: true,
                                      type: "product",
                                      id: p.sku,
                                      name: p.name,
                                    })
                                  }
                                  className="size-8 p-0 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                                  title="Delete product"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CATEGORIES MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg">
              <div>
                <h3 className="text-base font-bold text-white">Product Categories</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Organize products by category and assign percentage-based pricing markup rules.
                </p>
              </div>

              <Button
                onClick={() => {
                  setSelectedCategory(null);
                  setCategoryDialogOpen(true);
                }}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold h-9 shadow-md shadow-blue-600/30 gap-1.5"
              >
                <Plus className="size-3.5" />
                <span>Create New Category</span>
              </Button>
            </div>

            {/* Categories Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((c) => {
                const catProducts = products.filter((p) => p.categoryId === c.id);
                const count = catProducts.length;
                const sampleCalculated = calculateSellingPrice(100, c.markupPercentage);

                return (
                  <div
                    key={c.id}
                    className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg flex flex-col justify-between space-y-4 hover:border-slate-600 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                          Slug: {c.id}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedCategory(c);
                              setCategoryDialogOpen(true);
                            }}
                            className="size-7 p-0 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
                            title="Edit Category & Markup"
                          >
                            <Edit className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                type: "category",
                                id: c.id,
                                name: c.name,
                              })
                            }
                            className="size-7 p-0 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40"
                            title="Delete Category"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-white tracking-tight">{c.name}</h4>
                        <p className="text-xs text-blue-400 font-medium">{c.tagline}</p>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {c.description || "No description provided."}
                      </p>

                      {/* Pricing Rule Card */}
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-300">Category Markup Rule:</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-700 text-blue-300 text-xs font-bold font-mono">
                            +{c.markupPercentage}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-1.5 font-mono">
                          <span>Base ₹100:</span>
                          <ArrowRight className="size-3 text-slate-500" />
                          <strong className="text-emerald-400">Selling {formatINR(sampleCalculated)}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        Assigned: <strong className="text-white">{count} products</strong>
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCategoryFilter(c.id);
                          setActiveTab("products");
                        }}
                        className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                      >
                        View Products <ChevronRight className="size-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: PRICING RULES CONFIGURATION */}
        {/* ============================================================== */}
        {activeTab === "pricing" && (
          <div className="space-y-6">
            {/* Rule Configuration Header */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-800/60 to-indigo-950/40 border border-blue-900/50 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="grid size-8 place-items-center rounded-xl bg-blue-600 text-white font-bold">
                      <Percent className="size-4" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Category-Based Pricing Configuration</h3>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Set a percentage-based pricing rule for each product category. The system calculates selling prices automatically using:{" "}
                    <strong className="text-blue-300 font-mono">
                      Selling Price = Base Price + (Base Price × Category Markup % ÷ 100)
                    </strong>.
                  </p>
                </div>

                <Button
                  onClick={() => setPricingCalculatorOpen(true)}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold h-9 shadow-md shadow-blue-600/30 gap-1.5"
                >
                  <Calculator className="size-3.5" />
                  <span>Open Simulator</span>
                </Button>
              </div>

              {/* Behavior Note Card on Price Overrides */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <AlertTriangle className="size-4 shrink-0" />
                  <span>Individual Product Overrides Protection Policy</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  When an administrator updates a category's markup percentage, all products in that category are recalculated automatically. Products with an active manual price override (e.g. promotional deals or vendor discounts) are safely protected and will <strong>NOT</strong> have their overridden price overwritten.
                </p>
              </div>
            </div>

            {/* Category Markup Percentages Table */}
            <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg space-y-4">
              <h4 className="text-sm font-bold text-white">Active Category Markup Percentages</h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Markup Percentage (%)</th>
                      <th className="py-2.5 px-3 text-right">Sample Base Price (₹)</th>
                      <th className="py-2.5 px-3 text-right">Calculated Selling Price (₹)</th>
                      <th className="py-2.5 px-3 text-center">Products Bound</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {categories.map((c) => {
                      const count = products.filter((p) => p.categoryId === c.id).length;
                      const sampleCalculated = calculateSellingPrice(100, c.markupPercentage);

                      return (
                        <tr key={c.id} className="hover:bg-slate-800/60 transition-colors">
                          <td className="py-3.5 px-3">
                            <span className="font-bold text-white text-sm block">{c.name}</span>
                            <span className="text-[10px] text-slate-400">{c.tagline}</span>
                          </td>

                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="0"
                                step="0.5"
                                defaultValue={c.markupPercentage}
                                onBlur={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val) && val !== c.markupPercentage) {
                                    handleUpdateCategoryMarkup(c.id, val);
                                  }
                                }}
                                className="w-24 h-8 rounded-lg bg-slate-900 border-slate-700 font-bold font-mono text-blue-300 text-xs"
                              />
                              <span className="font-bold text-slate-400 text-xs">%</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-3 text-right font-mono text-slate-400">
                            ₹100.00
                          </td>

                          <td className="py-3.5 px-3 text-right font-mono font-extrabold text-emerald-400">
                            {formatINR(sampleCalculated)}
                          </td>

                          <td className="py-3.5 px-3 text-center">
                            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 text-xs font-semibold">
                              {count} items
                            </span>
                          </td>

                          <td className="py-3.5 px-3 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedCategory(c);
                                setCategoryDialogOpen(true);
                              }}
                              className="h-7 text-xs rounded-lg border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                            >
                              Edit Rule
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Overridden Products List */}
            {stats.overriddenPriceCount > 0 && (
              <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-900/50 shadow-lg space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                      <Sliders className="size-4" />
                      Products with Custom Price Overrides ({stats.overriddenPriceCount})
                    </h4>
                    <p className="text-xs text-amber-200/70">
                      These products ignore the category markup percentage and use an explicit selling price.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-amber-900/60 text-amber-300/80 uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Product</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3 text-right">Base Cost (₹)</th>
                        <th className="py-2.5 px-3 text-right">Rule Calculated (₹)</th>
                        <th className="py-2.5 px-3 text-right">Active Override (₹)</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-900/40">
                      {products
                        .filter((p) => p.isPriceOverridden)
                        .map((p) => {
                          const cat = categories.find((c) => c.id === p.categoryId);
                          const calculated = calculateSellingPrice(p.basePrice, cat?.markupPercentage ?? 15);

                          return (
                            <tr key={p.sku} className="hover:bg-amber-950/30">
                              <td className="py-3 px-3 font-semibold text-white">
                                {p.name} ({p.sku})
                              </td>
                              <td className="py-3 px-3 text-slate-300">
                                {cat?.name || p.categoryId}
                              </td>
                              <td className="py-3 px-3 text-right font-mono text-slate-400">
                                {formatINR(p.basePrice)}
                              </td>
                              <td className="py-3 px-3 text-right font-mono text-slate-400 line-through">
                                {formatINR(calculated)}
                              </td>
                              <td className="py-3 px-3 text-right font-mono font-extrabold text-amber-300">
                                {formatINR(p.sellingPrice)}
                              </td>
                              <td className="py-3 px-3 text-right">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResetOverride(p.sku)}
                                  className="h-7 text-xs rounded-lg border-amber-800 bg-amber-950/60 text-amber-200 hover:bg-amber-900 gap-1"
                                >
                                  <RotateCcw className="size-3" /> Revert to Category Rule
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: MEDIA & IMAGE MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === "images" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ImageIcon className="size-4 text-blue-400" />
                  Product Media & Image Library
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Organize, preview, and replace product images. Products without images display the clean default category placeholder.
                </p>
              </div>

              <Button
                onClick={() => setImageUploadOpen(true)}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold h-9 shadow-md shadow-blue-600/30 gap-1.5"
              >
                <Upload className="size-3.5" />
                <span>Upload Product Image</span>
              </Button>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <Select value={mediaCategoryFilter} onValueChange={setMediaCategoryFilter}>
                <SelectTrigger className="w-48 h-9 rounded-xl bg-slate-800 border-slate-700 text-xs text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="all" className="text-xs">All Categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={mediaAssignmentFilter} onValueChange={(v: "all" | "assigned" | "unassigned") => setMediaAssignmentFilter(v)}>
                <SelectTrigger className="w-44 h-9 rounded-xl bg-slate-800 border-slate-700 text-xs text-white">
                  <SelectValue placeholder="Assignment Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="all" className="text-xs">All Images</SelectItem>
                  <SelectItem value="assigned" className="text-xs">Linked to a Product</SelectItem>
                  <SelectItem value="unassigned" className="text-xs">Unlinked / Available</SelectItem>
                </SelectContent>
              </Select>

              <span className="text-xs text-slate-400 ml-auto">
                {filteredMedia.length} media items
              </span>
            </div>

            {/* Media Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((m) => {
                const prod = products.find((p) => p.sku === m.productSku || p.image === m.url);

                return (
                  <div
                    key={m.id}
                    className="group relative rounded-2xl bg-slate-800/60 border border-slate-700/80 overflow-hidden shadow-md flex flex-col justify-between"
                  >
                    <div className="aspect-square bg-slate-900 overflow-hidden relative">
                      <img
                        src={m.url}
                        alt={m.filename}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            type: "media",
                            id: m.id,
                            name: m.filename,
                          })
                        }
                        className="absolute top-2 right-2 size-7 rounded-lg bg-slate-950/80 text-slate-400 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        title="Delete image"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <div className="p-3 space-y-1">
                      <span className="text-xs font-semibold text-white block truncate" title={m.filename}>
                        {m.filename}
                      </span>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{(m.sizeBytes / 1024).toFixed(0)} KB</span>
                        {prod ? (
                          <span className="text-blue-400 font-medium truncate max-w-20" title={prod.name}>
                            {prod.sku}
                          </span>
                        ) : (
                          <span className="text-slate-500">Unlinked</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Product Add/Edit Dialog */}
      <ProductEditDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        product={selectedProduct}
        categories={categories}
        mediaList={media}
        onSave={handleSaveProduct}
        onUploadImage={async (file) => {
          const reader = new FileReader();
          return new Promise((resolve, reject) => {
            reader.onload = async () => {
              try {
                const rec = await uploadImageFn({
                  data: {
                    filename: file.name,
                    dataUrl: reader.result as string,
                  },
                });
                setMedia((prev) => [rec, ...prev]);
                resolve(rec.url);
              } catch (err) {
                reject(err);
              }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }}
      />

      {/* Category Add/Edit Dialog */}
      <CategoryEditDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        category={selectedCategory}
        onSave={handleSaveCategory}
      />

      {/* Pricing Calculator Modal */}
      <PricingCalculatorModal
        open={pricingCalculatorOpen}
        onOpenChange={setPricingCalculatorOpen}
        categories={categories}
        onGoToRules={() => setActiveTab("pricing")}
      />

      {/* Bulk Import CSV Dialog */}
      <BulkImportDialog
        open={bulkImportOpen}
        onOpenChange={setBulkImportOpen}
        categories={categories}
        onImport={handleBulkImport}
      />

      {/* Image Upload Dialog */}
      <ImageUploadDialog
        open={imageUploadOpen}
        onOpenChange={setImageUploadOpen}
        categories={categories}
        products={products}
        onUpload={handleUploadImage}
      />

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteConfirm.open} onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}>
        <AlertDialogContent className="rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold text-white">
              Confirm Delete {deleteConfirm.type}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-400">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-200">"{deleteConfirm.name}"</strong>? This action will update the catalog backend and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-xl border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-600/30"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
