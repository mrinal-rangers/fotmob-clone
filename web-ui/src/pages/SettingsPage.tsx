import { useSignedIn } from "@/hooks/use-auth";
import { signIn } from "@/lib/auth";
import { useCurrentUser } from "@/hooks/use-user";
import { UnavailableCard } from "@/components/shared/ErrorStates";
import { Card, CardContent } from "@/lib/shadcn-ui/card";
import { Button } from "@/lib/shadcn-ui/button";
import { Skeleton } from "@/components/shared/ErrorStates";

export function SettingsPage() {
  const signedIn = useSignedIn();
  const { data: user, isLoading } = useCurrentUser();

  if (!signedIn) {
    return (
      <div className="space-y-6 text-center py-12">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Sign in to manage your settings</p>
        <Button onClick={() => signIn()}>Sign In</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold">Profile</h3>
            <p className="text-sm text-muted-foreground">{user?.name} — {user?.email}</p>
          </div>
          <div>
            <h3 className="font-semibold">Theme</h3>
            <p className="text-sm text-muted-foreground">{user?.theme || "System"}</p>
          </div>
          {user?.isAdmin && (
            <div>
              <h3 className="font-semibold">Admin</h3>
              <p className="text-sm text-muted-foreground">You have admin privileges</p>
            </div>
          )}
        </CardContent>
      </Card>
      <UnavailableCard message="Advanced settings coming soon" />
    </div>
  );
}
