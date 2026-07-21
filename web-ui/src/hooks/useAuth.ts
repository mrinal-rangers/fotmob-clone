import { useState, useCallback } from "react";
import type { AdminSession } from "../types";

const AUTH_KEY = "auth";

interface AuthState {
  token: string;
  admin: AdminSession;
}

function loadAuth(): AuthState | null {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState | null>(loadAuth);

  const login = useCallback((token: string, admin: AdminSession) => {
    const data = { token, admin };
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    setState(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_KEY);
    setState(null);
  }, []);

  return {
    token: state?.token ?? null,
    admin: state?.admin ?? null,
    login,
    logout,
  };
}
