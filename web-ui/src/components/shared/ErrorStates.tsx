import { AlertCircle, WifiOff, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnavailableProps {
  message?: string;
  icon?: "error" | "offline" | "empty";
}

export function UnavailableCard({ message = "Data unavailable", icon = "error" }: UnavailableProps) {
  const Icon = icon === "offline" ? WifiOff : icon === "empty" ? Inbox : AlertCircle;
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8 text-muted-foreground">
      <Icon className="mb-2 h-8 w-8 opacity-50" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function PageError({ title = "Not Found", description = "The page you're looking for doesn't exist." }: { title?: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-20 w-full" />
    </div>
  );
}
