import { useEffect } from "react";
import { useRouter } from "next/router";

// This function will set the token in a cookie
const setTokenCookie = (token) => {
  document.cookie = `strapi_token=${token}; path=/; max-age=2592000; SameSite=Lax`; // max-age=30 days
};

export default function AuthCallback() {
  const router = useRouter();
  const { asPath } = router; // Use asPath to get the full path including query

  useEffect(() => {
    // asPath will be like "/auth/callback?loginToken=..."
    // We check if it contains the query parameter before splitting
    if (asPath.includes("?")) {
      const queryString = asPath.split("?")[1];
      const params = new URLSearchParams(queryString);

      // --- THIS IS THE FIX ---
      // Look for "loginToken" instead of "token"
      const token = params.get("loginToken");

      if (token) {
        // 1. Save the token as a cookie
        setTokenCookie(token);

        // 2. Redirect to the main app page (which is now "/")
        router.replace("/");
      } else {
        // No token found, redirect to sign-in
        // I've also updated this to be more direct
        router.replace("/auth/login");
      }
    }
  }, [asPath, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-700">Authenticating, please wait...</p>
    </div>
  );
}
