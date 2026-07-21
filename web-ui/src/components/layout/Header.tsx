import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSignedIn } from "@/hooks/use-auth";
import { signIn, signOut } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Menu, X, Search, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/lib/shadcn-ui/button";
import { Avatar, AvatarFallback } from "@/lib/shadcn-ui/avatar";

const NAV_ITEMS = [
  { label: "Home", path: "/" },
  { label: "Leagues", path: "/leagues" },
  { label: "Matches", path: "/matches" },
  { label: "News", path: "/news" },
  { label: "Transfers", path: "/transfers" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const signedIn = useSignedIn();
  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">FP</div>
          FootPulse
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "transition-colors hover:text-foreground/80",
                isActive(item.path) ? "text-foreground" : "text-foreground/60",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/search" className="hidden md:flex text-muted-foreground hover:text-foreground">
            <Search className="h-5 w-5" />
          </Link>
          {signedIn ? (
            <div className="flex items-center gap-2">
              <Link to="/settings">
                <Avatar className="h-8 w-8 cursor-pointer">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    U
                  </AvatarFallback>
                </Avatar>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => signOut()} title="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={() => signIn()}>
              Sign In
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t md:hidden">
          <nav className="flex flex-col p-4 gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.path)
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground/60 hover:bg-accent hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/search" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-foreground/60 hover:bg-accent hover:text-foreground">
              <Search className="mr-2 inline h-4 w-4" /> Search
            </Link>
            {signedIn ? (
              <button onClick={() => { setOpen(false); signOut(); }} className="rounded-md px-3 py-2 text-sm font-medium text-foreground/60 hover:bg-accent hover:text-foreground text-left">
                Sign Out
              </button>
            ) : (
              <button onClick={() => { setOpen(false); signIn(); }} className="rounded-md px-3 py-2 text-sm font-medium text-foreground/60 hover:bg-accent hover:text-foreground text-left">
                Sign In
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
