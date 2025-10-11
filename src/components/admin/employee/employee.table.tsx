"use client";
import CrudTable from "../../crud/CrudTable";
import { PagingResponse } from "../../crud/crud-types";
import { TableProps } from "@/types/table";
import { useAxiosAuth } from "@/utils/customHook";
import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { fieldsToColumns, fieldsToArray } from "@/utils/fields";
import { Input, Space, Tooltip } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { EMPLOYEE_FIELDS, EMPLOYEE_ROUTE } from "./employee.const";
import CreateEmployeeButton from "./create-employee";
import EditEmployeeButton from "./edit-employee";
import DeleteEmployeeButton from "./delete-employee";
import dayjs from "dayjs";
import { ProfileOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const columns = fieldsToColumns(fieldsToArray(EMPLOYEE_FIELDS));

export default function EmployeeTable({ filters: initialFilters }: TableProps) {
  const { status } = useSession({ required: true });
  const [data, setData] = useState<PagingResponse>();
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<any>(initialFilters || {});
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const axiosAuth = useAxiosAuth();
  const isMounted = useRef(false);
  const router = useRouter();

  const fetchData = async () => {
    dispatch(startLoading());
    await axiosAuth.get(EMPLOYEE_ROUTE, { params: filters }).then((res) => {
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
  }, [status, filters, initialFilters]);

  useEffect(() => {
    if (status === "authenticated") {
      const timeout = setTimeout(() => {
        let newFilters = filters;

        if (searchValue) {
          const filterObj = JSON.stringify({
            $or: [
              { fullname: { $regex: searchValue, $options: "i" } },
              { email: { $regex: searchValue, $options: "i" } },
              { phone: { $regex: searchValue, $options: "i" } },
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
          <CreateEmployeeButton onCreated={fetchData} />
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
          <Space>
            <Tooltip title="Leave request" className="m-2">
              <button
                onClick={() =>
                  router.push(
                    `/dashboard/employee/emp-leave-request?id=${
                      record.id
                    }&fullName=${encodeURIComponent(record.fullName)}`
                  )
                }
                aria-label="Edit"
                className="bg-gray-500 text-white hover:bg-gray-800 rounded px-3 py-1 transition shadow-sm"
              >
                <ProfileOutlined className="mr-2" />
              </button>
            </Tooltip>
            <EditEmployeeButton
              onUpdated={fetchData}
              record={{ ...record, dob: dayjs(record.dob) }}
            />
            <DeleteEmployeeButton onDeleted={fetchData} id={record.id} />
          </Space>
        )}
      />
    </div>
  );
}
