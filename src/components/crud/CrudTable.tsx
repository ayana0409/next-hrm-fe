"use client";
import { Table } from "antd";
import { useSearchParams, useRouter } from "next/navigation";

export interface BaseRecord {
  id: string | number;
  [key: string]: any;
}

export interface CrudTableProps<T extends BaseRecord> {
  columns: any[];
  items: T[] | undefined;
  meta: any;
  actions?: (record: T) => React.ReactNode;
}

export default function CrudTable<T extends BaseRecord>({
  columns,
  items,
  meta,
  actions,
}: CrudTableProps<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const columnsAction = [
    ...columns,
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
    <div className="w-full overflow-x-auto">
      <Table
        rowKey={(record: any) => record.id || record._id}
        dataSource={items}
        columns={columnsAction}
        pagination={{
          current: meta?.current,
          pageSize: meta?.pageSize,
          total: meta?.totalItem,
          pageSizeOptions: ["10", "20", "50", "100"],
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            const query = new URLSearchParams(searchParams.toString());
            query.set("current", String(page));
            query.set("pageSize", String(pageSize));
            router.push(`?${query.toString()}`);
          },
        }}
        scroll={{ x: "max-content" }} // cho phép cuộn ngang theo nội dung
        style={{ width: "100%" }}
      />
    </div>
  );
}
