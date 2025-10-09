"use client";
import { TableProps } from "@/types/table";
import CrudTable from "../../crud/CrudTable";
import { PagingResponse } from "../../crud/crud-types";
import CreatePositionButton from "./createPosition";
import DeletePositionButton from "./deletePosition";
import EditPositionButton from "./editPosition";
import { POSITION_ENDPOINT, POSITION_FIELDS } from "./position.const";
import { startLoading, stopLoading } from "@/store/loadingSlice";
import { useAxiosAuth } from "@/utils/customHook";
import { fieldsToColumns, fieldsToArray } from "@/utils/fields";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Input, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";

const columns = fieldsToColumns(fieldsToArray(POSITION_FIELDS));

export default function PositionTable({ filters: initialFilters }: TableProps) {
  const { data: session, status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const [data, setData] = useState<PagingResponse>();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<any>(initialFilters || {});
  const [searchValue, setSearchValue] = useState("");

  const fetchData = async () => {
    await axiosAuth.get(POSITION_ENDPOINT, { params: filters }).then((res) => {
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
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchValue.trim()) {
        setFilters({
          ...filters,
          filter: JSON.stringify({
            $or: [
              { title: { $regex: searchValue, $options: "i" } },
              { level: { $regex: searchValue, $options: "i" } },
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

  useEffect(() => {
    dispatch(startLoading());
    if (status === "authenticated" && session?.access_token) {
      fetchData();
      dispatch(stopLoading());
    }
  }, [status, session, filters]);

  return (
    <div>
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <CreatePositionButton />
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
            <EditPositionButton record={record} />
            <DeletePositionButton id={record._id} />
          </Space>
        )}
      />
    </div>
  );
}
