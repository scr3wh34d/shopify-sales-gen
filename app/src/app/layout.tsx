import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ApolloProviderWrapper } from "@/lib/apollo/ApolloProviderWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shopify Sales Dashboard",
  description: "Analytics dashboard for Shopify sales data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
      </body>
    </html>
  );
}
