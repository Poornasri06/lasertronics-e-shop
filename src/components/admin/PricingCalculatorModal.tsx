import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategoryRecord, calculateSellingPrice, formatINR } from "@/lib/catalog-store";
import { Calculator, ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";

interface PricingCalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoryRecord[];
  onGoToRules?: () => void;
}

export function PricingCalculatorModal({
  open,
  onOpenChange,
  categories,
  onGoToRules,
}: PricingCalculatorModalProps) {
  const [testBasePrice, setTestBasePrice] = useState<number>(100);

  const quickPresets = [50, 100, 250, 500, 1000, 2500, 5000];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl bg-white border border-slate-200/80 shadow-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
              <Calculator className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900">
                Interactive Category Pricing Calculator
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Test and compare selling prices across all category markup rules in real time.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Formula banner */}
          <div className="rounded-xl border border-blue-200/70 bg-gradient-to-r from-blue-50 to-indigo-50/50 p-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
              Standard Formula Applied
            </span>
            <p className="font-mono text-sm font-bold text-slate-900">
              Selling Price = Base Price + (Base Price × Category Markup % ÷ 100)
            </p>
          </div>

          {/* Base Price input and quick presets */}
          <div className="space-y-3">
            <Label htmlFor="calc-base" className="text-xs font-semibold text-slate-700">
              Enter Test Base Price (₹)
            </Label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-base">₹</span>
              <Input
                id="calc-base"
                type="number"
                min="0"
                step="1"
                value={testBasePrice}
                onChange={(e) => setTestBasePrice(parseFloat(e.target.value) || 0)}
                className="pl-9 h-11 text-lg font-bold text-slate-900 rounded-xl"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-medium text-slate-500 mr-1">Quick Presets:</span>
              {quickPresets.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTestBasePrice(val)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    testBasePrice === val
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* Results table across all categories */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-700">
              Category Impact Comparison
            </Label>

            <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              <div className="grid grid-cols-12 bg-slate-50/80 px-4 py-2 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <div className="col-span-5">Category & Tagline</div>
                <div className="col-span-2 text-right">Markup %</div>
                <div className="col-span-2 text-right">Markup Amount</div>
                <div className="col-span-3 text-right">Final Selling Price</div>
              </div>

              {categories.map((c) => {
                const markupAmount = Math.round(((testBasePrice * c.markupPercentage) / 100) * 100) / 100;
                const finalSelling = calculateSellingPrice(testBasePrice, c.markupPercentage);

                return (
                  <div key={c.id} className="grid grid-cols-12 items-center px-4 py-3 hover:bg-slate-50/50 transition-colors">
                    <div className="col-span-5 min-w-0 pr-2">
                      <span className="font-semibold text-xs text-slate-900 block truncate">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {c.tagline}
                      </span>
                    </div>

                    <div className="col-span-2 text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold font-mono">
                        +{c.markupPercentage}%
                      </span>
                    </div>

                    <div className="col-span-2 text-right font-mono text-xs text-slate-600 font-semibold">
                      +{formatINR(markupAmount)}
                    </div>

                    <div className="col-span-3 text-right">
                      <span className="font-mono text-sm font-extrabold text-slate-900 block">
                        {formatINR(finalSelling)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          {onGoToRules ? (
            <Button
              type="button"
              onClick={() => {
                onOpenChange(false);
                onGoToRules();
              }}
              className="rounded-xl h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 shadow-sm"
            >
              <span>Manage Category Rules</span>
              <ArrowRight className="size-3.5" />
            </Button>
          ) : <div />}

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl h-9 text-xs"
          >
            Close Calculator
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
