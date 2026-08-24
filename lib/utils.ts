import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: string | null | undefined) {
  if (!price) return "";
  const lowerPrice = price.toLowerCase();
  if (lowerPrice === "contact us" || lowerPrice.includes("contact")) return price;
  
  // Remove existing currency symbols and whitespace
  const cleanPrice = price.replace(/^(₹|rs\.?|inr)\s*/i, "").trim();
  return `₹ ${cleanPrice}`;
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
