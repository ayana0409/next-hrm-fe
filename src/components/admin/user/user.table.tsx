"use client";
import CrudTable from "../../crud/CrudTable";
import CreateUserButton from "./create-user";
import EditUserButton from "./edit-user";
import DeleteUserButton from "./delete-user";
import { PagingResponse } from "../../crud/crud-types";
import { TableProps } from "@/types/table";
import { USER_ENDPOINT, USER_FIELDS } from "./user.const";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useAxiosAuth } from "@/utils/customHook";
import { fieldsToColumns, fieldsToArray } from "@/utils/fields";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Input, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import UserChangePasswordButton from "./user-change-password";

const columns = fieldsToColumns(fieldsToArray(USER_FIELDS, true));

export default function UserTable({ filters: initialFilters }: TableProps) {
  const { status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const dispatch = useDispatch();

  const [data, setData] = useState<PagingResponse>();
  const [filters, setFilters] = useState<any>(initialFilters || {});
  const [searchValue, setSearchValue] = useState("");

  const isMounted = useRef(false);

  const fetchData = async () => {
    dispatch(startLoading());
    await axiosAuth.get(USER_ENDPOINT, { params: filters }).then((res) => {
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

  useEffect(() => {
    if (status === "authenticated") {
      const timeout = setTimeout(() => {
        let newFilters = filters;

        if (searchValue) {
          const filterObj = JSON.stringify({
            $or: [
              { username: { $regex: searchValue, $options: "i" } },
              { role: { $regex: searchValue, $options: "i" } },
            ],
          });
          if (newFilters.filter !== filterObj) {
            newFilters = { ...newFilters, filter: filterObj };
          }
        } else if (newFilters.filter) {
          newFilters = { ...newFilters };
          delete newFilters.filter;
        }

        if (newFilters !== filters) {
          setFilters(newFilters);
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [searchValue]);

  useEffect(() => {
    if (JSON.stringify(initialFilters) !== JSON.stringify(filters)) {
      setFilters({ ...initialFilters, filter: filters.filter });
    }
  }, [initialFilters]);

  return (
    <div>
      <Title level={2} className="text-center uppercase">
        user management
      </Title>
      <div className="pb-4">
        <div className="items-center justify-between lg:flex ms:grid grid-cols-1">
          <div className="text-center lg:text-left pb-2">
            <CreateUserButton onCreated={fetchData} />
          </div>
          <Space className="border rounded-md p-2 w-full bg-gray-300 lg:w-fit justify-between">
            <Input
              placeholder="Tìm theo username, email hoặc họ tên..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
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
            <EditUserButton onUpdated={fetchData} record={record} />
            <UserChangePasswordButton userId={record._id} />
            <DeleteUserButton onDeleted={fetchData} id={record._id} />
          </Space>
        )}
      />
    </div>
  );
}
