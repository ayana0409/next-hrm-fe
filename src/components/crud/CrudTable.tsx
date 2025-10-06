"use client";
import { Table } from "antd";
import { CrudConfig } from "./crud-types";
import { useSearchParams, useRouter } from "next/navigation";

export interface BaseRecord {
  id: string | number;
  [key: string]: any;
}

export interface CrudTableProps<T extends BaseRecord> {
  config: CrudConfig<T>;
  data: T[];
  meta: any;
  actions?: (record: T) => React.ReactNode; // 👈 thêm custom actions slot
}

export default function CrudTable<T extends BaseRecord>({
  config,
  data,
  meta,
  actions,
}: CrudTableProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const columns = [
    ...config.columns,
    ...(actions
      ? [
          {
            title: "Actions",
            key: "actions",
            fixed: "right",
            width: 200,
            render: (_: any, record: T) => actions(record),
          },
        ]
      : []),
  ];

  return (
    <div className="overflow-x-auto w-full">
      <Table
        rowKey={(record: any) => record.id || record._id}
        dataSource={data}
        scroll={{ x: 1000 }}
        columns={columns}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.totalItem,
          pageSizeOptions: ["10", "20", "50", "100"],
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            const query = new URLSearchParams(searchParams.toString());
            query.set("current", String(page));
            query.set("pageSize", String(pageSize));
            router.push(`?${query.toString()}`);
          },
        }}
      />
    </div>
  );
}
