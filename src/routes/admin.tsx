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
  syncProductsFromPosFn,
  updateOrderStatusFn,
  deleteOrderFn,
  assignProductsToCategoryFn,
} from "@/lib/catalog-store";
import {
  type ProductRecord,
  type CategoryRecord,
  type MediaRecord,
  type OrderRecord,
  type OrderStatus,
  formatLKR,
  formatINR,
  calculateSellingPrice,
} from "@/lib/catalog-types";
import { usePWA } from "@/hooks/usePWA";
import { ProductImage } from "@/components/admin/ProductImage";
import { ProductEditDialog } from "@/components/admin/ProductEditDialog";
import { CategoryEditDialog } from "@/components/admin/CategoryEditDialog";
import { PricingCalculatorModal } from "@/components/admin/PricingCalculatorModal";
import { BulkImportDialog } from "@/components/admin/BulkImportDialog";
import { ImageUploadDialog } from "@/components/admin/ImageUploadDialog";
import { PosCategoryImportModal } from "@/components/admin/PosCategoryImportModal";
import { Checkbox } from "@/components/ui/checkbox";
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
  Lock,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  Database,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  Calendar,
  Truck,
  Check,
  ChevronDown,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    return await fetchAdminCatalogFn();
  },
  component: AdminDashboard,
});

const ADMIN_STORAGE_KEY = "lasertronics_admin_authenticated";
const ADMIN_PASSCODE = "admin123";

