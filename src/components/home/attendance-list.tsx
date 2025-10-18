import { startLoading, stopLoading } from "@/store/loading-slice";
import api from "@/utils/api";
import { fieldsToColumns, fieldsToArray } from "@/utils/fields";
import { Space, Input, Table, Pagination } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useDispatch } from "react-redux";
import {
  ATTENDANCE_FIELDS,
  ATTENDANCE_ENDPOINT,
  attendanceTableInstructs,
} from "../admin/attendance/attendance.const";
import { PagingResponse } from "../crud/crud-types";
import Title from "antd/es/typography/Title";
import { SyncOutlined } from "@ant-design/icons";
import { TableProps } from "@/types/table";

const columns = fieldsToColumns(fieldsToArray(ATTENDANCE_FIELDS, true));

export type AttendanceListRef = {
  fetchData: () => void;
};

const AttendanceList = forwardRef<AttendanceListRef, TableProps>(
  ({ filters: initialFilters }, ref) => {
    const [filters, setFilters] = useState<any>(initialFilters || {});
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState<string | undefined>();
    const [data, setData] = useState<PagingResponse>();
    const isMounted = useRef(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const addedColumns = [
      ...columns,
      {
        title: "Full Name",
        dataIndex: "fullName",
      },
    ];

    useEffect(() => {
      if (JSON.stringify(initialFilters) !== JSON.stringify(filters)) {
        setFilters((prev: any) => ({
          ...prev,
          current: initialFilters.current,
          pageSize: initialFilters.pageSize,
        }));
      }
    }, [initialFilters]);

    const fetchData = async () => {
      dispatch(startLoading());
      await api
        .get(ATTENDANCE_ENDPOINT + "/today", { params: filters })
        .then((res) => {
          if (!res) return;
          console.log("Attendance data fetched:", res.data);
          const { items, current, pageSize, pages, totalItem } = res.data;

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

    useImperativeHandle(ref, () => ({
      fetchData,
    }));

    useEffect(() => {
      if (!isMounted.current) {
        fetchData();
        isMounted.current = true;
      } else {
        fetchData();
      }
    }, [filters]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        if (searchValue) {
          // thêm hoặc cập nhật fullName
          setFilters((prev: any) => ({
            ...prev,
            fullName: searchValue,
          }));
        } else {
          // xóa fullName khỏi filters
          setFilters((prev: any) => {
            const { fullName, ...rest } = prev;
            return rest;
          });
        }
      }, 500);
      return () => clearTimeout(timeout);
    }, [searchValue]);

    return (
      <div>
        <Title level={4} className="text-center">
          Danh sách
        </Title>
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
        <div className="w-full max-h-[600px] flex flex-col overflow-hidden border rounded shadow">
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <Table
              rowKey={(record: any) => record.id || record._id}
              dataSource={data?.items}
              columns={addedColumns}
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

          <div className="border-t bg-white p-2">
            <Pagination
              current={data?.meta?.current}
              pageSize={data?.meta?.pageSize}
              total={data?.meta?.totalItem}
              pageSizeOptions={["7", "14", "21", "100"]}
              showSizeChanger
              onChange={(page, pageSize) => {
                const query = new URLSearchParams(searchParams.toString());
                query.set("current", String(page));
                query.set("pageSize", String(pageSize));
                router.push(`?${query.toString()}`);
              }}
              className="flex justify-center"
            />
          </div>
          <Space size="large" align="center" className="px-4">
            {attendanceTableInstructs.map((item, index) => (
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
    );
  }
);

export default AttendanceList;
