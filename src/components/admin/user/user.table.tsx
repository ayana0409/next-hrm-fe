"use client";
import CrudTable from "../../crud/CrudTable";
import CreateUserButton from "./createUser";
import EditUserButton from "./editUser";
import DeleteUserButton from "./deleteUser";
import { CrudConfig } from "../../crud/crud-types";
const userConfig: CrudConfig<any> = {
  entity: "User",
  columns: [
    { title: "Fullname", dataIndex: ["employee", "fullName"], key: "fullname" },
    { title: "Email", dataIndex: ["employee", "email"], key: "email" },
    { title: "Phone", dataIndex: ["employee", "phone"], key: "phone" },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Role", dataIndex: "role", key: "role" },
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
