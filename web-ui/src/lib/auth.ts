const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

interface ClerkUser {
  id: string;
}

interface ClerkSession {
  getToken: () => Promise<string | null>;
}

interface ClerkSDK {
  user: ClerkUser | null;
  session: ClerkSession | null;
  load: () => Promise<void>;
  addListener: (fn: (event: Record<string, unknown>) => void) => () => void;
  openSignIn: (opts?: { modal?: boolean }) => void;
  signOut: () => Promise<void>;
}

let clerkInstance: ClerkSDK | null = null;
let loadingPromise: Promise<ClerkSDK> | null = null;
type Listener = (signedIn: boolean) => void;
const listeners = new Set<Listener>();

function getFrontendApi(key: string): string {
  const parts = key.split("_");
  const encoded = parts[parts.length - 1];
  try {
    const decoded = atob(encoded);
    return decoded;
  } catch {
    throw new Error("Invalid Clerk publishable key");
  }
}

async function loadClerkScript(): Promise<ClerkSDK> {
  const frontendApi = getFrontendApi(PUBLISHABLE_KEY);
  const url = `https://${frontendApi}/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`;

  return new Promise((resolve, reject) => {
    if ((window as any).Clerk) {
      resolve((window as any).Clerk as ClerkSDK);
      return;
    }

    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.crossOrigin = "anonymous";

    script.onload = () => {
      const clerk = new (window as any).Clerk(PUBLISHABLE_KEY) as ClerkSDK;
      resolve(clerk);
    };

    script.onerror = () => {
      reject(new Error("Failed to load Clerk JS from CDN"));
    };

    document.head.appendChild(script);
  });
}

export async function ensureClerk(): Promise<ClerkSDK> {
  if (clerkInstance) return clerkInstance;
  if (loadingPromise) return loadingPromise;

  loadingPromise = loadClerkScript().then(async (clerk) => {
    await clerk.load();
    clerkInstance = clerk;
    clerk.addListener((_event) => {
      const signedIn = !!clerkInstance?.user;
      listeners.forEach((fn) => fn(signedIn));
    });
    return clerk;
  });

  return loadingPromise;
}

export function onAuthChange(fn: Listener): () => void {
  listeners.add(fn);
  if (clerkInstance) {
    fn(!!clerkInstance.user);
  }
  return () => {
    listeners.delete(fn);
  };
}

export async function signIn() {
  const clerk = await ensureClerk();
  clerk.openSignIn({ modal: true });
}

export async function signOut() {
  if (clerkInstance) {
    await clerkInstance.signOut();
    clerkInstance = null;
    loadingPromise = null;
  }
}

export async function getToken(): Promise<string | null> {
  if (!clerkInstance?.user) return null;
  try {
    const tokenFn = clerkInstance.session?.getToken;
    return tokenFn ? await tokenFn() : null;
  } catch {
    return null;
  }
}

export function isSignedIn(): boolean {
  return !!clerkInstance?.user;
}
