import "@ant-design/v5-patch-for-react-19";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App } from "antd";
import NextAuthWarpper from "@/library/next-auth.warpper";
import "@/app/globals.css";
import ReduxProvider from "@/provider/ReduxProvider";

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
      <body className={inter.className}>
        <ReduxProvider>
          <AntdRegistry>
            <App>
              <NextAuthWarpper>{children}</NextAuthWarpper>
            </App>
          </AntdRegistry>
        </ReduxProvider>
      </body>
    </html>
  );
}
