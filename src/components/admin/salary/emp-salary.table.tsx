"use client";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useAxiosAuth } from "@/utils/customHook";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Pagination, Table } from "antd";
import { PagingResponse } from "@/components/crud/crud-types";
import { SALARY_ENDPOINT } from "./salary.const";
import { Salary } from "@/types/salary";
import ExportSalary from "./export-salary";

const columns = [
  {
    title: "Month",
    key: "month",
    dataIndex: "month",
  },
  {
    title: "Base salary",
    key: "baseSalary",
    dataIndex: "baseSalary",
    render: (value: number) => new Intl.NumberFormat("vi-VN").format(value),
  },
  {
    title: "Bonus",
    key: "bonus",
    dataIndex: "bonus",
    render: (value: number) => new Intl.NumberFormat("vi-VN").format(value),
  },
  {
    title: "Deductions",
    key: "deductions",
    dataIndex: "deductions",
    render: (value: number) => new Intl.NumberFormat("vi-VN").format(value),
  },
  {
    title: "Net",
    key: "netSalary",
    dataIndex: "netSalary",
    render: (value: number) => new Intl.NumberFormat("vi-VN").format(value),
  },
  {
    title: "Action",
    key: "action",
    dataIndex: "action",
    width: 50,
  },
];

export default function EmpSalaryTable({ employeeId }: { employeeId: string }) {
  const { status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const [data, setData] = useState<PagingResponse>();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<any>({
    pageSize: 10,
    current: 1,
    filter: JSON.stringify({
      $or: [{ employeeId: { $regex: employeeId, $options: "i" } }],
    }),
  });

  const isMounted = useRef(false);

  const fetchData = async () => {
    dispatch(startLoading());

    await axiosAuth
      .get(`${SALARY_ENDPOINT}`, {
        params: filters,
      })
      .then((res) => {
        if (!res) return;
        const { items, current, pageSize, pages, totalItem } = res.data.data;
        console.log(items);
        setData({
          items: items.map((item: Salary) => ({
            ...item,
            action: <ExportSalary data={item} />,
          })),
          meta: {
            current,
            pageSize,
            pages,
            totalItem,
          },
        });
        dispatch(stopLoading());
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (!isMounted.current) {
        fetchData();
        isMounted.current = true;
      } else {
        fetchData();
      }
    }
  }, [status, filters]);

  return (
    <>
      <div className="h-max">
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <div className="w-full max-h-[600px] flex flex-col overflow-hidden border rounded shadow">
            {/* Nội dung bảng cuộn */}
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <Table
                rowKey={(record: any) => record.id || record._id}
                dataSource={data?.items}
                columns={columns}
                pagination={false}
                rowHoverable={false}
                rowClassName={() => "h-8 rounded rounded-lg text-xs"}
              />
            </div>

            {/* Phân trang cố định ở dưới */}
            <div className="border-t bg-white p-2">
              <Pagination
                current={data?.meta?.current}
                pageSize={data?.meta?.pageSize}
                total={data?.meta?.totalItem}
                pageSizeOptions={["10", "20", "50", "100"]}
                showSizeChanger
                onChange={(page, pageSize) => {
                  setFilters((prev: any) => ({
                    ...prev,
                    current: page,
                    pageSize,
                  }));
                }}
                className="flex justify-center"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
