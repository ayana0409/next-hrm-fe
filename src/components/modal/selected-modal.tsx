import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { Modal, Input, Button, Table, Pagination, Spin, Space } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { ColumnType } from "antd/es/table";
import { stopLoading, startLoading } from "@/store/loadingSlice";
import { useAxiosAuth } from "@/utils/customHook";
import { PagingResponse } from "../crud/crud-types";

interface SelectModalProps<T> {
  visible: boolean;
  onCancel: () => void;
  onSelect: (selected: T) => void;
  apiRoute: string; // API route for fetching data
  searchFields: string[]; // Fields to search on (e.g., ["name", "email", "phone"])
  columns: ColumnType<T>[]; // Table columns configuration
  title: string; // Modal title
}

const SelectModal = <T extends { id: string }>({
  visible,
  onCancel,
  onSelect,
  apiRoute,
  searchFields,
  columns,
  title,
}: SelectModalProps<T>) => {
  const { data: session, status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMounted = useRef(false);

  const [data, setData] = useState<PagingResponse>();
  const [filters, setFilters] = useState<any>({ current: 1, pageSize: 10 });
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosAuth.get(apiRoute, { params: filters });
      const { items, current, pageSize, pages, totalItem } = res.data.data;
      setData({
        items,
        meta: { current, pageSize, pages, totalItem },
      });
    } catch (error) {
      console.error(`Fetch data from ${apiRoute} failed:`, error);
    } finally {
      setLoading(false);
      dispatch(stopLoading());
    }
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

  // Handle search
  useEffect(() => {
    if (status === "authenticated") {
      const timeout = setTimeout(() => {
        let newFilters = filters;

        if (searchValue) {
          const filterObj = {
            $or: searchFields.map((field) => ({
              [field]: { $regex: searchValue, $options: "i" },
            })),
          };
          const filterObjStr = JSON.stringify(filterObj);
          if (newFilters.filter !== filterObjStr) {
            newFilters = { ...newFilters, filter: filterObjStr };
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

  // Handle select
  const handleSelect = (record: T) => {
    onSelect(record);
    onCancel();
  };

  // Handle pagination
  const handlePaginationChange = (page: number, pageSize: number) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("current", String(page));
    query.set("pageSize", String(pageSize));
    router.push(`?${query.toString()}`);
    setFilters({ ...filters, current: page, pageSize });
  };

  // Add action column for selection
  const tableColumns: ColumnType<T>[] = [
    ...columns,
    {
      title: "Action",
      key: "action",
      render: (_: any, record: T) => (
        <Button type="primary" onClick={() => handleSelect(record)}>
          Select
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <div className="flex items-center gap-2 mb-4 pb-4">
        <Space>
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button
            className="bg-gray-400 hover:bg-gray-600"
            onClick={() => setSearchValue("")}
          >
            <SyncOutlined />
          </Button>
        </Space>
      </div>
      <div className="w-full max-h-[600px] flex flex-col overflow-hidden border rounded shadow">
        {/* Scrollable table content */}
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <Spin spinning={loading}>
            <Table
              rowKey={(record: T) => record.id}
              dataSource={data?.items}
              columns={tableColumns}
              pagination={false}
            />
          </Spin>
        </div>
        {/* Fixed pagination */}
        <div className="border-t bg-white p-2">
          <Pagination
            current={data?.meta.current}
            pageSize={data?.meta.pageSize}
            total={data?.meta.totalItem}
            pageSizeOptions={["10", "20", "50", "100"]}
            showSizeChanger
            onChange={handlePaginationChange}
            className="flex justify-center"
          />
        </div>
      </div>
    </Modal>
  );
};

export default SelectModal;
