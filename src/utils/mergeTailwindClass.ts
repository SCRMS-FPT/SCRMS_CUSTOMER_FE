import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes correctly while still supporting clsx features
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
