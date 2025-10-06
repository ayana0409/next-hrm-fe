"use client";
import CrudTable from "../../crud/CrudTable";
import CreateUserButton from "./createUser";
import EditUserButton from "./editUser";
import DeleteUserButton from "./deleteUser";
import { CrudConfig } from "../../crud/crud-types";
const userConfig: CrudConfig<any> = {
  entity: "User",
  columns: [
    {
      title: "Fullname",
      dataIndex: ["employee", "fullName"],
      key: "fullname",
      fixed: true,
      width: 300,
    },
    {
      title: "Email",
      dataIndex: ["employee", "email"],
      key: "email",
      width: 300,
    },
    {
      title: "Phone",
      dataIndex: ["employee", "phone"],
      key: "phone",
      width: 130,
    },
    { title: "Username", dataIndex: "username", key: "username", width: 300 },
    { title: "Role", dataIndex: "role", key: "role", width: 100 },
  ],
};

export interface UserTableProps {
  data: any[];
  meta: any;
}

export default function UserTable({ data, meta }: UserTableProps) {
  return (
    <div>
      <CreateUserButton />
      <CrudTable
        config={userConfig}
        data={data}
        meta={meta}
        actions={(record) => (
          <>
            <EditUserButton record={record} />
            <DeleteUserButton id={record._id} />
          </>
        )}
      />
    </div>
  );
}
