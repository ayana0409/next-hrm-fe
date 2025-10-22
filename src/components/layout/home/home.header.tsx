"use client";
import { AdminContext } from "@/library/admin.context";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import { useContext } from "react";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { signOut, useSession } from "next-auth/react";

const HomeHeader = () => {
  const { data: session, status } = useSession();
  const { Header } = Layout;
  console.log("HomeHeader session:", session);
  const items: MenuProps["items"] = [
    {
      key: "1",
      disabled: session ? false : true,
      label: session ? (
        <a href={`employee/info`}>Info</a>
      ) : (
        <a>Login for more info</a>
      ),
    },
    {
      key: "2",
      disabled:
        session?.user.role && session?.user.role !== "employee" ? false : true,
      label: <a href={`dashboard`}>Dashboard</a>,
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
    {
      key: "4",
      label: session ? (
        <a onClick={() => signOut()}>LOG OUT</a>
      ) : (
        <a href="auth/login">LOGIN</a>
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
              Welcome
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
    </>
  );
};

export default HomeHeader;
