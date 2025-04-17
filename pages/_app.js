import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoadingAnimation from "@/components/Effects/Loading/LoadingAnimation";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo.js";
import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { DataProvider } from "@/context/DataContext";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <DataProvider>
        <ApolloProvider client={client}>
          {loading && <LoadingAnimation />}
          <Component {...pageProps} />
        </ApolloProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
