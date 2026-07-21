import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  const d = new Date(date);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

export function getDateArr(days: number = 6) {
  const dates: string[] = [];
  const today = new Date();
  for (let i = -days; i <= days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

export function getStatusBadge(status: string): { label: string; variant: "destructive" | "secondary" | "outline" | "default" } {
  switch (status) {
    case "LIVE":
    case "HT":
      return { label: status, variant: "destructive" };
    case "FT":
    case "AET":
    case "PEN":
      return { label: status, variant: "secondary" };
    case "POSTPONED":
    case "CANCELLED":
    case "ABANDONED":
      return { label: status, variant: "outline" };
    default:
      return { label: status, variant: "outline" };
  }
}

export function getFormColor(result: string): string {
  switch (result) {
    case "W": return "bg-green-500";
    case "D": return "bg-yellow-500";
    case "L": return "bg-red-500";
    default: return "bg-gray-500";
  }
}
