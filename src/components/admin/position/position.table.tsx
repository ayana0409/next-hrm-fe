"use client";
import { TableProps } from "@/types/table";
import CrudTable from "../../crud/CrudTable";
import { CrudConfig } from "../../crud/crud-types";
import CreatePositionButton from "./createPosition";
import DeletePositionButton from "./deletePosition";
import EditPositionButton from "./editPosition";
const tableConfig: CrudConfig<any> = {
  entity: "department",
  columns: [
    { title: "Title", dataIndex: "title", key: "title", fixed: true },
    { title: "Level", dataIndex: "level", key: "level" },
    { title: "Salary", dataIndex: "salary", key: "salary" },
    { title: "Description", dataIndex: "description", key: "description" },
  ],
};

export default function PositionTable({ data, meta }: TableProps) {
  return (
    <div>
      <CreatePositionButton />
      <CrudTable
        config={tableConfig}
        data={data}
        meta={meta}
        actions={(record) => (
          <>
            <EditPositionButton record={record} />
            <DeletePositionButton id={record._id} />
          </>
        )}
      />
    </div>
  );
}
