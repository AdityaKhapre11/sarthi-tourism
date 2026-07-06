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
