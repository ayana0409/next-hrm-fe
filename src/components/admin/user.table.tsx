"use client";
import { sendRequest } from "@/utils/api";
import { Button, Table } from "antd";
import { log } from "console";
import React from "react";

type User = {
  _id: string;
  username: string;
  role: string;
  employee: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
  };
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type UserResponse = {
  data: {
    items: User[];
  };
};

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
      const res = await sendRequest<UserResponse>({
        url: "http://localhost:8080/api/v1/user",
        method: "GET",
      });
      const formatted = res.data.items.map((user: any) => ({
        key: user._id,
        fullName: user.employee.fullName,
        email: user.employee.email,
        phone: user.employee.phone,
        username: user.username,
        role: user.role,
      }));

      setDataSource(formatted);
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
