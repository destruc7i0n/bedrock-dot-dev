import { useEffect } from "react";
import type { AppType } from "next/app";
import Router from "next/router";

import { Inter, Fira_Code as FiraCode } from "next/font/google";

import { ThemeProvider } from "next-themes";

import { appWithTranslation } from "next-i18next";

import NProgress from "nprogress";

import * as analytics from "lib/analytics";

import "styles/tailwind.scss";
import "styles/fonts.scss";
import "styles/app.scss";

NProgress.configure({ showSpinner: false });

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeError", () => NProgress.done());
Router.events.on("routeChangeComplete", (url: string) => {
  NProgress.done();
  analytics.pageview(url);

  // https://github.com/vercel/next.js/issues/5161#issuecomment-421197307
  setTimeout(() => {
    if (location.hash) location = location;
  }, 0);
});

// Router.events.on('hashChangeStart', () => console.log('hashChangeStart'))
// Router.events.on('hashChangeComplete', () => console.log('hashChangeComplete'))

const inter = Inter({ subsets: ["latin"] });
const firaCode = FiraCode({ subsets: ["latin"] });

const App: AppType = ({ Component, pageProps }) => {
  useEffect(() => {
    console.log("Hey there!");
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-fira-code: ${firaCode.style.fontFamily};
        }
      `}</style>
      <ThemeProvider
        defaultTheme="system"
        attribute="class"
        disableTransitionOnChange
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
};

export default appWithTranslation(App);
