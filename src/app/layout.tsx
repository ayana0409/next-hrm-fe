import "@ant-design/v5-patch-for-react-19";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App } from "antd";
import NextAuthWarpper from "@/library/next-auth.warpper";
import "@/app/globals.css";
import ReduxProvider from "@/provider/ReduxProvider";
import LoadingOverlay from "@/components/loading-overlay";
import { SessionProvider } from "next-auth/react";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Thuan HRM",
  description: "Quản lý người dùng",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <body className={inter.className}>
        <SessionProvider>
          <ReduxProvider>
            <LoadingOverlay />
            <AntdRegistry>
              <App>
                <NextAuthWarpper>{children}</NextAuthWarpper>
              </App>
            </AntdRegistry>
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
