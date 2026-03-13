import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This helper handles Tailwind CSS classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This helper formats your money for Ghana
export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(amount);
}