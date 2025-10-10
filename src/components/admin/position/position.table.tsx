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
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Input, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";

const columns = fieldsToColumns(fieldsToArray(POSITION_FIELDS));

export default function PositionTable({ filters: initialFilters }: TableProps) {
  const { status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const [data, setData] = useState<PagingResponse>();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<any>(initialFilters || {});
  const [searchValue, setSearchValue] = useState("");
  const isMounted = useRef(false);

  const fetchData = async () => {
    dispatch(startLoading());
    await axiosAuth.get(POSITION_ENDPOINT, { params: filters }).then((res) => {
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
              { title: { $regex: searchValue, $options: "i" } },
              { level: { $regex: searchValue, $options: "i" } },
              { description: { $regex: searchValue, $options: "i" } },
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
