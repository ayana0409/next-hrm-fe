"use client";
import { Layout } from "antd";

const AdminFooter = () => {
  const { Footer } = Layout;

  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        HRM System ©{new Date().getFullYear()} Created by Dương Đoàn Thuận
      </Footer>
    </>
  );
};

export default AdminFooter;
