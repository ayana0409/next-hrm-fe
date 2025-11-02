"use client";
import { Layout } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { signOut, useSession } from "next-auth/react";

const EmployeeHeader = () => {
  const { data: session, status } = useSession();
  const { Header } = Layout;

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <a href="/">Home</a>,
    },
    {
      key: "2",
      disabled:
        session?.user.role && session?.user.role !== "employee" ? false : true,
      label: <a href={`dashboard`}>Dashboard</a>,
    },
    {
      key: "3",
      danger: true,
      label: (
        <a
          className="bg-red-400 hover:bg-red-800 text-white font-bold"
          onClick={() => signOut()}
        >
          LOG OUT
        </a>
      ),
    },
  ];

  return (
    <>
      <Header
        style={{
          padding: 0,
          display: "flex",
          background: "#f5f5f5",
          justifyContent: "right",
          alignItems: "center",
        }}
      >
        <Dropdown menu={{ items }}>
          <a
            onClick={(e) => e.preventDefault()}
            style={{
              color: "unset",
              lineHeight: "0 !important",
              marginRight: 20,
            }}
          >
            <Space>
              Welcome {session?.user?.username ?? ""}
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
    </>
  );
};

export default EmployeeHeader;
