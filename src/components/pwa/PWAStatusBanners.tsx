import React, { useState } from "react";
import { usePWA } from "@/hooks/usePWA";
import {
  WifiOff,
  Download,
  RefreshCw,
  X,
  Share,
  PlusSquare,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Subtle Offline Status Indicator
 * Appears when network connection is lost, informing users without blocking browsing.
 */
export function PWAOfflineBanner() {
  const { isOnline } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (isOnline || dismissed) return null;

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 px-4 py-1.5 shadow-md border-b border-amber-400/40 backdrop-blur-md">
      <div className="container-page flex items-center justify-between gap-2 text-xs font-semibold">
        <div className="flex items-center gap-2 truncate">
          <WifiOff className="size-4 shrink-0 text-slate-950 animate-pulse" />
          <span className="truncate">
            <strong>Offline Mode:</strong> You are browsing cached catalog data. Online connectivity is required to place orders or refresh live ERP prices.
          </span>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-full p-1 hover:bg-black/10 transition-colors shrink-0"
          aria-label="Dismiss offline notice"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </div>
  );
}

/**
 * Service Worker Update Notification Banner
 * Prompts user to refresh when a new version of the app is available.
 */
export function PWAUpdateBanner() {
  const { needRefresh, updateServiceWorker } = usePWA();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-20 xl:bottom-6 right-4 z-50 max-w-sm rounded-2xl bg-slate-900 border border-blue-500/40 p-4 text-white shadow-2xl backdrop-blur-2xl animate-fade-up">
      <div className="flex items-start gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-blue-600 text-white shrink-0 shadow-sm">
          <Sparkles className="size-4.5" />
        </div>
        <div className="space-y-1 min-w-0">
          <h4 className="text-xs font-bold text-white">App Update Available</h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            A new version of Lasertronics E-Shop has been deployed.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={updateServiceWorker}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-500 shadow-sm transition-all"
            >
              <RefreshCw className="size-3" />
              Update Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Floating Install App Prompt Card
 * Displays when the browser fires beforeinstallprompt and user hasn't dismissed it.
 */
export function PWAInstallBanner() {
  const { isInstallable, isStandalone, triggerInstall, dismissInstall } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isInstallable || isStandalone) return null;

  const handleInstall = async () => {
    setIsInstalling(true);
    await triggerInstall();
    setIsInstalling(false);
  };

  return (
    <div className="fixed bottom-20 xl:bottom-6 left-4 z-40 max-w-sm rounded-2xl border border-white/80 bg-white/95 p-4 text-slate-900 shadow-2xl backdrop-blur-2xl animate-fade-up">
      <div className="flex items-start gap-3">
        <img
          src="/icon-192.png"
          alt="Lasertronics App"
          className="size-11 rounded-xl shadow-sm object-cover shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 truncate">
              Install Lasertronics App
            </span>
            <button
              type="button"
              onClick={() => dismissInstall(7)}
              className="rounded-full p-0.5 text-slate-400 hover:text-slate-700"
              title="Dismiss for 7 days"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">
            Faster loading, offline catalog access, and home screen launch.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={handleInstall}
              disabled={isInstalling}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0066FF] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0055d4] shadow-xs active:scale-95 transition-all"
            >
              <Download className="size-3" />
              Install
            </button>
            <button
              type="button"
              onClick={() => dismissInstall(7)}
              className="rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable Install App Button with iOS Fallback Modal
 */
export function PWAInstallButton({
  className = "",
  variant = "pill",
}: {
  className?: string;
  variant?: "pill" | "icon" | "card";
}) {
  const { isInstallable, isStandalone, triggerInstall } = usePWA();
  const [iosModalOpen, setIosModalOpen] = useState(false);

  if (isStandalone) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      await triggerInstall();
    } else {
      // If native prompt is not available (e.g. iOS Safari or already handled), show guide dialog
      setIosModalOpen(true);
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={handleClick}
          title="Install Lasertronics PWA"
          aria-label="Install Lasertronics PWA"
          className={`grid size-8.5 sm:size-10 place-items-center rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-600 shadow-xs backdrop-blur-md transition-all hover:bg-blue-600 hover:text-white hover:shadow-md active:scale-95 ${className}`}
        >
          <Download className="size-4 sm:size-4.5" />
        </button>
      ) : variant === "card" ? (
        <button
          type="button"
          onClick={handleClick}
          className={`flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 hover:from-blue-500 hover:to-indigo-500 transition-all ${className}`}
        >
          <span className="flex items-center gap-2">
            <Download className="size-4" /> Install Lasertronics App
          </span>
          <span className="text-[10px] rounded-md bg-white/20 px-2 py-0.5">PWA</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className={`inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-50/80 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-600 hover:text-white shadow-xs transition-all active:scale-95 ${className}`}
        >
          <Download className="size-3.5" />
          <span>Install App</span>
        </button>
      )}

      {/* iOS & Browser Fallback Guide Dialog */}
      <Dialog open={iosModalOpen} onOpenChange={setIosModalOpen}>
        <DialogContent className="max-w-md rounded-2xl bg-white border border-slate-200/80 shadow-2xl p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/icon-192.png"
                alt="Lasertronics E-Shop"
                className="size-12 rounded-xl object-cover shadow-sm"
              />
              <div>
                <DialogTitle className="text-base font-bold text-slate-900">
                  Install Lasertronics E-Shop
                </DialogTitle>
                <p className="text-xs text-slate-500">
                  Add to your home screen for quick access & offline browsing.
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs text-slate-700">
            <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3.5 space-y-2.5">
              <span className="font-bold text-slate-900 block text-xs">
                On iPhone & iPad (Safari):
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span>1. Tap the Share button</span>
                  <Share className="size-3.5 text-blue-600 inline shrink-0" />
                  <span>in the bottom toolbar.</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span>2. Scroll down and tap</span>
                  <strong className="text-slate-900">Add to Home Screen</strong>
                  <PlusSquare className="size-3.5 text-slate-700 inline shrink-0" />.
                </li>
                <li>3. Tap <strong>Add</strong> in the top right corner.</li>
              </ol>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3.5 space-y-2.5">
              <span className="font-bold text-slate-900 block text-xs">
                On Android (Chrome / Edge / Samsung Internet):
              </span>
              <p className="text-slate-600">
                Tap the three dots (<strong>⋮</strong>) in the browser toolbar, then tap <strong>Install App</strong> or <strong>Add to Home Screen</strong>.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200/70 p-3.5 space-y-2.5">
              <span className="font-bold text-slate-900 block text-xs">
                On Desktop (Chrome, Edge, Brave):
              </span>
              <p className="text-slate-600">
                Click the <strong>Install</strong> icon in the right side of the URL address bar.
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={() => setIosModalOpen(false)}
              className="apple-btn-primary rounded-xl px-5 py-2 text-xs font-bold"
            >
              Got it
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
