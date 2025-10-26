import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { Metadata } from "next";
import { Inter, Fira_Code as FiraCode } from "next/font/google";
import Script from "next/script";

import { GA_TRACKING_ID } from "lib/analytics";
import { oneLine } from "lib/util";

// Import global styles
import "styles/tailwind.scss";
import "styles/fonts.scss";
import "styles/app.scss";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
const firaCode = FiraCode({
  subsets: ["latin"],
  variable: "--font-fira-code",
});

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  metadataBase: new URL("https://bedrock.dev"),
  title: {
    default: "bedrock.dev - Minecraft Bedrock Documentation",
    template: "%s",
  },
  description: "Comprehensive documentation for Minecraft Bedrock Edition development",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
  appleWebApp: {
    title: "bedrock.dev",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@TheDestruc7i0n",
  },
  other: {
    "theme-color": "#ffffff",
  },
};

export default async function RootLayout({ children }: Props) {
  const isProduction = process.env.NODE_ENV !== "development";

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${firaCode.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link
          rel="preconnect"
          href="https://QLWYANMOJF-dsn.algolia.net"
          crossOrigin="anonymous"
        />

        {/* Google Analytics */}
        {isProduction && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <Script
              id="google-analytics"
              dangerouslySetInnerHTML={{
                __html: oneLine(`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}');
                `),
              }}
            />
          </>
        )}
      </head>
      <body>
        <ThemeProvider
          defaultTheme="system"
          attribute="class"
          disableTransitionOnChange
        >
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>

        {/* Simple Analytics */}
        <Script
          data-skip-dnt="true"
          async
          defer
          src="https://sa.bedrock.dev/latest.js"
        />
        <noscript>
          <img
            src="https://sa.bedrock.dev/noscript.gif?ignore-dnt=true"
            alt=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </noscript>
      </body>
    </html>
  );
}
