import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: string | null | undefined) {
  if (!price) return "";
  const lowerPrice = price.toLowerCase();
  if (lowerPrice === "contact us" || lowerPrice.includes("contact")) return price;

  // Clean up old INR symbols
  let cleanPrice = price.replace(/^(₹|rs\.?)\s*/i, "").trim();

  // Map of currency codes to symbols
  const currencySymbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    AED: "د.إ",
    THB: "฿"
  };

  // Check if it starts with a known currency code
  const match = cleanPrice.match(/^(INR|USD|EUR|GBP|AED|THB)\s*(.*)/i);
  if (match) {
    const code = match[1].toUpperCase();
    const amount = match[2].trim();
    const symbol = currencySymbols[code];
    return `${symbol} ${amount}`;
  }

  // Default to INR if it starts with a digit (legacy data support)
  if (/^\d/.test(cleanPrice)) {
    return `₹ ${cleanPrice}`;
  }

  // Otherwise, return as is
  return cleanPrice;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (obj1 == null || typeof obj1 !== 'object' || obj2 == null || typeof obj2 !== 'object') {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!isEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}
