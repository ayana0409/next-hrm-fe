"use client";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useAxiosAuth } from "@/utils/customHook";
import { fieldsToColumns, fieldsToArray } from "@/utils/fields";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { message, Pagination, Space, Table } from "antd";
import { PagingResponse } from "@/components/crud/crud-types";
import { TableProps } from "@/types/common/table";
import { SALARY_ENDPOINT, SALARY_FIELDS } from "./salary.const";
import Title from "antd/es/typography/Title";
import GenerateSalaryButton from "./generate-salary";

const columns = fieldsToColumns(fieldsToArray(SALARY_FIELDS, true));

export default function SalaryTable() {
  const { status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const [data, setData] = useState<PagingResponse>();
  const [msg, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<any>({
    pageSize: 10,
    current: 1,
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
      {contextHolder}
      <div className="h-max">
        <Title level={2} className="text-center uppercase">
          salary management
        </Title>
        <GenerateSalaryButton onCreated={fetchData} />
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
