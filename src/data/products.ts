import { useState, useEffect } from "react";
import usbcCable from "@/assets/p/usbc-cable.jpg";
import lightningCable from "@/assets/p/lightning-cable.jpg";
import powerbank from "@/assets/p/powerbank.jpg";
import magsafePowerbank from "@/assets/p/magsafe-powerbank.jpg";
import ganCharger from "@/assets/p/gan-charger.jpg";
import usbcCharger from "@/assets/p/usbc-charger.jpg";
import earbuds from "@/assets/p/earbuds.jpg";
import neckband from "@/assets/p/neckband.jpg";
import carHolder from "@/assets/p/car-holder.jpg";
import tripod from "@/assets/p/tripod.jpg";

import psuModule from "@/assets/p/psu-module.jpg";
import capacitorKit from "@/assets/p/capacitor-kit.jpg";
import resistorKit from "@/assets/p/resistor-kit.jpg";
import ledKit from "@/assets/p/led-kit.jpg";
import relay from "@/assets/p/relay.jpg";
import dcmotor from "@/assets/p/dcmotor.jpg";
import servo from "@/assets/p/servo.jpg";
import breadboard from "@/assets/p/breadboard.jpg";
import roboticsKit from "@/assets/p/robotics-kit.jpg";
import bluetoothModule from "@/assets/p/bluetooth-module.jpg";

import hdmiCable from "@/assets/p/hdmi-cable.jpg";
import hdmiSplitter from "@/assets/p/hdmi-splitter.jpg";
import hdmiSwitch from "@/assets/p/hdmi-switch.jpg";
import opticalCable from "@/assets/p/optical-cable.jpg";
import avConverter from "@/assets/p/av-converter.jpg";
import displayport from "@/assets/p/displayport.jpg";
import remote from "@/assets/p/remote.jpg";
import wallmount from "@/assets/p/wallmount.jpg";
import tvKeyboard from "@/assets/p/tv-keyboard.jpg";
import streamingAdapter from "@/assets/p/streaming-adapter.jpg";

import esp32 from "@/assets/p/esp32.jpg";
import nodemcu from "@/assets/p/nodemcu.jpg";
import uno from "@/assets/p/uno.jpg";
import nano from "@/assets/p/nano.jpg";
import piCase from "@/assets/p/pi-case.jpg";
import piAdapter from "@/assets/p/pi-adapter.jpg";
import iotKit from "@/assets/p/iot-kit.jpg";
import wifiSensor from "@/assets/p/wifi-sensor.jpg";
import pir from "@/assets/p/pir.jpg";
import ultrasonic from "@/assets/p/ultrasonic.jpg";

import screwdriverSet from "@/assets/p/screwdriver-set.jpg";
import multimeter from "@/assets/p/multimeter.jpg";
import solderingStation from "@/assets/p/soldering-station.jpg";
import repairToolkit from "@/assets/p/repair-toolkit.jpg";
import desolderPump from "@/assets/p/desolder-pump.jpg";
import antistatic from "@/assets/p/antistatic.jpg";
import solderWire from "@/assets/p/solder-wire.jpg";
import tweezers from "@/assets/p/tweezers.jpg";
import heatGun from "@/assets/p/heat-gun.jpg";
import pryTools from "@/assets/p/pry-tools.jpg";

export const imageCatalog = {
  usbcCable,
  lightningCable,
  powerbank,
  magsafePowerbank,
  ganCharger,
  usbcCharger,
  earbuds,
  neckband,
  carHolder,
  tripod,
  psuModule,
  capacitorKit,
  resistorKit,
  ledKit,
  relay,
  dcmotor,
  servo,
  breadboard,
  roboticsKit,
  bluetoothModule,
  hdmiCable,
  hdmiSplitter,
  hdmiSwitch,
  opticalCable,
  avConverter,
  displayport,
  remote,
  wallmount,
  tvKeyboard,
  streamingAdapter,
  esp32,
  nodemcu,
  uno,
  nano,
  piCase,
  piAdapter,
  iotKit,
  wifiSensor,
  pir,
  ultrasonic,
  screwdriverSet,
  multimeter,
  solderingStation,
  repairToolkit,
  desolderPump,
  antistatic,
  solderWire,
  tweezers,
  heatGun,
  pryTools,
};

export type Category = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  image: string;
  blurb: string;
  specs: { label: string; value: string }[];
  badge?: string;
  rating: number;
  reviews: number;
  stock: number;
};

