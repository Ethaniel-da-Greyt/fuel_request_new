import { AuthProvider } from "@/context/AuthContext";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { FuelProvider } from "@/context/FuelRequestContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <FuelProvider>
        <Toaster />
        <Component {...pageProps} />
      </FuelProvider>
    </AuthProvider>
  );
}
