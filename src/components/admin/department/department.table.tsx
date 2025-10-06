"use client";
import CrudTable from "../../crud/CrudTable";
import { CrudConfig } from "../../crud/crud-types";
import DeleteDepartmentButton from "./deleteDepartment";
import EditDepartmentButton from "./editDepartment";
import CreateDepartmentButton from "./createDepartment";
import { TableProps } from "@/types/table";
const tableConfig: CrudConfig<any> = {
  entity: "department",
  columns: [
    { title: "Name", dataIndex: "name", key: "name", fixed: true },
    { title: "Description", dataIndex: "description", key: "description" },
  ],
};

export default function DepartmentTable({ data, meta }: TableProps) {
  return (
    <div>
      <CreateDepartmentButton />
      <CrudTable
        config={tableConfig}
        data={data}
        meta={meta}
        actions={(record) => (
          <>
            <EditDepartmentButton record={record} />
            <DeleteDepartmentButton id={record._id} />
          </>
        )}
      />
    </div>
  );
}
