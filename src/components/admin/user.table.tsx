"use client";
import { usePaginationQuery } from "@/utils/customHook";
import { Button, Space, Table } from "antd";
import React from "react";

interface IProp {
  users: any;
  meta: {
    current: number;
    pageSize: number;
    pages: number;
    totalItem: number;
  };
}

const UserTable = (props: IProp) => {
  const { users, meta } = props;
  const { current, pageSize, updatePagination } = usePaginationQuery(
    meta.pageSize
  );

  const dataSource = users.map((item: any) => ({
    key: item.id,
    id: item._id,
    fullName: item.employee?.fullName,
    email: item.employee?.email,
    phone: item.employee?.phone,
    role: item.role,
    username: item.username,
  }));

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
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <>
          <Button
            type="primary"
            onClick={() => console.log("Update user", record.id)}
          >
            Update
          </Button>
          <Button danger onClick={() => console.log("Delete user", record.id)}>
            Delete
          </Button>
        </>
      ),
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
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={{
          current: current,
          pageSize: pageSize,
          total: meta.totalItem,
          showSizeChanger: true,
          // showTotal: (total, range) => {
          //   return <div>{range / total}</div>;
          // },
          onChange: updatePagination,
        }}
      />
    </>
  );
};

export default UserTable;
