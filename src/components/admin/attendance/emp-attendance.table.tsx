"use client";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useAxiosAuth } from "@/utils/customHook";
import { fieldsToColumns, fieldsToArray } from "@/utils/fields";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { message, Pagination, Space, Table } from "antd";
import { ATTENDANCE_ENDPOINT, ATTENDANCE_FIELDS } from "./attendance.const";
import { PagingResponse } from "@/components/crud/crud-types";
import { TableProps } from "@/types/table";

const columns = fieldsToColumns(fieldsToArray(ATTENDANCE_FIELDS, true));
const instructs = [
  { color: "#FF5959", label: "On time" },
  { color: "#FFB66B", label: "Half day" },
  { color: "#72FF6B", label: "Full day" },
];
export default function EmpAttendanceTable({
  employeeId,
}: {
  employeeId: string;
}) {
  const { status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const [data, setData] = useState<PagingResponse>();
  const [msg, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<any>({
    pageSize: 10,
    current: 1,
    id: employeeId,
  });

  const isMounted = useRef(false);

  const fetchData = async () => {
    dispatch(startLoading());
    await axiosAuth
      .get(
        `${ATTENDANCE_ENDPOINT}/employee/${employeeId}?sort=startDate:desc`,
        {
          params: filters,
        }
      )
      .then((res) => {
        if (!res) return;
        const { items, current, pageSize, pages, totalItem } = res.data.data;

        setData({
          items,
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
        console.log(error.response);
      });
  };

  useEffect(() => {
    if (status === "authenticated" && employeeId) {
      if (!isMounted.current) {
        fetchData();
        isMounted.current = true;
      } else {
        fetchData();
      }
    }
  }, [status, filters, employeeId]);

  return (
    <>
      {contextHolder}
      <div className="h-max">
        <div className="pb-2">ATTENDANCE</div>
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
                onRow={(record) => {
                  return {
                    style: {
                      backgroundColor:
                        record.status == "on-time"
                          ? "#FF5959"
                          : record.status == "half-day"
                          ? "#FFB66B"
                          : "#72FF6B",
                    },
                  };
                }}
              />
            </div>

            {/* Phân trang cố định ở dưới */}
            <div className="border-t bg-white p-2">
              <Pagination
                current={data?.meta?.current}
                pageSize={data?.meta?.pageSize}
                total={data?.meta?.totalItem}
                pageSizeOptions={["7", "14", "21", "100"]}
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
          <Space size="large" align="center" className="px-4">
            {instructs.map((item, index) => (
              <Space key={index}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: item.color,
                    borderRadius: 4,
                  }}
                />
                <span>{item.label}</span>
              </Space>
            ))}
          </Space>
        </div>
      </div>
    </>
  );
}
