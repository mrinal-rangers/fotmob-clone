import { cn, formatDate } from "@/lib/utils";

interface DateNavBarProps {
  dates: string[];
  selected: string;
  onSelect: (date: string) => void;
}

export function DateNavBar({ dates, selected, onSelect }: DateNavBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {dates.map((date) => (
        <button
          key={date}
          onClick={() => onSelect(date)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
            selected === date
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent",
          )}
        >
          {formatDate(date)}
        </button>
      ))}
    </div>
  );
}

export function DateNavBarSkeleton() {
  return (
    <div className="flex gap-2 overflow-hidden">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="h-9 w-24 shrink-0 rounded-full bg-muted animate-pulse" />
      ))}
    </div>
  );
}
