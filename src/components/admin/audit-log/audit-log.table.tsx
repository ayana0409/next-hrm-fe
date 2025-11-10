"use client";
import CrudTable from "../../crud/CrudTable";
import { PagingResponse } from "../../crud/crud-types";
import { TableProps } from "@/types/common/table";
import { useAxiosAuth } from "@/utils/customHook";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { fieldsToColumns, fieldsToArray } from "@/utils/fields";
import { Button, Input, Popover, Space, Tooltip } from "antd";
import { FileTextOutlined, SyncOutlined } from "@ant-design/icons";
import Title from "antd/es/typography/Title";
import { AUDIT_LOG_ENDPOINT, AUDIT_LOG_FIELDS } from "./audit-log.const";

const columns = fieldsToColumns(fieldsToArray(AUDIT_LOG_FIELDS));
export default function AuditLogTable({ filters: initialFilters }: TableProps) {
  const { status } = useSession({ required: true });
  const [data, setData] = useState<PagingResponse>();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<any>(initialFilters || {});
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const axiosAuth = useAxiosAuth();
  const isMounted = useRef(false);

  const fetchData = async () => {
    dispatch(startLoading());
    await axiosAuth.get(AUDIT_LOG_ENDPOINT, { params: filters }).then((res) => {
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
              { module: { $regex: searchValue, $options: "i" } },
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
        department management
      </Title>
      <div className="pb-4">
        <div className="items-center justify-between lg:flex ms:grid grid-cols-1">
          <Space className="border rounded-md p-2 w-full bg-gray-300 lg:w-fit justify-between">
            <Input
              placeholder="Tìm kiếm"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              allowClear
            />
            <button
              className="bg-gray-400 text-shadow-neutral-950 hover:bg-gray-600 rounded px-3 py-1 transition shadow-sm"
              onClick={() => setSearchValue(undefined)}
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
          <Tooltip title="Details">
            <Popover
              content={
                record.details ? (
                  <pre
                    style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {JSON.stringify(JSON.parse(record.details), null, 2)}
                  </pre>
                ) : (
                  "None"
                )
              }
              title="Details"
              trigger="click"
            >
              <FileTextOutlined className="font-xl" />
            </Popover>
          </Tooltip>
        )}
      />
    </div>
  );
}
