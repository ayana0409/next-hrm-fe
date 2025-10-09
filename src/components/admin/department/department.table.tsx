"use client";
import CrudTable from "../../crud/CrudTable";
import { PagingResponse } from "../../crud/crud-types";
import DeleteDepartmentButton from "./deleteDepartment";
import EditDepartmentButton from "./editDepartment";
import CreateDepartmentButton from "./createDepartment";
import { TableProps } from "@/types/table";
import { useAxiosAuth } from "@/utils/customHook";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { DEPARTMENT_ENDPOINT, DEPARTMENT_FIELDS } from "./department.const";
import { fieldsToColumns, fieldsToArray } from "@/utils/fields";
import { Input, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";

const columns = fieldsToColumns(fieldsToArray(DEPARTMENT_FIELDS));
export default function DepartmentTable({
  filters: initialFilters,
}: TableProps) {
  const { data: session, status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const [data, setData] = useState<PagingResponse>();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<any>(initialFilters || {});
  const [searchValue, setSearchValue] = useState("");

  const fetchData = async () => {
    dispatch(startLoading());
    await axiosAuth
      .get(DEPARTMENT_ENDPOINT, { params: filters })
      .then((res) => {
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
      });

    dispatch(stopLoading());
  };

  useEffect(() => {
    dispatch(startLoading());
    if (status === "authenticated" && session?.access_token) {
      fetchData();
      dispatch(stopLoading());
    }
  }, [status, session, filters]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue.trim()) {
        setFilters({
          ...filters,
          filter: JSON.stringify({
            $or: [
              { name: { $regex: searchValue, $options: "i" } },
              { description: { $regex: searchValue, $options: "i" } },
            ],
          }),
        });
      } else {
        setFilters((prev: any) => {
          let newFilters = { ...prev };
          if (newFilters.filter) delete newFilters.filter;
          return newFilters;
        });
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  return (
    <div>
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <CreateDepartmentButton />
          <Space>
            <Input
              placeholder="Tìm kiếm"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <button
              className="bg-gray-400 text-shadow-neutral-950 hover:bg-gray-600 rounded px-3 py-1 transition shadow-sm"
              onClick={() => setSearchValue("")}
            >
              <SyncOutlined />
            </button>
          </Space>
        </div>
      </div>
      <CrudTable
        columns={columns}
        items={data?.items}
        meta={data?.meta}
        actions={(record) => (
          <Space>
            <EditDepartmentButton record={record} />
            <DeleteDepartmentButton id={record._id} />
          </Space>
        )}
      />
    </div>
  );
}
