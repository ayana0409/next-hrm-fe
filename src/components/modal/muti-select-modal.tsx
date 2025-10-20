import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Modal,
  Input,
  Button,
  Table,
  Pagination,
  Spin,
  Space,
  message,
} from "antd";
import { SyncOutlined, CheckOutlined } from "@ant-design/icons";
import { ColumnType } from "antd/es/table";
import { useAxiosAuth } from "@/utils/customHook";
import { PagingResponse } from "../crud/crud-types";

export interface MultiSelectModalProps<T> {
  visible: boolean;
  onCancel: () => void;
  onSelect: (selectedIds: string[]) => void; // ✅ trả về danh sách ID
  apiRoute: string;
  searchFields: string[];
  columns: ColumnType<T>[];
  title: string;
}

const MultiSelectModal = <T extends { id?: string; _id?: string }>({
  visible,
  onCancel,
  onSelect,
  apiRoute,
  searchFields,
  columns,
  title,
}: MultiSelectModalProps<T>) => {
  const { status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMounted = useRef(false);

  const [data, setData] = useState<PagingResponse>();
  const [filters, setFilters] = useState<any>({ current: 1, pageSize: 10 });
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axiosAuth.get(apiRoute, { params: filters });
      if (!res) return;
      const { items, current, pageSize, pages, totalItem } = res.data.data;
      setData({
        items,
        meta: { current, pageSize, pages, totalItem },
      });
    } catch (error) {
      console.error(`Fetch data from ${apiRoute} failed:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
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

  // Handle confirm selection
  const handleConfirmSelection = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Vui lòng chọn ít nhất một mục.");
      return;
    }
    onSelect(selectedRowKeys.map((key) => key.toString()));
    onCancel();
    setSelectedRowKeys([]);
  };

  // Handle pagination
  const handlePaginationChange = (page: number, pageSize: number) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("current", String(page));
    query.set("pageSize", String(pageSize));
    router.push(`?${query.toString()}`);
    setFilters({ ...filters, current: page, pageSize });
  };

  // Add row selection (checkbox)
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={() => {
        onCancel();
        setSelectedRowKeys([]);
      }}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="confirm"
          type="primary"
          icon={<CheckOutlined />}
          onClick={handleConfirmSelection}
        >
          Confirm
        </Button>,
      ]}
      width={700}
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
            className="bg-gray-400 hover:bg-gray-600 text-white"
            onClick={() => setSearchValue("")}
          >
            <SyncOutlined />
          </Button>
        </Space>
      </div>

      <div className="w-full max-h-[600px] flex flex-col overflow-hidden border rounded shadow">
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <Spin spinning={loading}>
            <Table
              rowKey={(record) =>
                record.id ?? record._id ?? `fallback-${Math.random()}`
              }
              dataSource={data?.items}
              columns={columns}
              pagination={false}
              rowSelection={rowSelection} // ✅ bật chọn nhiều
            />
          </Spin>
        </div>

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

export default MultiSelectModal;
