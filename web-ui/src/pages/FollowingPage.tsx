import { useFollows, useUnfollow } from "@/hooks/use-follows";
import { Card, CardContent, CardHeader, CardTitle } from "@/lib/shadcn-ui/card";
import { Button } from "@/lib/shadcn-ui/button";
import { Heart, X } from "lucide-react";

export function FollowingPage() {
  const { data: follows, isLoading } = useFollows();
  const unfollow = useUnfollow();

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Following</h1>

      {!follows || follows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <Heart className="h-12 w-12" />
          <p>You're not following anything yet</p>
          <p className="text-sm">Browse leagues and teams to follow them</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {follows.map((follow) => (
            <Card key={follow.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold">
                    {(follow.entity as any)?.name?.[0] || follow.entityId[0]}
                  </div>
                  <div>
                    <p className="font-medium">{(follow.entity as any)?.name || follow.entityId}</p>
                    <p className="text-xs text-muted-foreground">{follow.entityType}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => unfollow.mutate(follow.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
