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
import store, { persistor } from "@/stores";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Layout from "./layout";
import { PersistGate } from "redux-persist/integration/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={null}
        persistor={persistor}
        onBeforeLift={() => {
          console.log("App is rehydrated and before rendering!");
        }}
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
        >
          <AuthProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AuthProvider>
        </GoogleOAuthProvider>
      </PersistGate>
    </Provider>
  );
}