export const defaultCategories: Category[] = [
  {
    slug: "mobile-accessories",
    name: "Mobile Accessories",
    tagline: "Charge, carry, connect",
    description:
      "Fast chargers, braided cables, power banks and audio gear tested for Sri Lankan mains and daily commutes.",
  },
  {
    slug: "electronics",
    name: "Electronics",
    tagline: "Components & modules",
    description:
      "Passive components, motors, relays and power modules for prototyping benches, labs and production runs.",
  },
  {
    slug: "tv-accessories",
    name: "TV Accessories",
    tagline: "Every screen, connected",
    description:
      "HDMI, optical and streaming accessories that keep home cinema and conference rooms running cleanly.",
  },
  {
    slug: "iot-and-microcontrollers",
    name: "IoT and Microcontrollers",
    tagline: "Build connected things",
    description:
      "Dev boards, sensors and starter kits for makers, university projects and industrial IoT deployments.",
  },
  {
    slug: "repair-kits",
    name: "Repair Kits",
    tagline: "Bench-grade tooling",
    description:
      "Soldering stations, precision drivers and ESD-safe tools trusted by service centres across the island.",
  },
];

// Live in-memory categories array (mutated in place to keep all existing module references in sync)
export const categories: Category[] = [...defaultCategories];

// Dynamic map for O(1) slug lookup
const liveCategoriesMap = new Map<string, Category>();
for (const cat of defaultCategories) {
  liveCategoriesMap.set(cat.slug, cat);
  liveCategoriesMap.set(cat.slug.toLowerCase(), cat);
}

// React subscriber listeners for reactive components
const categoryListeners = new Set<() => void>();

export function subscribeCategories(listener: () => void): () => void {
  categoryListeners.add(listener);
  return () => {
    categoryListeners.delete(listener);
  };
}

export function registerLiveCategories(items: Array<{ id?: string; slug?: string; name: string; tagline?: string; description?: string }>) {
  if (!items || !Array.isArray(items) || items.length === 0) return;

  for (const item of items) {
    const slug = item?.slug || item?.id;
    if (!slug) continue;
    const cat: Category = {
      slug,
      name: item.name,
      tagline: item.tagline || "",
      description: item.description || "",
    };
    liveCategoriesMap.set(slug, cat);
    liveCategoriesMap.set(slug.toLowerCase(), cat);
  }

  const uniqueCats = Array.from(new Set(liveCategoriesMap.values()));
  categories.length = 0;
  categories.push(...uniqueCats);

  categoryListeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.warn("Category listener error:", e);
    }
  });
}

export function getCategories(): Category[] {
  return categories;
}

export function useStoreCategories(): Category[] {
  const [cats, setCats] = useState<Category[]>(() => [...categories]);

  useEffect(() => {
    setCats([...categories]);
    const unsubscribe = subscribeCategories(() => {
      setCats([...categories]);
    });
    return unsubscribe;
  }, []);

  return cats;
}

import { seedProducts } from "./seed-products";

// Initial fallback products (full live catalog is served via server functions)
export const products: Product[] = seedProducts;

// Dynamic InTouch ERP & catalog live products cache
const liveProductsMap = new Map<string, Product>();

// Seed cache with the authentic catalog products
for (const item of products) {
  liveProductsMap.set(item.slug, item);
  liveProductsMap.set(item.slug.toLowerCase(), item);
}

export function registerLiveProducts(items: Product[]) {
  if (!items || !Array.isArray(items)) return;
  for (const item of items) {
    if (!item?.slug || (item.stock || 0) <= 0) continue;
    liveProductsMap.set(item.slug, item);
    liveProductsMap.set(item.slug.toLowerCase(), item);
    const skuSpec = item.specs?.find((s) => s.label === "SKU");
    if (skuSpec?.value) {
      liveProductsMap.set(skuSpec.value, item);
      liveProductsMap.set(skuSpec.value.toLowerCase(), item);
    }
  }
}

export function getRegisteredLiveProducts(): Product[] {
  return Array.from(new Set(liveProductsMap.values())).filter((p) => (p.stock || 0) > 0);
}

export const formatLKR = (value: number) =>
  `LKR ${value.toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;

export const getCategory = (slug: string) => {
  if (!slug) return undefined;
  const lower = slug.toLowerCase();
  return (
    liveCategoriesMap.get(slug) ||
    liveCategoriesMap.get(lower) ||
    categories.find((c) => c.slug === slug || c.slug.toLowerCase() === lower)
  );
};

export const productsByCategory = (slug: string, limit?: number) => {
  const liveList = getRegisteredLiveProducts().filter(
    (p) => p.category === slug && (p.stock || 0) > 0
  );
  return limit ? liveList.slice(0, limit) : liveList;
};

export const getProduct = (slug: string) => {
  const item =
    liveProductsMap.get(slug) ||
    liveProductsMap.get(slug.toLowerCase()) ||
    products.find((p) => p.slug === slug || p.slug.toLowerCase() === slug.toLowerCase());
  if (!item || (item.stock || 0) <= 0) return undefined;
  return item;
};

export const relatedProducts = (product: Product, limit = 4) => {
  const liveList = getRegisteredLiveProducts().filter(
    (p) => p.category === product.category && p.slug !== product.slug && (p.stock || 0) > 0,
  );
  return liveList.slice(0, limit);
};
