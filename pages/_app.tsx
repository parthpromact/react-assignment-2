import "@/styles/globals.css";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
// import { AuthProvider } from "@/context/AuthProvider";
const AuthProvider = dynamic(
  async () => {
    const module = await import("@/context/AuthProvider");
    return module.AuthProvider;
  },
  { ssr: false }
);
import { Provider } from "react-redux";
import store from "@/stores";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
      >
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}
