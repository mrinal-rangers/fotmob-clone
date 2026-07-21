import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { googleSignIn } from "../api";
import { GOOGLE_CLIENT_ID } from "../config";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (el: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleSignIn(idToken: string) {
    googleSignIn(idToken)
      .then((res) => {
        login(res.token, res.admin);
        navigate("/");
      })
      .catch((err) => alert("Login failed: " + err.message));
  }

  function initGoogle() {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: { credential: string }) => handleSignIn(response.credential),
      });
      const btn = document.getElementById("google-signin-btn");
      if (btn) window.google.accounts.id.renderButton(btn, { theme: "outline", size: "large" });
    }
  }

  if (typeof window !== "undefined") {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      document.head.appendChild(script);
    } else {
      initGoogle();
    }
  }

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Admin Login</h2>
      <p>Sign in with your Google account to manage data</p>
      <div id="google-signin-btn" />
    </div>
  );
}
