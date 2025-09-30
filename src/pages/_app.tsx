import { AuthProvider } from "@/context/AuthContext";
import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { FuelProvider } from "@/context/FuelRequestContext";
import { ForgotPasswordProvider } from "@/context/ForgotPassword";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <FuelProvider>
        <ForgotPasswordProvider>
          <Toaster />
          <Component {...pageProps} />
        </ForgotPasswordProvider>
      </FuelProvider>
    </AuthProvider>
  );
}
