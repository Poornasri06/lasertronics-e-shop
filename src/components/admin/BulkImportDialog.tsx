import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategoryRecord } from "@/lib/catalog-types";
import { Upload, Download, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoryRecord[];
  onImport: (products: Array<{
    sku: string;
    name: string;
    categoryId: string;
    basePrice: number;
    isPriceOverridden?: boolean | undefined;
    overridePrice?: number | null | undefined;
    image?: string | null | undefined;
    stock?: number | undefined;
    blurb?: string | undefined;
    badge?: string | undefined;
  }>) => Promise<{ imported: number; updated: number }>;
}

export function BulkImportDialog({
  open,
  onOpenChange,
  categories,
  onImport,
}: BulkImportDialogProps) {
  const [csvContent, setCsvContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ imported: number; updated: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleCsv = `sku,name,categoryId,basePrice,isPriceOverridden,overridePrice,stock,badge,blurb
13070,3MM RED DIFFUSED LED,electronics,2.50,false,,100,New,High luminance 3mm red diffused indicator LED.
2048,ESP8266 ESP-12F MODULE,iot-and-microcontrollers,185,false,,40,,Wi-Fi SoC module with integrated PCB antenna.
15890,PRO 60W SOLDERING IRON HEATING ELEMENT,repair-kits,220,true,249,25,Special Deal,Ceramic core replacement heating element for 60W stations.`;

  const handleDownloadTemplate = () => {
    const blob = new Blob([sampleCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "lasertronics_product_import_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvContent(event.target?.result as string);
      setError(null);
      setResult(null);
    };
    reader.readAsText(file);
  };

  const parseAndImport = async () => {
    if (!csvContent.trim()) {
      setError("Please paste CSV data or upload a CSV file.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const lines = csvContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        throw new Error("CSV must contain a header row and at least one product row.");
      }

      const firstLine = lines[0];
      if (!firstLine) {
        throw new Error("CSV must contain a header row and at least one product row.");
      }

      const headers = firstLine.split(",").map((h) => h.trim().toLowerCase());
      const skuIdx = headers.indexOf("sku");
      const nameIdx = headers.indexOf("name");
      const catIdx = headers.indexOf("categoryid");
      const basePriceIdx = headers.indexOf("baseprice");
      const overrideToggleIdx = headers.indexOf("ispriceoverridden");
      const overridePriceIdx = headers.indexOf("overrideprice");
      const stockIdx = headers.indexOf("stock");
      const badgeIdx = headers.indexOf("badge");
      const blurbIdx = headers.indexOf("blurb");

      if (skuIdx === -1 || nameIdx === -1) {
        throw new Error('CSV must include "sku" and "name" columns.');
      }

      const parsedProducts = [];

      for (let i = 1; i < lines.length; i++) {
        const row = lines[i];
        if (!row) continue;
        const cols = row.split(",").map((c) => c.trim());
        const sku = cols[skuIdx];
        const name = cols[nameIdx];
        if (!sku || !name) continue;

        const catCol = catIdx !== -1 ? cols[catIdx] : undefined;
        const categoryId = catCol && catCol.length > 0 ? catCol : categories[0]?.id || "electronics";
        const basePriceStr = basePriceIdx !== -1 ? cols[basePriceIdx] : undefined;
        const basePrice = basePriceStr ? parseFloat(basePriceStr) || 0 : 100;
        const overrideToggleStr = overrideToggleIdx !== -1 ? cols[overrideToggleIdx] : undefined;
        const isPriceOverridden =
          Boolean(overrideToggleStr && ["true", "1", "yes"].includes(overrideToggleStr.toLowerCase()));
        const overridePriceStr = overridePriceIdx !== -1 ? cols[overridePriceIdx] : undefined;
        const overridePrice = overridePriceStr ? parseFloat(overridePriceStr) || null : null;
        const stockStr = stockIdx !== -1 ? cols[stockIdx] : undefined;
        const stock = stockStr ? parseInt(stockStr, 10) || 0 : 10;
        const badgeCol = badgeIdx !== -1 ? cols[badgeIdx] : undefined;
        const badge = badgeCol && badgeCol.length > 0 ? badgeCol : undefined;
        const blurbCol = blurbIdx !== -1 ? cols[blurbIdx] : undefined;
        const blurb = blurbCol && blurbCol.length > 0 ? blurbCol : undefined;

        parsedProducts.push({
          sku,
          name,
          categoryId,
          basePrice,
          isPriceOverridden,
          overridePrice,
          stock,
          badge,
          blurb,
        });
      }

      if (parsedProducts.length === 0) {
        throw new Error("No valid product rows found in CSV.");
      }

      const res = await onImport(parsedProducts);
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to import CSV");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl bg-white border border-slate-200/80 shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Bulk Product Import & Update
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Quickly add new products or batch update base prices and categories using CSV.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="gap-1.5 text-xs rounded-xl h-8 border-slate-200 text-blue-700 hover:bg-blue-50"
            >
              <Download className="size-3.5" /> Download Template
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                <span>
                  Bulk import completed! <strong>{result.imported}</strong> new products added,{" "}
                  <strong>{result.updated}</strong> existing products updated.
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors">
                <Upload className="size-3.5 text-blue-600" /> Upload CSV File
              </span>
              <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleFileUpload} />
            </label>
            <span className="text-xs text-slate-400">or paste CSV data below:</span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="csv-data" className="text-xs font-semibold text-slate-700">
              CSV Content
            </Label>
            <Textarea
              id="csv-data"
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder={sampleCsv}
              rows={8}
              className="font-mono text-xs rounded-xl resize-none p-3 leading-relaxed"
            />
          </div>

          <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 text-[11px] text-slate-500 space-y-1">
            <span className="font-semibold text-slate-700 block">Available Categories:</span>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {categories.map((c) => (
                <code key={c.id} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[10px] text-slate-700">
                  {c.id} ({c.markupPercentage}%)
                </code>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-9 text-xs"
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={isProcessing || !csvContent.trim()}
            onClick={parseAndImport}
            className="rounded-xl h-9 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          >
            {isProcessing ? "Processing..." : "Run Bulk Import"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
