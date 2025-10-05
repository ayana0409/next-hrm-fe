"use client";
import CrudTable from "../../crud/CrudTable";
import CreateUserButton from "./createDepartment";
import EditUserButton from "./editDepartment";
import DeleteUserButton from "./deleteDepartmentr";
import { CrudConfig } from "../../crud/crud-types";
const tableConfig: CrudConfig<any> = {
  entity: "department",
  columns: [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
  ],
};

export interface TableProps {
  data: any[];
  meta: any;
}

export default function DepartmentTable({ data, meta }: TableProps) {
  return (
    <div>
      <CreateUserButton />
      <CrudTable
        config={tableConfig}
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
