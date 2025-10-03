"use client";
import api from "@/utils/api";
import { Button, Table } from "antd";
import React from "react";

interface UserRow {
  key: string;
  username: string;
  role: string;
  fullName: string;
  email: string;
  phone: string;
}

const UserTable = () => {
  const [dataSource, setDataSource] = React.useState<UserRow[]>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      await api.get("user").then((response) => {
        console.log(response);
        const formatted = response.data.items.map((user: any) => ({
          key: user._id,
          fullName: user.employee.fullName,
          email: user.employee.email,
          phone: user.employee.phone,
          username: user.username,
          role: user.role,
        }));
        setDataSource(formatted);
      });
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Fullname",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },

    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <span>Manager Users</span>
        <Button>Create User</Button>
      </div>
      <Table bordered dataSource={dataSource} columns={columns} />
    </>
  );
};

export default UserTable;
