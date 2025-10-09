"use client";
import CrudTable from "../../crud/CrudTable";
import CreateUserButton from "./createUser";
import EditUserButton from "./editUser";
import DeleteUserButton from "./deleteUser";
import { PagingResponse } from "../../crud/crud-types";
import { TableProps } from "@/types/table";
import { USER_ENDPOINT, USER_FIELDS } from "./user.const";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { useAxiosAuth } from "@/utils/customHook";
import { fieldsToColumns, fieldsToArray } from "@/utils/fields";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Input, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";

const columns = fieldsToColumns(fieldsToArray(USER_FIELDS, true));

export default function UserTable({ filters: initialFilters }: TableProps) {
  const { data: session, status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const dispatch = useDispatch();

  const [data, setData] = useState<PagingResponse>();
  const [filters, setFilters] = useState<any>(initialFilters || {});
  const [searchValue, setSearchValue] = useState("");

  const fetchData = async () => {
    try {
      const res = await axiosAuth.get(USER_ENDPOINT, { params: filters });
      const { items, current, pageSize, pages, totalItem } = res.data.data;
      setData({
        items,
        meta: { current, pageSize, pages, totalItem },
      });
    } catch (error) {
      console.error("Fetch users failed:", error);
    }
  };

  useEffect(() => {
    dispatch(startLoading());
    if (status === "authenticated" && session?.access_token) {
      fetchData().finally(() => dispatch(stopLoading()));
    }
  }, [status, session, filters]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue.trim()) {
        setFilters({
          ...filters,
          filter: JSON.stringify({
            $or: [
              { username: { $regex: searchValue, $options: "i" } },
              { role: { $regex: searchValue, $options: "i" } },
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
          <CreateUserButton />
          <Space>
            <Input
              placeholder="Tìm theo username, email hoặc họ tên..."
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
            <EditUserButton record={record} />
            <DeleteUserButton id={record._id} />
          </Space>
        )}
      />
    </div>
  );
}
