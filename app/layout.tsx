import { ThemeProvider } from "next-themes";

import { NextIntlClientProvider } from "next-intl";

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  return (
    <html>
      <body>
        <ThemeProvider
          defaultTheme="system"
          attribute="class"
          disableTransitionOnChange
        >
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
