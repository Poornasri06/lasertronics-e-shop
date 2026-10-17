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
import { CategoryRecord, calculateSellingPrice, formatINR } from "@/lib/catalog-types";
import { AlertCircle, Percent, ArrowRight } from "lucide-react";

interface CategoryEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CategoryRecord | null;
  onSave: (data: {
    id?: string | undefined;
    name: string;
    tagline?: string | undefined;
    description?: string | undefined;
    markupPercentage: number;
  }) => Promise<void>;
}

export function CategoryEditDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: CategoryEditDialogProps) {
  const isEditing = Boolean(category);

  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [markupPercentage, setMarkupPercentage] = useState<number>(15);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setTagline(category.tagline || "");
      setDescription(category.description || "");
      setMarkupPercentage(category.markupPercentage ?? 15);
    } else {
      setName("");
      setTagline("");
      setDescription("");
      setMarkupPercentage(15);
    }
    setError(null);
  }, [category, open]);

  // Sample demonstration calculation
  const sampleBase = 100;
  const sampleCalculated = calculateSellingPrice(sampleBase, markupPercentage);
  const sampleMarkupAmount = Math.round(((sampleBase * markupPercentage) / 100) * 100) / 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    if (markupPercentage < 0) {
      setError("Markup percentage cannot be negative.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await onSave({
        id: category?.id,
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
        markupPercentage: Number(markupPercentage) || 0,
      });
      onOpenChange(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[95vw] sm:w-full max-h-[92vh] overflow-y-auto rounded-2xl bg-white border border-slate-200/80 shadow-2xl p-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="p-5 border-b border-slate-100 bg-slate-50/70">
            <DialogTitle className="text-lg font-bold text-slate-900">
              {isEditing ? `Edit Category: ${category?.name}` : "Create Product Category"}
            </DialogTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure category details and its percentage-based pricing markup rule.
            </p>
          </DialogHeader>

          {error && (
            <div className="mx-5 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="category-name" className="text-xs font-semibold text-slate-700">
                Category Name <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="category-name"
                placeholder="e.g. Mobile Accessories"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-xl h-10 text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category-tagline" className="text-xs font-semibold text-slate-700">
                Tagline / Subheading
              </Label>
              <Input
                id="category-tagline"
                placeholder="e.g. Charge, carry, connect"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="rounded-xl h-10 text-sm"
              />
            </div>

            {/* Category Markup Rule */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="category-markup" className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Percent className="size-3.5 text-blue-600" />
                  Category Markup Percentage (%) <span className="text-rose-500">*</span>
                </Label>
              </div>

              <div className="relative">
                <Input
                  id="category-markup"
                  type="number"
                  min="0"
                  step="0.5"
                  value={markupPercentage}
                  onChange={(e) => setMarkupPercentage(parseFloat(e.target.value) || 0)}
                  className="rounded-xl h-10 pr-9 text-base font-bold text-blue-900 bg-white"
                  required
                />
                <span className="absolute right-3 top-2.5 text-blue-500 font-bold text-sm">%</span>
              </div>

              {/* Live Formula Preview Example */}
              <div className="rounded-lg bg-white p-2.5 border border-blue-100 text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center justify-between">
                  <span>Sample Formula Example:</span>
                  <span className="text-blue-600 font-mono">Selling Price = Base + (Base × {markupPercentage}%)</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-slate-500">
                  <span>Base: ₹{sampleBase}</span>
                  <ArrowRight className="size-3 text-slate-400" />
                  <span>Markup: +₹{sampleMarkupAmount}</span>
                  <ArrowRight className="size-3 text-slate-400" />
                  <strong className="text-slate-900">Selling Price: {formatINR(sampleCalculated)}</strong>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 leading-relaxed">
                Updating this markup rule automatically recalculates product selling prices in this category, while safely preserving any products with individual manual price overrides.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category-desc" className="text-xs font-semibold text-slate-700">
                Description
              </Label>
              <Textarea
                id="category-desc"
                placeholder="Category scope and application notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="rounded-xl text-sm resize-none"
              />
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
              disabled={isSaving}
              className="rounded-xl h-9 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
