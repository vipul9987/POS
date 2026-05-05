import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generateInvoiceNumber(existingCount: number = 0) {
  const date = new Date();
  const yearMonth = date.getFullYear().toString().slice(-2) + 
                    (date.getMonth() + 1).toString().padStart(2, '0');
  const sequence = (existingCount + 1).toString().padStart(4, '0');
  return `INV-${yearMonth}-${sequence}`;
}

export function getDaysLeft(trialEnds: string) {
  const diffTime = new Date(trialEnds).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}
