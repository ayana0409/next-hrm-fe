"use client";
import { Layout } from "antd";

const EmployeeFooter = () => {
  const { Footer } = Layout;

  return (
    <>
      <Footer style={{ textAlign: "center" }}>
        Nest HRM ©{new Date().getFullYear()} Created by @thuan
      </Footer>
    </>
  );
};

export default EmployeeFooter;
