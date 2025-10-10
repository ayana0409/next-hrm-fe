"use client";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
  AppstoreOutlined,
  MailOutlined,
  ProfileOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import React, { useContext } from "react";
import { AdminContext } from "@/library/admin.context";
import { Drawer, Grid, type MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ItemType, MenuItemType } from "antd/es/menu/interface";

type MenuItem = Required<MenuProps>["items"][number];
const AdminSideBar = () => {
  const { Sider } = Layout;
  const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const pathname = usePathname();
  const items: ItemType[] = [
    {
      key: "grp",
      label: "Thuan HRM",
      type: "group",
      children: [
        {
          key: "/dashboard",
          label: <Link href={"/dashboard"}>Dashboard</Link>,
          icon: <AppstoreOutlined />,
        },
        {
          key: "/dashboard/user",
          label: <Link href={"/dashboard/user"}>Manage Users</Link>,
          icon: <TeamOutlined />,
        },
        {
          key: "/dashboard/department",
          label: <Link href={"/dashboard/department"}>Manage Departments</Link>,
          icon: <ProfileOutlined />,
        },
        {
          key: "/dashboard/position",
          label: <Link href={"/dashboard/position"}>Manage Position</Link>,
          icon: <TeamOutlined />,
        },
        {
          key: "/dashboard/employee",
          label: <Link href={"/dashboard/employee"}>Manage Employee</Link>,
          icon: <TeamOutlined />,
        },
        {
          key: "sub1",
          label: "Navigation One",
          icon: <MailOutlined />,
          children: [
            {
              key: "g1",
              label: "Item 1",
              type: "group",
              children: [
                { key: "1", label: "Option 1" },
                { key: "2", label: "Option 2" },
              ],
            },
            {
              key: "g2",
              label: "Item 2",
              type: "group",
              children: [
                { key: "3", label: "Option 3" },
                { key: "4", label: "Option 4" },
              ],
            },
          ],
        },
        {
          key: "sub2",
          label: "Navigation Two",
          icon: <AppstoreOutlined />,
          children: [
            { key: "5", label: "Option 5" },
            { key: "6", label: "Option 6" },
            {
              key: "sub3",
              label: "Submenu",
              children: [
                { key: "7", label: "Option 7" },
                { key: "8", label: "Option 8" },
              ],
            },
          ],
        },
        {
          type: "divider",
        },
        {
          key: "sub4",
          label: "Navigation Three",
          icon: <SettingOutlined />,
          children: [
            { key: "9", label: "Option 9" },
            { key: "10", label: "Option 10" },
            { key: "11", label: "Option 11" },
            { key: "12", label: "Option 12" },
          ],
        },
      ],
    },
  ];

  return (
    <>
      <div className="hidden md:block min-w-[80px] max-w-[200px] flex-shrink-0">
        <div className=" min-w-[80px] max-w-[200px] flex-shrink-0">
          <Sider collapsed={collapseMenu}>
            <Menu
              mode="inline"
              defaultSelectedKeys={["dashboard"]}
              items={items}
              selectedKeys={[pathname]}
              style={{ height: "100vh" }}
            />
          </Sider>
        </div>
      </div>

      {/* Menu ngang cho mobile */}
      {!screens.md && (
        <div className="block md:hidden fixed top-[64px] left-0 right-0 z-50 bg-white">
          <Drawer
            placement="left"
            closable
            onClose={() => setCollapseMenu(false)}
            open={collapseMenu}
            styles={{
              body: { padding: 0 },
              mask: { backgroundColor: "rgba(0,0,0,0.45)" },
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[pathname]}
              items={items}
              onClick={() => setCollapseMenu(false)}
            />
          </Drawer>
        </div>
      )}
    </>
    // <Sider collapsed={collapseMenu}>
    //   <Menu
    //     mode="inline"
    //     defaultSelectedKeys={["dashboard"]}
    //     items={items}
    //     selectedKeys={[pathname]}
    //     style={{ height: "100vh" }}
    //   />
    // </Sider>
  );
};

export default AdminSideBar;
