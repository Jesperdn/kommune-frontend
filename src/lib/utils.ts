import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export const apiUrl = (path: string) => `${API_BASE}${path}`;

export const fetcher = (url: string) => fetch(apiUrl(url)).then((res) => res.json());

export const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat("nb-NO", {
        style: "currency",
        currency: "NOK",
        minimumFractionDigits: 0,
    }).format(amount);
