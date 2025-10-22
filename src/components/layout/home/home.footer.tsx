"use client";
import { Layout } from "antd";

const HomeFooter = () => {
  const { Footer } = Layout;

  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        Nest HRM ©{new Date().getFullYear()} Created by @thuan
      </Footer>
    </>
  );
};

export default HomeFooter;
