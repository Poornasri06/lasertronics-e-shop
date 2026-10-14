import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export interface PWAContextValue {
  isOnline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  needRefresh: boolean;
  triggerInstall: () => Promise<boolean>;
  dismissInstall: (days?: number) => void;
  updateServiceWorker: () => void;
}

const PWAContext = createContext<PWAContextValue>({
  isOnline: true,
  isInstallable: false,
  isInstalled: false,
  isStandalone: false,
  needRefresh: false,
  triggerInstall: async () => false,
  dismissInstall: () => {},
  updateServiceWorker: () => {},
});

const DISMISS_STORAGE_KEY = "lasertronics_pwa_install_dismissed_until";

export function PWAProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== "undefined" ? navigator.onLine : true;
  });

  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [needRefresh, setNeedRefresh] = useState<boolean>(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check if installation prompt was recently dismissed by user
    try {
      const dismissedUntil = localStorage.getItem(DISMISS_STORAGE_KEY);
      if (dismissedUntil && parseInt(dismissedUntil, 10) > Date.now()) {
        setIsDismissed(true);
      }
    } catch {
      // localStorage may be disabled in private mode
    }

    // 2. Online / Offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 3. Check standalone mode (installed PWA)
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const checkStandalone = () => {
      const standalone =
        mediaQuery.matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(Boolean(standalone));
      if (standalone) {
        setIsInstalled(true);
      }
    };
    checkStandalone();
    mediaQuery.addEventListener("change", checkStandalone);

    // 4. Capture native beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 5. Handle app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setIsDismissed(true);
      try {
        localStorage.removeItem(DISMISS_STORAGE_KEY);
      } catch {
        // ignore
      }
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // 6. Service Worker Registration and Update Tracking
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Check if there is already a waiting worker
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setNeedRefresh(true);
          }

          // Listen for new workers being installed
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New update available
                setWaitingWorker(newWorker);
                setNeedRefresh(true);
              }
            });
          });
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });

      // Reload page when new service worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      mediaQuery.removeEventListener("change", checkStandalone);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Trigger native install prompt
  const triggerInstall = useCallback(async (): Promise<boolean> => {
    if (!installPrompt) {
      return false;
    }

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        setInstallPrompt(null);
        return true;
      }
      return false;
    } catch (err) {
      console.warn("[PWA] Install prompt failed:", err);
      return false;
    }
  }, [installPrompt]);

  // Dismiss install prompt for N days (default 7 days)
  const dismissInstall = useCallback((days: number = 7) => {
    setIsDismissed(true);
    try {
      const until = Date.now() + days * 24 * 60 * 60 * 1000;
      localStorage.setItem(DISMISS_STORAGE_KEY, String(until));
    } catch {
      // ignore
    }
  }, []);

  // Update service worker immediately
  const updateServiceWorker = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
  }, [waitingWorker]);

  const value: PWAContextValue = {
    isOnline,
    isInstallable: Boolean(installPrompt) && !isStandalone && !isDismissed,
    isInstalled,
    isStandalone,
    needRefresh,
    triggerInstall,
    dismissInstall,
    updateServiceWorker,
  };

  return <PWAContext.Provider value={value}>{children}</PWAContext.Provider>;
}

export function usePWAContext(): PWAContextValue {
  return useContext(PWAContext);
}
