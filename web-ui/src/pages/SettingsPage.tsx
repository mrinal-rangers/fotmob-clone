import { useTheme } from "@/providers/theme-provider";
import { useCurrentUser } from "@/hooks/use-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/shadcn-ui/card";
import { Switch } from "@/lib/shadcn-ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/shadcn-ui/avatar";
import { Sun, Moon, Monitor } from "lucide-react";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: user } = useCurrentUser();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user.avatarUrl || ""} />
              <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.isAdmin && (
                <span className="text-xs text-footpulse-500 font-medium">Admin</span>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            onClick={() => setTheme("light")}
            className={`flex w-full items-center gap-3 rounded-lg border p-4 transition-colors ${
              theme === "light" ? "border-primary bg-accent" : "hover:bg-accent/50"
            }`}
          >
            <Sun className="h-5 w-5" />
            <span className="font-medium">Light</span>
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex w-full items-center gap-3 rounded-lg border p-4 transition-colors ${
              theme === "dark" ? "border-primary bg-accent" : "hover:bg-accent/50"
            }`}
          >
            <Moon className="h-5 w-5" />
            <span className="font-medium">Dark</span>
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`flex w-full items-center gap-3 rounded-lg border p-4 transition-colors ${
              theme === "system" ? "border-primary bg-accent" : "hover:bg-accent/50"
            }`}
          >
            <Monitor className="h-5 w-5" />
            <span className="font-medium">System</span>
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
