"use client";
import { Pagination, Table } from "antd";
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
            render: (_: any, record: T) => actions(record),
          },
        ]
      : []),
  ];

  return (
    <div className="w-full max-h-[600px] flex flex-col overflow-hidden border rounded shadow">
      {/* Nội dung bảng cuộn */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        <Table
          rowKey={(record: any) => record.id || record._id}
          dataSource={items}
          columns={columnsAction}
          pagination={false}
        />
      </div>

      {/* Phân trang cố định ở dưới */}
      <div className="border-t bg-white p-2">
        <Pagination
          current={meta?.current}
          pageSize={meta?.pageSize}
          total={meta?.totalItem}
          pageSizeOptions={["10", "20", "50", "100"]}
          showSizeChanger
          onChange={(page, pageSize) => {
            const query = new URLSearchParams(searchParams.toString());
            query.set("current", String(page));
            query.set("pageSize", String(pageSize));
            router.push(`?${query.toString()}`);
          }}
          className="flex justify-center"
        />
      </div>
    </div>
  );
}
