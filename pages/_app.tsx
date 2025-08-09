import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Only redirect if not already on /welcome
    if (
      router.pathname !== "/welcome" &&
      !localStorage.getItem("percentle-welcomed")
    ) {
      localStorage.setItem("percentle-welcomed", "true");
      router.replace("/welcome");
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}