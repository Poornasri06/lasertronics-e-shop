import React, { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryRecord, ProductRecord } from "@/lib/catalog-types";
import { Upload, AlertCircle, ImageIcon, CheckCircle2, X } from "lucide-react";

interface ImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoryRecord[];
  products: ProductRecord[];
  onUpload: (data: {
    filename: string;
    dataUrl: string;
    categoryId?: string | undefined;
    productSku?: string | undefined;
  }) => Promise<void>;
}

export function ImageUploadDialog({
  open,
  onOpenChange,
  categories,
  products,
  onUpload,
}: ImageUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [productSku, setProductSku] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB limit. Please choose an optimized image under 5MB.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setError("Unsupported format. Allowed formats: JPEG, PNG, WebP, GIF, SVG.");
      return;
    }

    setError(null);
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !previewUrl) {
      setError("Please select an image file to upload.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      await onUpload({
        filename: selectedFile.name,
        dataUrl: previewUrl,
        categoryId: categoryId || undefined,
        productSku: productSku || undefined,
      });

      handleClear();
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl bg-white border border-slate-200/80 shadow-2xl p-0 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-5 border-b border-slate-100 bg-slate-50/70">
            <DialogTitle className="text-lg font-bold text-slate-900">
              Upload Product Image
            </DialogTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload and organize images by category and associate them directly with products.
            </p>
          </DialogHeader>

          {error && (
            <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-5 space-y-4">
            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`relative rounded-2xl border-2 border-dashed p-6 transition-all text-center ${
                previewUrl
                  ? "border-emerald-300 bg-emerald-50/20"
                  : "border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20"
              }`}
            >
              {previewUrl ? (
                <div className="flex flex-col items-center">
                  <div className="relative size-36 rounded-xl overflow-hidden border border-slate-200 shadow-md bg-white mb-3">
                    <img
                      src={previewUrl}
                      alt="Uploaded preview"
                      className="size-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute top-1.5 right-1.5 grid size-6 place-items-center rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                  <span className="text-xs font-semibold text-slate-800 truncate max-w-xs block">
                    {selectedFile?.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ""}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 mb-3">
                    <Upload className="size-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Drag and drop image here, or{" "}
                    <label className="text-blue-600 hover:underline cursor-pointer">
                      browse
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileSelect(file);
                        }}
                      />
                    </label>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports JPEG, PNG, WebP, SVG up to 5MB.
                  </p>
                </div>
              )}
            </div>

            {/* Categorization & Product assignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <Label htmlFor="img-cat" className="text-xs font-semibold text-slate-700">
                  Assign Category (Optional)
                </Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="img-cat" className="rounded-xl h-10 text-xs">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="unassigned" className="text-xs">None / General</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="img-prod" className="text-xs font-semibold text-slate-700">
                  Link to Product (Optional)
                </Label>
                <Select value={productSku} onValueChange={setProductSku}>
                  <SelectTrigger id="img-prod" className="rounded-xl h-10 text-xs">
                    <SelectValue placeholder="Do not link immediately" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-48">
                    <SelectItem value="unlinked" className="text-xs">None (Keep in library)</SelectItem>
                    {products.map((p) => (
                      <SelectItem key={p.sku} value={p.sku} className="text-xs">
                        {p.name} ({p.sku})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 px-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
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
              disabled={isUploading || !selectedFile}
              className="rounded-xl h-9 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isUploading ? "Uploading..." : "Save Image to Library"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
