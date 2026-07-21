import { useState, useEffect } from "react";
import { onAuthChange, isSignedIn } from "@/lib/auth";

export function useSignedIn() {
  const [signedIn, setSignedIn] = useState(isSignedIn());

  useEffect(() => {
    return onAuthChange(setSignedIn);
  }, []);

  return signedIn;
}
