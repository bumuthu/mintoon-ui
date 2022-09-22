import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";

import store from "store";

let persistor = persistStore(store);

import "react-toastify/dist/ReactToastify.css";
import "../style.css";

import theme from "theme";
import { useEffect } from "react";
import MainLayout from "components/templates/main";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (document && document.querySelector("html"))
      //@ts-ignore
      document.querySelector("html").style.overflowX = "hidden";
  }, []);
  return (
    <>
      <Head>
        <title>Mintoon</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ToastContainer />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
