import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useTheme } from "@/providers/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/shadcn-ui/avatar";
import { Button } from "@/lib/shadcn-ui/button";
import { Separator } from "@/lib/shadcn-ui/separator";
import { cn } from "@/lib/utils";
import {
  Home,
  Trophy,
  Heart,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Footprints,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { path: "/", label: "Matches", icon: Home },
  { path: "/leagues", label: "Leagues", icon: Trophy },
  { path: "/following", label: "Following", icon: Heart },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function RootLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-200 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-6 py-4">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <Footprints className="h-6 w-6 text-footpulse-500" />
              FootPulse
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Separator />
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Separator />
          <div className="p-4">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex items-center justify-between border-b bg-card px-4 py-3 lg:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3 ml-auto">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>FP</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
