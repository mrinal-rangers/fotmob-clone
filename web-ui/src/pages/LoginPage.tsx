import { SignIn } from "@clerk/clerk-react";
import { useTheme } from "@/providers/theme-provider";
import { Footprints } from "lucide-react";

export function LoginPage() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="mb-8 flex items-center gap-3">
        <Footprints className="h-10 w-10 text-footpulse-500" />
        <h1 className="text-4xl font-bold">FootPulse</h1>
      </div>
      <SignIn
        appearance={{
          baseTheme: resolvedTheme === "dark" ? undefined : undefined,
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg rounded-xl border",
          },
        }}
      />
    </div>
  );
}
