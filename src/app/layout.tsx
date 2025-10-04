import "@ant-design/v5-patch-for-react-19"; // 👈 phải nằm đầu tiên
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App } from "antd"; // 👈 thêm dòng này
import NextAuthWarpper from "@/library/next-auth.warpper";
import "@/app/globals.css";

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
        <AntdRegistry>
          <App>
            <NextAuthWarpper>{children}</NextAuthWarpper>
          </App>
        </AntdRegistry>
      </body>
    </html>
  );
}