function AdminDashboard() {
  const initialData = Route.useLoaderData();
  const { isOnline, isInstallable, triggerInstall } = usePWA();
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(isOnline);

  // Security Gate Authentication (Isolated from public site)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(ADMIN_STORAGE_KEY) === "true";
  });
  const [passcodeInput, setPasscodeInput] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (passcodeInput.trim() === ADMIN_PASSCODE) {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
      setIsAuthenticated(true);
      setAuthError("");
      toast.success("Admin portal unlocked");
    } else {
      setAuthError("Incorrect passcode. Access denied.");
      toast.error("Incorrect passcode");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAuthenticated(false);
    setPasscodeInput("");
    toast.info("Admin portal locked");
  };

  // Master State
  const [categories, setCategories] = useState<CategoryRecord[]>(initialData.categories);
  const [products, setProducts] = useState<ProductRecord[]>(initialData.products);
  const [media, setMedia] = useState<MediaRecord[]>(initialData.media);
  const [orders, setOrders] = useState<OrderRecord[]>(initialData.orders || []);
  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "products" | "categories" | "pricing" | "images"
  >("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Orders State & Filtering
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<OrderRecord | null>(null);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Dialog States
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductRecord | null>(null);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryRecord | null>(null);

  const [pricingCalculatorOpen, setPricingCalculatorOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);

  // POS Category Importer Dialog State
  const [posCategoryModalOpen, setPosCategoryModalOpen] = useState(false);
  const [posCategoryModalTarget, setPosCategoryModalTarget] = useState<string | undefined>(undefined);

  // Products Tab Multi-Select & Batch Category Assignment
  const [selectedProductSkus, setSelectedProductSkus] = useState<Set<string>>(new Set());
  const [bulkTargetCategory, setBulkTargetCategory] = useState<string>("");
  const [isBulkAssigning, setIsBulkAssigning] = useState(false);

  // Delete Confirmation State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "product" | "category" | "media" | "order";
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
  const [bulkMarginValue, setBulkMarginValue] = useState<number>(20);

  // Apply bulk margin to all categories (e.g. 20%)
  const handleApplyBulkMargin = async (pct: number) => {
    if (isNaN(pct) || pct < 0) return;
    try {
      setIsRefreshing(true);
      for (const cat of categories) {
        await updateCategoryMarkupFn({ data: { categoryId: cat.id, markupPercentage: pct } });
      }
      toast.success(`Successfully set ${pct}% margin across all ${categories.length} categories! Selling prices recalculated.`);
      await refreshData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to apply bulk category margin");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Refresh data from server
  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetchAdminCatalogFn();
      setCategories(res.categories);
      setProducts(res.products);
      setMedia(res.media);
      setOrders(res.orders || []);
      setIsLiveConnected(true);
      toast.success("Catalog & orders synced with backend server.");
    } catch {
      setIsLiveConnected(false);
      toast.error("Failed to sync with backend server.");
    } finally {
      setIsRefreshing(false);
    }
  };

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

    const pendingOrdersCount = orders.filter((o) => o.status === "pending").length;
    const totalRevenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);

    return {
      totalProducts: products.length,
      totalCategories: categories.length,
      productsWithoutImages,
      overriddenPriceCount,
      totalStockValue,
      avgMarkup,
      totalOrders: orders.length,
      pendingOrdersCount,
      totalRevenue,
    };
  }, [products, categories, orders]);

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

  // Pagination & Live POS Sync
  const PRODUCTS_PER_PAGE = 50;
  const [productsPage, setProductsPage] = useState(1);
  const [isSyncingPos, setIsSyncingPos] = useState(false);

  useEffect(() => {
    setProductsPage(1);
  }, [searchQuery, selectedCategoryFilter, imageFilter, priceFilter, sortBy]);

  const totalFilteredProducts = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredProducts / PRODUCTS_PER_PAGE));
  const currentPage = Math.min(Math.max(1, productsPage), totalPages);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleSyncPos = async (inStockOnly = true) => {
    try {
      setIsSyncingPos(true);
      toast.loading("Fetching live products from InTouch POS ERP...", { id: "pos-sync" });
      const res = await syncProductsFromPosFn({ data: inStockOnly });
      if (res.success) {
        toast.success(
          `Successfully synced ${res.syncedCount.toLocaleString()} products from InTouch POS! (${res.newAdded} added, ${res.updated} updated)`,
          { id: "pos-sync", duration: 6000 }
        );
        await refreshData();
        setProductsPage(1);
      } else {
        toast.error("Failed to complete POS sync", { id: "pos-sync" });
      }
    } catch (err: unknown) {
      console.error("POS sync error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to fetch products from InTouch POS", { id: "pos-sync" });
    } finally {
      setIsSyncingPos(false);
    }
  };

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

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    let list = [...orders];

    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.toLowerCase().includes(q) ||
          o.customer.city.toLowerCase().includes(q) ||
          o.customer.address.toLowerCase().includes(q) ||
          o.items.some((it) => it.name.toLowerCase().includes(q) || it.sku.toLowerCase().includes(q))
      );
    }

    if (orderStatusFilter !== "all") {
      list = list.filter((o) => o.status === orderStatusFilter);
    }

    return list;
  }, [orders, orderSearchQuery, orderStatusFilter]);

  // Order Actions
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setIsUpdatingOrder(true);
      const updated = await updateOrderStatusFn({ data: { orderId, status } });
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrderDetails?.id === orderId) {
        setSelectedOrderDetails(updated);
      }
      toast.success(`Order #${orderId} marked as ${status.toUpperCase()}!`);
      await refreshData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update order status");
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderFn({ data: orderId });
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      if (selectedOrderDetails?.id === orderId) {
        setSelectedOrderDetails(null);
      }
      toast.success(`Order #${orderId} deleted.`);
      await refreshData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to delete order");
    }
  };

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
    } else if (type === "order") {
      await handleDeleteOrder(id);
    }
    setDeleteConfirm({ open: false, type: "product", id: "", name: "" });
  };

  // Bulk Assign Selected Products to Category
  const handleBulkAssignCategory = async () => {
    if (selectedProductSkus.size === 0 || !bulkTargetCategory) {
      toast.warning("Please select at least one product and a target category.");
      return;
    }
    try {
      setIsBulkAssigning(true);
      const res = await assignProductsToCategoryFn({
        data: {
          productSkus: Array.from(selectedProductSkus),
          categoryId: bulkTargetCategory,
        },
      });
      toast.success(
        `Successfully moved ${res.updatedCount} products into "${res.categoryName}"! Pricing recalculated with +${res.markupPercentage}% markup.`
      );
      setSelectedProductSkus(new Set());
      await refreshData();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to assign products to category");
    } finally {
      setIsBulkAssigning(false);
    }
  };

  // Open POS Category Importer Modal for a specific category
  const handleOpenPosCategoryModal = (categoryId?: string) => {
    setPosCategoryModalTarget(categoryId);
    setPosCategoryModalOpen(true);
  };

  // Security Gate: Private standalone portal screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
        <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="text-center">
            <div className="mx-auto size-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 ring-4 ring-blue-500/10">
              <Shield className="size-7" />
            </div>
            <h1 className="mt-5 font-display text-xl font-bold tracking-tight text-white">
              Lasertronics Admin Portal
            </h1>
            <p className="mt-1.5 text-xs text-slate-400">
              Private Management Hub • Authorized Access Only
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Security Key / Passcode
              </label>
              <div className="relative">
                <Input
                  type={showPasscode ? "text" : "password"}
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  placeholder="Enter passcode (default: admin123)"
                  autoFocus
                  className="bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-600 pr-10 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 cursor-pointer"
                  aria-label={showPasscode ? "Hide passcode" : "Show passcode"}
                >
                  {showPasscode ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {authError && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="size-3.5 shrink-0" /> {authError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
            >
              <Lock className="size-3.5 mr-2" /> Unlock Dashboard
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <Link
              to="/"
              className="text-xs text-slate-400 hover:text-slate-200 inline-flex items-center gap-1.5 transition-colors"
            >
              <ArrowRight className="size-3.5 rotate-180" /> Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col antialiased selection:bg-blue-600 selection:text-white">

      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Brand & Identity */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="size-8 sm:size-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-lg shadow-blue-500/20 shrink-0">
              <Shield className="size-4 sm:size-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-xs sm:text-base tracking-tight text-white truncate">
                  Lasertronics Admin
                </span>
                <Badge
                  variant="outline"
                  className="bg-blue-950/80 text-blue-400 border-blue-800/80 text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0 shrink-0"
                >
                  v1.0
                </Badge>
              </div>
              <span className="text-[10px] text-slate-400 hidden md:block font-medium truncate">
                Product, Category & Pricing Control Hub
              </span>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Live Server / Offline Indicator */}
            {isOnline && isLiveConnected ? (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-medium border bg-emerald-950/50 border-emerald-800 text-emerald-400 shrink-0 whitespace-nowrap">
                <span className="size-1.5 sm:size-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="hidden sm:inline">Live Catalog Connected</span>
                <span className="sm:hidden font-semibold">Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-medium border bg-amber-950/50 border-amber-800 text-amber-400 shrink-0 whitespace-nowrap">
                <span className="size-1.5 sm:size-2 rounded-full bg-amber-400 shrink-0" />
                <span className="hidden sm:inline">Offline / Local Mode</span>
                <span className="sm:hidden font-semibold">Offline</span>
              </div>
            )}

            {/* Quick Add Product Button (mobile only - frees up nav space below) */}
            <Button
              size="sm"
              onClick={() => {
                setSelectedProduct(null);
                setProductDialogOpen(true);
              }}
              className="sm:hidden size-8 p-0 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/30 shrink-0 cursor-pointer"
              title="Add Product"
            >
              <Plus className="size-4" />
            </Button>

            {/* Fetch Live Products from InTouch POS */}
            <div className="inline-flex rounded-xl shadow-md shadow-blue-600/25 shrink-0 overflow-hidden">
              <Button
                size="sm"
                onClick={() => handleSyncPos(true)}
                disabled={isSyncingPos || isRefreshing}
                className="h-8 rounded-none rounded-l-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold gap-1.5 cursor-pointer px-2 sm:px-3 border-r border-blue-400/30"
                title="Fetch live active in-stock products from InTouch POS ERP"
              >
                <RefreshCw className={`size-3.5 shrink-0 ${isSyncingPos ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">{isSyncingPos ? "Syncing POS..." : "Fetch POS Products"}</span>
                <span className="sm:hidden">{isSyncingPos ? "..." : "POS"}</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    disabled={isSyncingPos || isRefreshing}
                    className="h-8 px-1.5 rounded-none rounded-r-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs cursor-pointer"
                    title="More POS Sync Options"
                  >
                    <ChevronDown className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800 text-slate-200 text-xs w-72">
                  <DropdownMenuItem
                    onClick={() => handleSyncPos(true)}
                    className="cursor-pointer gap-2 py-2"
                  >
                    <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white block">Fetch In-Stock POS Products</span>
                      <span className="text-[10px] text-slate-400 block">Syncs active products with stock &gt; 0 (Recommended)</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSyncPos(false)}
                    className="cursor-pointer gap-2 py-2"
                  >
                    <Database className="size-3.5 text-blue-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white block">Fetch ALL POS Products</span>
                      <span className="text-[10px] text-slate-400 block">Syncs every single item in POS (including zero stock)</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Refresh Sync */}
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshData}
              disabled={isRefreshing}
              className="size-8 p-0 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 shrink-0 cursor-pointer"
              title="Refresh Catalog Data"
            >
              <RefreshCw className={`size-3.5 sm:size-4 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
            </Button>

            {/* Public Storefront Link */}
            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 size-8 sm:size-auto sm:px-3 sm:py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors shrink-0"
              title="View Public Storefront"
            >
              <ExternalLink className="size-3.5 text-slate-400" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>

            {/* Lock / Sign Out */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border-slate-800 bg-slate-900/80 size-8 sm:size-auto sm:px-2.5 sm:py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-800/60 transition-colors h-8 cursor-pointer shrink-0"
              title="Lock Admin Portal"
            >
              <LogOut className="size-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Navigation Sub-Bar */}
      <nav className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-md sticky top-14 sm:top-16 z-30">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-1.5 sm:py-2">
          <div className="flex items-center justify-between gap-2">
            {/* Scrollable Tabs Track */}
            <div className="touch-scroll-x flex items-center gap-1 sm:gap-1.5 w-full sm:flex-1 py-0.5">
              <button
                onClick={() => setActiveTab("overview")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <LayoutDashboard className="size-3.5 shrink-0" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab("orders")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <ShoppingBag className="size-3.5 shrink-0" />
                <span>Orders ({orders.length})</span>
                {stats.pendingOrdersCount > 0 && (
                  <span className="size-4 rounded-full bg-amber-500 text-amber-950 font-bold text-[10px] flex items-center justify-center shrink-0" title={`${stats.pendingOrdersCount} pending orders`}>
                    {stats.pendingOrdersCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === "products"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Package className="size-3.5 shrink-0" />
                <span>Products ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("categories")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === "categories"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <FolderTree className="size-3.5 shrink-0" />
                <span>Categories ({categories.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("pricing")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === "pricing"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Percent className="size-3.5 shrink-0" />
                <span>Pricing Rules</span>
                {stats.overriddenPriceCount > 0 && (
                  <span className="size-4 rounded-full bg-amber-500 text-amber-950 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {stats.overriddenPriceCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("images")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === "images"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <ImageIcon className="size-3.5 shrink-0" />
                <span>Media Library</span>
                {stats.productsWithoutImages > 0 && (
                  <span className="size-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0" title={`${stats.productsWithoutImages} products without images`}>
                    {stats.productsWithoutImages}
                  </span>
                )}
              </button>
            </div>

            {/* Quick Primary Actions (Tablet & Desktop only; on mobile, +Add is in header) */}
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Button
                size="sm"
                onClick={() => handleSyncPos(true)}
                disabled={isSyncingPos}
                className="h-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold gap-1.5 shadow-md shadow-blue-600/20 shrink-0 cursor-pointer px-2.5 sm:px-3"
                title="Fetch products from InTouch POS ERP"
              >
                <RefreshCw className={`size-3.5 shrink-0 ${isSyncingPos ? "animate-spin" : ""}`} />
                <span>{isSyncingPos ? "Fetching POS..." : "Fetch POS"}</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setBulkImportOpen(true)}
                className="h-8 rounded-xl border-slate-700 bg-slate-800/60 hover:bg-slate-700 text-slate-200 text-xs gap-1.5 hidden md:inline-flex cursor-pointer"
              >
                <Upload className="size-3.5 text-slate-400" />
                <span>Bulk CSV</span>
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  setSelectedProduct(null);
                  setProductDialogOpen(true);
                }}
                className="h-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold gap-1 sm:gap-1.5 shadow-md shadow-blue-600/20 shrink-0 cursor-pointer px-2.5 sm:px-3"
              >
                <Plus className="size-3.5 shrink-0" />
                <span>Add Product</span>
              </Button>
            </div>
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
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Total Products</span>
                  <div className="size-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <Package className="size-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {stats.totalProducts.toLocaleString()}
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Across {stats.totalCategories} active categories
                  </p>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("orders")}
                className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-800/60 to-indigo-950/40 border border-blue-800/40 hover:border-blue-700 shadow-lg cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Customer Orders</span>
                  <div className="size-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <ShoppingBag className="size-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {stats.totalOrders}
                    </span>
                    {stats.pendingOrdersCount > 0 && (
                      <span className="text-[10px] font-bold text-amber-300 bg-amber-950/90 px-1.5 py-0.5 rounded-full border border-amber-800">
                        {stats.pendingOrdersCount} new
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Rev: <strong className="text-emerald-400 font-mono">{formatLKR(stats.totalRevenue)}</strong>
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

              <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/60 shadow-lg col-span-2 lg:col-span-1">
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

            {/* InTouch POS ERP Integration Banner Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-800/60 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="size-11 sm:size-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0 shadow-inner">
                  <Database className="size-5 sm:size-6 text-blue-400" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-white">InTouch POS ERP Live Integration</h3>
                    <Badge className="bg-emerald-950/90 text-emerald-300 border-emerald-800 text-[10px] font-mono px-2 py-0.5">
                      <CheckCircle2 className="size-3 mr-1 inline" /> Live POS Connected
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    Direct live connection to InTouch POS (<span className="font-mono text-blue-300">shsx9584.intouchconnects.com</span>). Fetches active inventory, variations, purchase prices, stock quantities, and automatically computes selling prices in LKR using category markup rules.
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono flex-wrap">
                    <span>Active POS Products: <strong className="text-white">{stats.totalProducts.toLocaleString()}</strong></span>
                    <span>•</span>
                    <span>Currency: <strong className="text-emerald-400 font-bold">LKR (Sri Lankan Rupee)</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto">
                <Button
                  onClick={() => handleSyncPos(true)}
                  disabled={isSyncingPos}
                  className="w-full md:w-auto h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <RefreshCw className={`size-4 ${isSyncingPos ? "animate-spin" : ""}`} />
                  {isSyncingPos ? "Fetching from POS..." : "Sync POS Products Now"}
                </Button>
              </div>
            </div>

            {/* Recent Orders Overview Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="size-4 text-blue-400" />
                    Recent Customer Orders
                    {stats.pendingOrdersCount > 0 && (
                      <Badge className="bg-amber-950/80 text-amber-300 border-amber-800 text-[10px] font-mono px-2 py-0.5">
                        {stats.pendingOrdersCount} Pending
                      </Badge>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live customer orders submitted through the online store checkout
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("orders")}
                  className="h-8 rounded-xl border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  View All Orders ({orders.length}) <ChevronRight className="size-3.5 ml-1" />
                </Button>
              </div>

              {orders.length === 0 ? (
                <div className="py-8 text-center rounded-xl bg-slate-900/40 border border-slate-800/80 p-6 space-y-2">
                  <ShoppingBag className="size-8 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold text-slate-300">No customer orders placed yet</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When customers place orders via checkout, they will instantly appear here with customer phone, delivery address, items, and LKR totals.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Order ID & Date</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Phone & City</th>
                        <th className="py-2.5 px-3 text-center">Items</th>
                        <th className="py-2.5 px-3 text-right">Total (LKR)</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-white block">#{o.id}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {new Date(o.createdAt).toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-semibold text-slate-200 block">{o.customer.name}</span>
                            <span className="text-[10px] text-slate-400">{o.customer.email}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono text-slate-300 block">{o.customer.phone}</span>
                            <span className="text-[10px] text-slate-400">{o.customer.city}</span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 text-[10px]">
                              {o.items.reduce((s, it) => s + it.quantity, 0)} items
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-extrabold text-white">
                            {formatLKR(o.total)}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge
                              className={`text-[10px] px-2 py-0.5 font-bold capitalize ${
                                o.status === "pending"
                                  ? "bg-amber-950/80 text-amber-300 border-amber-800"
                                  : o.status === "confirmed"
                                  ? "bg-blue-950/80 text-blue-300 border-blue-800"
                                  : o.status === "dispatched"
                                  ? "bg-purple-950/80 text-purple-300 border-purple-800"
                                  : o.status === "delivered"
                                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                                  : "bg-rose-950/80 text-rose-300 border-rose-800"
                              }`}
                            >
                              {o.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedOrderDetails(o);
                                setActiveTab("orders");
                              }}
                              className="h-7 px-2 text-xs rounded-lg text-blue-400 hover:text-white hover:bg-blue-600/20"
                            >
                              Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Middle Split: Category Markup Breakdown & Quick Calculator Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Category Pricing Rules Card */}
              <div className="lg:col-span-2 p-4 sm:p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                    className="h-8 rounded-xl border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 shrink-0 self-start sm:self-auto cursor-pointer"
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
                            LKR 100 → <strong className="text-emerald-400">{formatLKR(sampleCalculated)}</strong>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Launchpad & Catalog Status */}
              <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-indigo-950/40 border border-blue-900/40 shadow-lg space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                      <Calculator className="size-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Live Pricing Simulator</h4>
                      <p className="text-[11px] text-slate-400">Test base prices across categories</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Test how changing a category's percentage affects profit margins and final selling prices in Sri Lankan Rupees (LKR).
                  </p>

                  <Button
                    onClick={() => setPricingCalculatorOpen(true)}
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold h-10 shadow-md shadow-blue-600/30 gap-2 cursor-pointer"
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
                    <span>Sync Status:</span>
                    <strong className="text-emerald-400">{isOnline ? "Active / Online" : "Offline Mode"}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Product Updates Preview Table */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                  className="h-8 rounded-xl border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  View All Products <ChevronRight className="size-3.5 ml-1" />
                </Button>
              </div>

              {/* Mobile Card List (screens < md) */}
              <div className="md:hidden divide-y divide-slate-800">
                {products.slice(0, 5).map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId);
                  return (
                    <div key={p.sku} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <ProductImage
                          src={p.image}
                          alt={p.name}
                          category={p.categoryId}
                          size="sm"
                          className="rounded-lg shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-semibold text-white text-xs block truncate">{p.name}</span>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 font-mono">
                            <span>{p.sku}</span>
                            <span>•</span>
                            <span className="text-slate-300 truncate">{cat?.name || p.categoryId}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono font-extrabold text-xs text-white block">
                          {formatINR(p.sellingPrice)}
                        </span>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          <span className="text-[10px] text-blue-400 font-mono">
                            +{cat?.markupPercentage ?? p.markupPercentage ?? 15}%
                          </span>
                          {p.isPriceOverridden ? (
                            <Badge className="bg-amber-950/80 text-amber-300 border-amber-800 text-[8px] px-1 py-0">
                              Overridden
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-950/80 text-emerald-300 border-emerald-800 text-[8px] px-1 py-0">
                              Calculated
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table (screens md and up) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[580px]">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Product</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Base Price (LKR)</th>
                      <th className="py-2.5 px-3 text-right">Markup %</th>
                      <th className="py-2.5 px-3 text-right">Selling Price (LKR)</th>
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
        {/* TAB: CUSTOMER ORDERS MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="size-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
                  <ShoppingBag className="size-6" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    Customer Orders Management
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {orders.length} Total
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live online orders placed by customers across Sri Lanka with real-time status updates and phone/WhatsApp contacts.
                  </p>
                </div>
              </div>

              {/* Status Counters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
                  <span className="text-slate-400 mr-1.5">Pending:</span>
                  <span className="font-bold text-amber-400">{orders.filter((o) => o.status === "pending").length}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
                  <span className="text-slate-400 mr-1.5">Confirmed:</span>
                  <span className="font-bold text-blue-400">{orders.filter((o) => o.status === "confirmed").length}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
                  <span className="text-slate-400 mr-1.5">Dispatched:</span>
                  <span className="font-bold text-purple-400">{orders.filter((o) => o.status === "dispatched").length}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
                  <span className="text-slate-400 mr-1.5">Delivered:</span>
                  <span className="font-bold text-emerald-400">{orders.filter((o) => o.status === "delivered").length}</span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-2.5 size-4 text-slate-400" />
                  <Input
                    placeholder="Search by Order ID (#LT-...), Customer Name, Phone, City, SKU..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="pl-10 h-9 rounded-xl bg-slate-800/80 border-slate-700 text-xs text-white placeholder:text-slate-400 focus-visible:ring-blue-500"
                  />
                  {orderSearchQuery && (
                    <button
                      onClick={() => setOrderSearchQuery("")}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="w-full sm:w-48">
                  <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                    <SelectTrigger className="h-9 rounded-xl bg-slate-800/80 border-slate-700 text-xs text-slate-200">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                      <SelectItem value="all">All Statuses ({orders.length})</SelectItem>
                      <SelectItem value="pending">Pending ({orders.filter((o) => o.status === "pending").length})</SelectItem>
                      <SelectItem value="confirmed">Confirmed ({orders.filter((o) => o.status === "confirmed").length})</SelectItem>
                      <SelectItem value="dispatched">Dispatched ({orders.filter((o) => o.status === "dispatched").length})</SelectItem>
                      <SelectItem value="delivered">Delivered ({orders.filter((o) => o.status === "delivered").length})</SelectItem>
                      <SelectItem value="cancelled">Cancelled ({orders.filter((o) => o.status === "cancelled").length})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Refresh */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={isRefreshing}
                  className="h-9 rounded-xl border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs gap-1.5 shrink-0"
                >
                  <RefreshCw className={`size-3.5 ${isRefreshing ? "animate-spin text-blue-400" : ""}`} />
                  Refresh
                </Button>
              </div>

              {/* Active Filter Indicators */}
              {(orderSearchQuery || orderStatusFilter !== "all") && (
                <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                  <span>Filtered: <strong>{filteredOrders.length}</strong> of {orders.length} orders</span>
                  <button
                    onClick={() => {
                      setOrderSearchQuery("");
                      setOrderStatusFilter("all");
                    }}
                    className="text-blue-400 hover:underline font-semibold ml-2"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>

            {/* Orders Content */}
            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800">
                <ShoppingBag className="size-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No Orders Found</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  {orders.length === 0
                    ? "No customer orders have been placed yet. When a customer adds items to cart and checks out, their order with name, phone, address and total LKR will appear here automatically!"
                    : "No orders match your current search or status filter. Try resetting filters."}
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-colors"
                >
                  <ExternalLink className="size-3.5" />
                  Visit Storefront to Test Order
                </Link>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                        <tr>
                          <th className="py-3 px-4 font-semibold">Order ID & Date</th>
                          <th className="py-3 px-4 font-semibold">Customer Info</th>
                          <th className="py-3 px-4 font-semibold">Items</th>
                          <th className="py-3 px-4 font-semibold">Payment</th>
                          <th className="py-3 px-4 font-semibold text-right">Total (LKR)</th>
                          <th className="py-3 px-4 font-semibold text-center">Status</th>
                          <th className="py-3 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80">
                        {filteredOrders.map((order) => {
                          const totalItemsQty = order.items.reduce((sum, it) => sum + it.quantity, 0);
                          const cleanPhone = order.customer.phone.replace(/\D/g, "");
                          return (
                            <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                              {/* Order ID & Date */}
                              <td className="py-3.5 px-4 align-top">
                                <div className="font-mono font-bold text-blue-400 text-sm">
                                  #{order.id}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                  <Clock className="size-3 text-slate-500" />
                                  {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </td>

                              {/* Customer Info */}
                              <td className="py-3.5 px-4 align-top">
                                <div className="font-semibold text-white text-xs">
                                  {order.customer.name}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <a
                                    href={`tel:${order.customer.phone}`}
                                    className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-blue-400 transition-colors font-mono"
                                    title="Call Customer"
                                  >
                                    <Phone className="size-3 text-emerald-400" />
                                    {order.customer.phone}
                                  </a>
                                  {cleanPhone && (
                                    <a
                                      href={`https://wa.me/${cleanPhone.startsWith("0") ? "94" + cleanPhone.slice(1) : cleanPhone}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-[10px] hover:bg-emerald-900 transition-colors font-medium"
                                      title="Chat on WhatsApp"
                                    >
                                      WhatsApp
                                    </a>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                                  <MapPin className="size-3 text-slate-500 shrink-0" />
                                  <span className="truncate max-w-[200px]" title={`${order.customer.address}, ${order.customer.city}`}>
                                    {order.customer.city}
                                  </span>
                                </div>
                              </td>

                              {/* Items */}
                              <td className="py-3.5 px-4 align-top">
                                <div className="font-medium text-slate-200">
                                  {totalItemsQty} {totalItemsQty === 1 ? "item" : "items"}
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5 space-y-0.5 max-w-[220px]">
                                  {order.items.slice(0, 2).map((it, idx) => (
                                    <div key={idx} className="truncate" title={`${it.name} x${it.quantity}`}>
                                      • {it.quantity}x {it.name}
                                    </div>
                                  ))}
                                  {order.items.length > 2 && (
                                    <div className="text-slate-500 italic">
                                      +{order.items.length - 2} more item{order.items.length - 2 > 1 ? "s" : ""}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Payment */}
                              <td className="py-3.5 px-4 align-top">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium uppercase">
                                  <CreditCard className="size-3 text-slate-400" />
                                  {order.paymentMethod === "cod"
                                    ? "Cash on Del."
                                    : order.paymentMethod === "bank"
                                    ? "Bank Transfer"
                                    : "Card"}
                                </span>
                              </td>

                              {/* Total Amount */}
                              <td className="py-3.5 px-4 text-right align-top">
                                <div className="font-mono font-extrabold text-white text-sm">
                                  {formatLKR(order.total)}
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  Delivery: {order.deliveryFee === 0 ? "FREE" : formatLKR(order.deliveryFee)}
                                </div>
                              </td>

                              {/* Status */}
                              <td className="py-3.5 px-4 text-center align-top">
                                <div className="flex flex-col items-center gap-1.5">
                                  <Badge
                                    className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide ${
                                      order.status === "pending"
                                        ? "bg-amber-950/80 text-amber-300 border-amber-700/80 shadow-sm shadow-amber-900/30"
                                        : order.status === "confirmed"
                                        ? "bg-blue-950/80 text-blue-300 border-blue-700/80"
                                        : order.status === "dispatched"
                                        ? "bg-purple-950/80 text-purple-300 border-purple-700/80"
                                        : order.status === "delivered"
                                        ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/80"
                                        : "bg-rose-950/80 text-rose-300 border-rose-700/80"
                                    }`}
                                  >
                                    {order.status}
                                  </Badge>

                                  <Select
                                    value={order.status}
                                    onValueChange={(val) => handleUpdateOrderStatus(order.id, val as OrderStatus)}
                                    disabled={isUpdatingOrder}
                                  >
                                    <SelectTrigger className="h-6 w-24 text-[10px] px-2 py-0 rounded bg-slate-800/80 border-slate-700 text-slate-300">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="confirmed">Confirmed</SelectItem>
                                      <SelectItem value="dispatched">Dispatched</SelectItem>
                                      <SelectItem value="delivered">Delivered</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="py-3.5 px-4 text-right align-top">
                                <div className="flex items-center justify-end gap-1.5">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedOrderDetails(order)}
                                    className="h-7 px-2.5 rounded-lg border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs gap-1 cursor-pointer"
                                  >
                                    <Eye className="size-3" />
                                    Invoice
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      setDeleteConfirm({
                                        open: true,
                                        type: "order",
                                        id: order.id,
                                        name: `Order #${order.id}`,
                                      })
                                    }
                                    className="size-7 p-0 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 cursor-pointer"
                                    title="Delete Order"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile / Tablet Cards View */}
                <div className="lg:hidden space-y-3">
                  {filteredOrders.map((order) => {
                    const totalItemsQty = order.items.reduce((sum, it) => sum + it.quantity, 0);
                    const cleanPhone = order.customer.phone.replace(/\D/g, "");
                    return (
                      <div
                        key={order.id}
                        className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3"
                      >
                        {/* Top: ID, Date & Status */}
                        <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                          <div>
                            <span className="font-mono font-bold text-blue-400 text-sm">
                              #{order.id}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                              <Clock className="size-3 text-slate-500" />
                              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                          <Badge
                            className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide ${
                              order.status === "pending"
                                ? "bg-amber-950/80 text-amber-300 border-amber-700/80"
                                : order.status === "confirmed"
                                ? "bg-blue-950/80 text-blue-300 border-blue-700/80"
                                : order.status === "dispatched"
                                ? "bg-purple-950/80 text-purple-300 border-purple-700/80"
                                : order.status === "delivered"
                                ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/80"
                                : "bg-rose-950/80 text-rose-300 border-rose-700/80"
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </div>

                        {/* Customer Info */}
                        <div className="space-y-1">
                          <div className="font-semibold text-white text-xs">{order.customer.name}</div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${order.customer.phone}`}
                              className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-blue-400 font-mono"
                            >
                              <Phone className="size-3 text-emerald-400" />
                              {order.customer.phone}
                            </a>
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/${cleanPhone.startsWith("0") ? "94" + cleanPhone.slice(1) : cleanPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-[10px]"
                              >
                                WhatsApp
                              </a>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="size-3 text-slate-500 shrink-0" />
                            <span>{order.customer.city} • {order.customer.address}</span>
                          </div>
                        </div>

                        {/* Items Summary & Total */}
                        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="text-slate-400 text-[11px] block">{totalItemsQty} items ordered:</span>
                            <span className="text-slate-200 font-medium text-[11px] line-clamp-1">
                              {order.items.map((it) => `${it.quantity}x ${it.name}`).join(", ")}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-[10px] text-slate-400 uppercase block">Total</span>
                            <span className="font-mono font-extrabold text-white text-sm">
                              {formatLKR(order.total)}
                            </span>
                          </div>
                        </div>

                        {/* Status Switcher & Action Buttons */}
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex-1">
                            <Select
                              value={order.status}
                              onValueChange={(val) => handleUpdateOrderStatus(order.id, val as OrderStatus)}
                              disabled={isUpdatingOrder}
                            >
                              <SelectTrigger className="h-8 text-xs rounded-xl bg-slate-800 border-slate-700 text-slate-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="dispatched">Dispatched</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrderDetails(order)}
                            className="h-8 px-3 rounded-xl border-slate-700 bg-slate-800 text-slate-200 text-xs gap-1"
                          >
                            <Eye className="size-3" />
                            Invoice
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setDeleteConfirm({
                                open: true,
                                type: "order",
                                id: order.id,
                                name: `Order #${order.id}`,
                              })
                            }
                            className="size-8 p-0 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/40"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
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
                  Showing <strong className="text-white">{totalFilteredProducts === 0 ? 0 : (currentPage - 1) * PRODUCTS_PER_PAGE + 1}</strong>–<strong className="text-white">{Math.min(currentPage * PRODUCTS_PER_PAGE, totalFilteredProducts)}</strong> of <strong className="text-white">{totalFilteredProducts.toLocaleString()}</strong> products
                  {totalFilteredProducts < products.length && (
                    <span className="text-slate-500 ml-1"> (filtered from {products.length.toLocaleString()})</span>
                  )}
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

            {/* Products Table & Mobile Cards */}
            <div className="rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg overflow-hidden">
              {/* Mobile Card List (screens < md) */}
              <div className="md:hidden divide-y divide-slate-800">
                {filteredProducts.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 px-4">
                    <Package className="size-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-semibold">No products match your filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting filters or adding a new product</p>
                  </div>
                ) : (
                  paginatedProducts.map((p) => {
                    const cat = categories.find((c) => c.id === p.categoryId);
                    const markupPct = cat?.markupPercentage ?? p.markupPercentage ?? 15;
                    const markupAmount = Math.round(((p.basePrice * markupPct) / 100) * 100) / 100;

                    return (
                      <div
                        key={p.sku}
                        className={`p-3.5 space-y-3 transition-colors ${
                          selectedProductSkus.has(p.sku)
                            ? "bg-blue-950/40 border-l-4 border-l-blue-500"
                            : "hover:bg-slate-800/30"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="pt-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selectedProductSkus.has(p.sku)}
                              onCheckedChange={() => {
                                setSelectedProductSkus((prev) => {
                                  const next = new Set(prev);
                                  if (next.has(p.sku)) next.delete(p.sku);
                                  else next.add(p.sku);
                                  return next;
                                });
                              }}
                              className="border-slate-600 data-[state=checked]:bg-blue-600"
                            />
                          </div>
                          <ProductImage
                            src={p.image}
                            alt={p.name}
                            category={p.categoryId}
                            size="md"
                            className="rounded-xl shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-white text-xs sm:text-sm leading-snug">
                                {p.name}
                              </span>
                              {p.badge && (
                                <Badge className="bg-blue-950 text-blue-300 border-blue-800 text-[9px] px-1.5 py-0">
                                  {p.badge}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                              <span>SKU: {p.sku}</span>
                              <span>•</span>
                              <Badge
                                variant="outline"
                                className="bg-slate-900 border-slate-700 text-slate-300 text-[9px] px-1.5 py-0 font-sans"
                              >
                                {cat?.name || p.categoryId}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Pricing details */}
                        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center font-mono text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-sans">Base Cost</span>
                            <span className="text-slate-300 font-semibold">{formatINR(p.basePrice)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-sans">Markup</span>
                            <span className="text-blue-400 font-bold">+{markupPct}%</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-sans">Selling Price</span>
                            <span className="text-white font-extrabold">{formatINR(p.sellingPrice)}</span>
                          </div>
                        </div>

                        {/* Status, Stock & Actions */}
                        <div className="flex items-center justify-between gap-2 pt-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {p.isPriceOverridden ? (
                              <Badge className="bg-amber-950/80 text-amber-300 border-amber-800 text-[9px] px-1.5 py-0 font-bold">
                                Overridden
                              </Badge>
                            ) : (
                              <Badge className="bg-emerald-950/80 text-emerald-300 border-emerald-800 text-[9px] px-1.5 py-0 font-bold">
                                Rule-Based
                              </Badge>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono">
                              Stock: <strong className={p.stock <= 5 ? "text-rose-400" : "text-slate-300"}>{p.stock}</strong>
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            {p.isPriceOverridden && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleResetOverride(p.sku)}
                                className="h-8 px-2 text-xs rounded-lg text-amber-400 hover:bg-amber-950/50"
                                title="Reset to formula"
                              >
                                <RotateCcw className="size-3.5 mr-1" /> Revert
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(p);
                                setProductDialogOpen(true);
                              }}
                              className="h-8 px-2.5 text-xs rounded-lg text-blue-400 hover:text-white hover:bg-blue-600/20"
                            >
                              <Edit className="size-3.5 mr-1" /> Edit
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
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Desktop Table (screens md and up) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[760px]">
                  <thead>
                    <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3 w-10 text-center">
                        <Checkbox
                          checked={
                            paginatedProducts.length > 0 &&
                            paginatedProducts.every((p) => selectedProductSkus.has(p.sku))
                          }
                          onCheckedChange={() => {
                            const allOnPage =
                              paginatedProducts.length > 0 &&
                              paginatedProducts.every((p) => selectedProductSkus.has(p.sku));
                            setSelectedProductSkus((prev) => {
                              const next = new Set(prev);
                              if (allOnPage) {
                                paginatedProducts.forEach((p) => next.delete(p.sku));
                              } else {
                                paginatedProducts.forEach((p) => next.add(p.sku));
                              }
                              return next;
                            });
                          }}
                          className="border-slate-600 data-[state=checked]:bg-blue-600"
                          title="Select / Deselect all on this page"
                        />
                      </th>
                      <th className="py-3 px-4">Item & SKU</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3 text-right">Base Cost (LKR)</th>
                      <th className="py-3 px-3 text-right">Category Markup</th>
                      <th className="py-3 px-3 text-right">Final Selling Price (LKR)</th>
                      <th className="py-3 px-3 text-center">Stock</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          <Package className="size-8 mx-auto mb-2 text-slate-600" />
                          <p className="text-sm font-semibold">No products match your filters</p>
                          <p className="text-xs text-slate-400 mt-1">Try resetting filters or adding a new product</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedProducts.map((p) => {
                        const cat = categories.find((c) => c.id === p.categoryId);
                        const markupPct = cat?.markupPercentage ?? p.markupPercentage ?? 15;
                        const markupAmount = Math.round(((p.basePrice * markupPct) / 100) * 100) / 100;
                        const isSelected = selectedProductSkus.has(p.sku);

                        return (
                          <tr
                            key={p.sku}
                            className={`transition-colors ${
                              isSelected
                                ? "bg-blue-950/40 hover:bg-blue-950/60"
                                : "hover:bg-slate-800/60"
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => {
                                  setSelectedProductSkus((prev) => {
                                    const next = new Set(prev);
                                    if (next.has(p.sku)) next.delete(p.sku);
                                    else next.add(p.sku);
                                    return next;
                                  });
                                }}
                                className="border-slate-600 data-[state=checked]:bg-blue-600"
                              />
                            </td>

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

              {/* Pagination Controls */}
              {totalFilteredProducts > 0 && (
                <div className="p-3.5 sm:p-4 border-t border-slate-700/80 bg-slate-900/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="text-slate-400 text-center sm:text-left">
                    Showing <strong className="text-white">{(currentPage - 1) * PRODUCTS_PER_PAGE + 1}</strong>–<strong className="text-white">{Math.min(currentPage * PRODUCTS_PER_PAGE, totalFilteredProducts)}</strong> of{" "}
                    <strong className="text-white">{totalFilteredProducts.toLocaleString()}</strong> items
                    {totalFilteredProducts < products.length && (
                      <span className="text-slate-500 ml-1"> (filtered from {products.length.toLocaleString()})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setProductsPage(1)}
                      className="h-8 px-2.5 rounded-lg border-slate-700 bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 text-xs cursor-pointer"
                    >
                      First
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => setProductsPage((p) => Math.max(1, p - 1))}
                      className="h-8 px-2.5 rounded-lg border-slate-700 bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 text-xs gap-1 cursor-pointer"
                    >
                      <ChevronRight className="size-3.5 rotate-180" /> Prev
                    </Button>

                    <div className="px-3 py-1 rounded-lg bg-slate-800/90 border border-slate-700 font-mono text-xs text-slate-200">
                      Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setProductsPage((p) => Math.min(totalPages, p + 1))}
                      className="h-8 px-2.5 rounded-lg border-slate-700 bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 text-xs gap-1 cursor-pointer"
                    >
                      Next <ChevronRight className="size-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => setProductsPage(totalPages)}
                      className="h-8 px-2.5 rounded-lg border-slate-700 bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 text-xs cursor-pointer"
                    >
                      Last
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Floating Bulk Category Assignment Action Bar */}
            {selectedProductSkus.size > 0 && (
              <div className="sticky bottom-4 z-40 p-3 sm:p-4 rounded-2xl bg-slate-900/95 border border-blue-500/50 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {selectedProductSkus.size}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {selectedProductSkus.size} product{selectedProductSkus.size === 1 ? "" : "s"} selected
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Add/move selected products into a category
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Select value={bulkTargetCategory} onValueChange={setBulkTargetCategory}>
                    <SelectTrigger className="h-9 min-w-[170px] rounded-xl bg-slate-800 border-slate-700 text-xs text-white">
                      <SelectValue placeholder="Choose Category..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} (+{c.markupPercentage}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    onClick={handleBulkAssignCategory}
                    disabled={!bulkTargetCategory || isBulkAssigning}
                    className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs gap-1.5 shadow-md shadow-blue-600/30 shrink-0 cursor-pointer"
                  >
                    {isBulkAssigning ? (
                      <RefreshCw className="size-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="size-3.5" />
                    )}
                    Assign to Category
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedProductSkus(new Set())}
                    className="h-9 px-2 text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Deselect
                  </Button>
                </div>
              </div>
            )}
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

              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <Button
                  onClick={() => handleOpenPosCategoryModal()}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold h-9 shadow-md shadow-blue-600/30 gap-1.5 flex-1 sm:flex-none"
                >
                  <Package className="size-3.5" />
                  <span>Add Products from POS</span>
                </Button>

                <Button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCategoryDialogOpen(true);
                  }}
                  variant="outline"
                  className="rounded-xl border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold h-9 gap-1.5 flex-1 sm:flex-none"
                >
                  <Plus className="size-3.5" />
                  <span>Create New Category</span>
                </Button>
              </div>
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
                          <span>Base LKR 100:</span>
                          <ArrowRight className="size-3 text-slate-500" />
                          <strong className="text-emerald-400">Selling {formatLKR(sampleCalculated)}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-700/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 text-xs">
                      <div className="flex items-center justify-between sm:justify-start gap-3">
                        <span className="text-slate-400">
                          Assigned: <strong className="text-white">{count} products</strong>
                        </span>
                        <button
                          onClick={() => {
                            setSelectedCategoryFilter(c.id);
                            setActiveTab("products");
                          }}
                          className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 text-[11px]"
                        >
                          View <ChevronRight className="size-3" />
                        </button>
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenPosCategoryModal(c.id)}
                        className="h-7 px-2.5 rounded-lg border-blue-800/80 bg-blue-950/40 text-blue-300 hover:bg-blue-900/60 hover:text-white text-[11px] font-semibold gap-1 shrink-0"
                        title={`Add or import products from POS directly into ${c.name}`}
                      >
                        <Plus className="size-3" />
                        Add from POS
                      </Button>
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
                    Set a percentage-based margin rule for each product category (e.g. 20% margin). Selling prices are calculated automatically using:{" "}
                    <strong className="text-blue-300 font-mono">
                      Selling Price = Base Cost + (Base Cost × Category Margin % ÷ 100)
                    </strong>.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => setPricingCalculatorOpen(true)}
                    className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold h-9 shadow-md shadow-blue-600/30 gap-1.5"
                  >
                    <Calculator className="size-3.5" />
                    <span>Open Simulator</span>
                  </Button>
                </div>
              </div>

              {/* Bulk Margin Setup Bar */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Sliders className="size-3.5 text-blue-400" />
                    Bulk Margin Setup (All Categories)
                  </span>
                  <p className="text-[11px] text-slate-400">
                    Quickly configure the same profit margin (e.g. 20%) across all active categories in 1-click.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {[10, 15, 20, 25, 30].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setBulkMarginValue(preset);
                        handleApplyBulkMargin(preset);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                        bulkMarginValue === preset
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                      }`}
                    >
                      {preset}%
                    </button>
                  ))}

                  <div className="flex items-center gap-1.5 ml-1">
                    <Input
                      type="number"
                      min="0"
                      max="1000"
                      step="1"
                      value={bulkMarginValue}
                      onChange={(e) => setBulkMarginValue(parseFloat(e.target.value) || 0)}
                      className="w-20 h-8 rounded-lg bg-slate-950 border-slate-700 font-bold font-mono text-blue-300 text-xs"
                    />
                    <span className="text-xs font-bold text-slate-400">%</span>
                    <Button
                      size="sm"
                      onClick={() => handleApplyBulkMargin(bulkMarginValue)}
                      disabled={isRefreshing}
                      className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs"
                    >
                      Apply to All
                    </Button>
                  </div>
                </div>
              </div>

              {/* Behavior Note Card on Price Overrides */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                <AlertTriangle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-amber-300">Override Protection:</strong> Products with manual price overrides (e.g., custom promotions) are preserved and will not be overwritten when category margins change.
                </p>
              </div>
            </div>

            {/* Category Markup Percentages Cards & Table */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Category-Wise Price Margin Setup</h4>
                  <p className="text-xs text-slate-400">Choose preset margins (10%, 15%, 20%, 25%, 30%) or enter custom percentage per category</p>
                </div>
              </div>

              {/* Mobile Category Pricing Cards (screens < md) */}
              <div className="md:hidden divide-y divide-slate-800">
                {categories.map((c) => {
                  const count = products.filter((p) => p.categoryId === c.id).length;
                  const sampleCalculated = calculateSellingPrice(100, c.markupPercentage);

                  return (
                    <div key={c.id} className="py-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white text-sm block">{c.name}</span>
                          <span className="text-[10px] text-slate-400">{c.tagline}</span>
                        </div>
                        <Badge className="bg-blue-950 text-blue-300 border-blue-800 text-xs font-mono font-bold px-2 py-0.5">
                          +{c.markupPercentage}%
                        </Badge>
                      </div>

                      {/* Quick Margin Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[10, 15, 20, 25, 30].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleUpdateCategoryMarkup(c.id, preset)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                              c.markupPercentage === preset
                                ? "bg-blue-600 text-white shadow-xs"
                                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-800"
                            }`}
                          >
                            {preset}%
                          </button>
                        ))}
                      </div>

                      {/* Pricing Preview Row */}
                      <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 font-mono">
                        <span className="text-slate-400">Base LKR 100:</span>
                        <ArrowRight className="size-3 text-slate-500" />
                        <span className="text-emerald-400 font-extrabold">Selling {formatLKR(sampleCalculated)}</span>
                        <span className="text-slate-500 font-sans text-[11px]">({count} items)</span>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory(c);
                            setCategoryDialogOpen(true);
                          }}
                          className="h-8 text-xs rounded-xl border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                        >
                          Edit Rule Details
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop Table (screens md and up) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-slate-700 text-slate-400 uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Quick Margin Presets</th>
                      <th className="py-2.5 px-3">Custom Margin (%)</th>
                      <th className="py-2.5 px-3 text-right">Sample Base Cost</th>
                      <th className="py-2.5 px-3 text-right">Calculated Selling Price</th>
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

                          {/* Quick Margin Presets */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {[10, 15, 20, 25, 30].map((preset) => (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => handleUpdateCategoryMarkup(c.id, preset)}
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold font-mono transition-all ${
                                    c.markupPercentage === preset
                                      ? "bg-blue-600 text-white shadow-xs"
                                      : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-800"
                                  }`}
                                  title={`Set ${preset}% margin for ${c.name}`}
                                >
                                  {preset}%
                                </button>
                              ))}
                            </div>
                          </td>

                          {/* Custom Input */}
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-1.5">
                              <Input
                                type="number"
                                min="0"
                                step="0.5"
                                defaultValue={c.markupPercentage}
                                key={`input-${c.id}-${c.markupPercentage}`}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    const val = parseFloat((e.target as HTMLInputElement).value);
                                    if (!isNaN(val) && val !== c.markupPercentage) {
                                      handleUpdateCategoryMarkup(c.id, val);
                                    }
                                  }
                                }}
                                onBlur={(e) => {
                                  const val = parseFloat(e.target.value);
                                  if (!isNaN(val) && val !== c.markupPercentage) {
                                    handleUpdateCategoryMarkup(c.id, val);
                                  }
                                }}
                                className="w-20 h-8 rounded-lg bg-slate-900 border-slate-700 font-bold font-mono text-blue-300 text-xs"
                              />
                              <span className="font-bold text-slate-400 text-xs">%</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-3 text-right font-mono text-slate-400">
                            LKR 100.00
                          </td>

                          <td className="py-3.5 px-3 text-right font-mono font-extrabold text-emerald-400">
                            {formatINR(sampleCalculated)}
                            <span className="block text-[10px] text-slate-400 font-normal">
                              (+{formatINR(sampleCalculated - 100)} margin)
                            </span>
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
              <div className="p-4 sm:p-6 rounded-2xl bg-amber-950/20 border border-amber-900/50 shadow-lg space-y-4">
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

                {/* Mobile Overridden Products Cards */}
                <div className="md:hidden divide-y divide-amber-900/40">
                  {products
                    .filter((p) => p.isPriceOverridden)
                    .map((p) => {
                      const cat = categories.find((c) => c.id === p.categoryId);
                      const calculated = calculateSellingPrice(p.basePrice, cat?.markupPercentage ?? 15);

                      return (
                        <div key={p.sku} className="py-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white text-xs">{p.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-400">Rule: <span className="line-through">{formatINR(calculated)}</span></span>
                            <span className="text-amber-300 font-extrabold font-mono">Override: {formatINR(p.sellingPrice)}</span>
                          </div>
                          <div className="flex justify-end pt-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResetOverride(p.sku)}
                              className="h-7 text-xs rounded-lg border-amber-800 bg-amber-950/60 text-amber-200 hover:bg-amber-900 gap-1"
                            >
                              <RotateCcw className="size-3" /> Revert to Category Rule
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Desktop Overridden Products Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead>
                      <tr className="border-b border-amber-900/60 text-amber-300/80 uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3">Product</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3 text-right">Base Cost (LKR)</th>
                        <th className="py-2.5 px-3 text-right">Rule Calculated (LKR)</th>
                        <th className="py-2.5 px-3 text-right">Active Override (LKR)</th>
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
                        className="absolute top-2 right-2 size-7 rounded-lg bg-slate-950/85 text-slate-300 hover:text-rose-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center shadow-md"
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

      {/* POS Category Importer Modal */}
      <PosCategoryImportModal
        open={posCategoryModalOpen}
        onOpenChange={setPosCategoryModalOpen}
        categories={categories}
        defaultCategoryId={posCategoryModalTarget}
        allStoreProducts={products}
        onSuccess={refreshData}
      />

      {/* Order Details Receipt Modal */}
      {selectedOrderDetails && (
        <Dialog
          open={Boolean(selectedOrderDetails)}
          onOpenChange={(open) => !open && setSelectedOrderDetails(null)}
        >
          <DialogContent className="max-w-2xl bg-slate-900 border border-slate-800 text-slate-100 p-5 sm:p-7 rounded-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b border-slate-800 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <DialogTitle className="text-xl font-bold text-white flex items-center gap-2.5">
                    <span>Order #{selectedOrderDetails.id}</span>
                    <Badge
                      className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide ${
                        selectedOrderDetails.status === "pending"
                          ? "bg-amber-950/80 text-amber-300 border-amber-700/80"
                          : selectedOrderDetails.status === "confirmed"
                          ? "bg-blue-950/80 text-blue-300 border-blue-700/80"
                          : selectedOrderDetails.status === "dispatched"
                          ? "bg-purple-950/80 text-purple-300 border-purple-700/80"
                          : selectedOrderDetails.status === "delivered"
                          ? "bg-emerald-950/80 text-emerald-300 border-emerald-700/80"
                          : "bg-rose-950/80 text-rose-300 border-rose-700/80"
                      }`}
                    >
                      {selectedOrderDetails.status}
                    </Badge>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Clock className="size-3.5 text-slate-500" />
                    Placed on{" "}
                    {new Date(selectedOrderDetails.createdAt).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </DialogDescription>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={selectedOrderDetails.status}
                    onValueChange={(val) =>
                      handleUpdateOrderStatus(selectedOrderDetails.id, val as OrderStatus)
                    }
                    disabled={isUpdatingOrder}
                  >
                    <SelectTrigger className="h-8 text-xs rounded-xl bg-slate-800 border-slate-700 text-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-slate-200 text-xs">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 pt-3">
              {/* Customer & Delivery Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Details */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Customer Information
                  </span>
                  <div className="font-semibold text-white text-sm">
                    {selectedOrderDetails.customer.name}
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center justify-between gap-2">
                      <a
                        href={`tel:${selectedOrderDetails.customer.phone}`}
                        className="inline-flex items-center gap-1.5 text-blue-400 hover:underline font-mono"
                      >
                        <Phone className="size-3.5 text-emerald-400 shrink-0" />
                        {selectedOrderDetails.customer.phone}
                      </a>
                      {selectedOrderDetails.customer.phone && (
                        <a
                          href={`https://wa.me/${
                            selectedOrderDetails.customer.phone.replace(/\D/g, "").startsWith("0")
                              ? "94" + selectedOrderDetails.customer.phone.replace(/\D/g, "").slice(1)
                              : selectedOrderDetails.customer.phone.replace(/\D/g, "")
                          }`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-semibold hover:bg-emerald-900 transition-colors"
                        >
                          WhatsApp Direct
                        </a>
                      )}
                    </div>
                    {selectedOrderDetails.customer.email && (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Mail className="size-3.5 text-slate-500 shrink-0" />
                        <span>{selectedOrderDetails.customer.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delivery & Payment Details */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Delivery & Payment
                  </span>
                  <div className="text-xs text-slate-300 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="size-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-white">{selectedOrderDetails.customer.city}</div>
                        <div className="text-slate-400 text-[11px]">{selectedOrderDetails.customer.address}</div>
                        {selectedOrderDetails.customer.postal && (
                          <div className="text-slate-500 text-[10px]">Postal Code: {selectedOrderDetails.customer.postal}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Payment Method:</span>
                    <span className="font-semibold text-white uppercase text-[11px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {selectedOrderDetails.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : selectedOrderDetails.paymentMethod === "bank"
                        ? "Bank Transfer"
                        : "Online Card"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items Table */}
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/50">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Item & SKU</th>
                      <th className="py-2.5 px-3 font-semibold text-center">Qty</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Unit Price</th>
                      <th className="py-2.5 px-3 font-semibold text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {selectedOrderDetails.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/20">
                        <td className="py-3 px-3">
                          <div className="font-medium text-white">{item.name}</div>
                          <div className="font-mono text-[10px] text-slate-400">{item.sku}</div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-200">
                          x{item.quantity}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-300">
                          {formatLKR(item.price)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-white">
                          {formatLKR(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals Summary */}
                <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Items Subtotal:</span>
                    <span className="font-mono text-slate-200">{formatLKR(selectedOrderDetails.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Island-wide Delivery:</span>
                    <span className="font-mono text-slate-200">
                      {selectedOrderDetails.deliveryFee === 0 ? "FREE" : formatLKR(selectedOrderDetails.deliveryFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-white pt-2 border-t border-slate-800">
                    <span>Total Amount Payable:</span>
                    <span className="font-mono text-blue-400 text-base">{formatLKR(selectedOrderDetails.total)}</span>
                  </div>
                </div>
              </div>

              {/* Order Status Advancement Shortcuts */}
              <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-slate-400">Quick Status Advance:</span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {selectedOrderDetails.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, "confirmed")}
                      disabled={isUpdatingOrder}
                      className="h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold gap-1"
                    >
                      <Check className="size-3.5" />
                      Mark Confirmed
                    </Button>
                  )}
                  {selectedOrderDetails.status === "confirmed" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, "dispatched")}
                      disabled={isUpdatingOrder}
                      className="h-8 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold gap-1"
                    >
                      <Truck className="size-3.5" />
                      Mark Dispatched
                    </Button>
                  )}
                  {selectedOrderDetails.status === "dispatched" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, "delivered")}
                      disabled={isUpdatingOrder}
                      className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold gap-1"
                    >
                      <Check className="size-3.5" />
                      Mark Delivered
                    </Button>
                  )}
                  {selectedOrderDetails.status !== "cancelled" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateOrderStatus(selectedOrderDetails.id, "cancelled")}
                      disabled={isUpdatingOrder}
                      className="h-8 rounded-lg border-rose-800/70 bg-rose-950/30 text-rose-400 hover:bg-rose-900/40 text-xs"
                    >
                      Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

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
