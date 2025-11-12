"use client";
import CrudTable from "../../crud/CrudTable";
import { PagingResponse } from "../../crud/crud-types";
import { TableProps } from "@/types/common/table";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useAxiosAuth } from "@/utils/customHook";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button, Popover, Select, Space, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { NOTIFICATION_ENDPOINT } from "./notificaton.const";
import Title from "antd/es/typography/Title";
import CreateNotificationButton from "./create-notifitaion";
import { DepartmentSelectModal } from "../department/select-department.modal";
import EmployeeSelectModal from "../employee/select-employee.modal";
import { PositionSelectModal } from "../position/select-position.modal";

const column = [
  {
    title: "Message",
    key: "message",
    dataIndex: "message",
  },
  {
    title: "Send",
    key: "createdAt",
    dataIndex: "createdAt",
  },
  {
    title: "Seen",
    key: "read",
    dataIndex: "read",
    render: (value: boolean) => {
      return value ? (
        <Tooltip title="Seen">
          <CheckCircleOutlined
            className="text-xl"
            style={{ color: "#52c41a" }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Send">
          <ClockCircleOutlined
            className="text-xl"
            style={{ color: "#4395c4" }}
          />
        </Tooltip>
      );
    },
  },
];

const userColumn = [
  ...column,
  {
    title: "User",
    key: "username",
    dataIndex: "username",
  },
];

let depPosColumn = [
  ...column,
  {
    title: "Targets",
    key: "targets",
    dataIndex: "targets",
    render: (targets: string[] = []) => (
      <Tooltip title="Targets">
        <Popover
          content={targets.map((value: string, index: number) => (
            <div key={index}>{value}</div>
          ))}
          title="Targets"
          trigger="click"
        >
          <FileTextOutlined className="font-xl" />
        </Popover>
      </Tooltip>
    ),
  },
];

export default function NotificationTable({
  filters: initialFilters,
}: TableProps) {
  const { status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const dispatch = useDispatch();
  const [openEmpModal, setOpenEmpModal] = useState(false);
  const [openDepModal, setOpenDepModal] = useState(false);
  const [openPosModal, setOpenPosModal] = useState(false);
  const isMounted = useRef(false);

  const [data, setData] = useState<PagingResponse>();
  const [filters, setFilters] = useState<any>(initialFilters || {});

  const fetchData = async () => {
    dispatch(startLoading());

    try {
      const res = await axiosAuth.get(`${NOTIFICATION_ENDPOINT}/paged`, {
        params: filters,
      });

      if (res?.data?.data) {
        const { items, current, pageSize, pages, totalItem } = res.data.data;
        setData({
          items,
          meta: { current, pageSize, pages, totalItem },
        });
      }
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    } finally {
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

  useEffect(() => {
    if (JSON.stringify(initialFilters) !== JSON.stringify(filters)) {
      setFilters({
        ...filters,
        pageSize: initialFilters?.pageSize || 10,
        current: initialFilters?.current || 1,
      });
    }
  }, [initialFilters]);

  return (
    <div>
      <Title level={2} className="text-center uppercase">
        notification management
      </Title>
      <div className="pb-4">
        <div className="items-center justify-between lg:flex ms:grid grid-cols-1">
          <div className="text-center lg:text-left pb-2">
            <CreateNotificationButton onCreated={fetchData} />
          </div>
          <Space className="border rounded-md p-2 w-full bg-gray-300 lg:w-fit justify-between">
            <Select
              placeholder="Read Status"
              value={filters.read}
              options={[
                { label: "Seen", value: true },
                { label: "Send", value: false },
              ]}
              onChange={(value) => {
                setFilters((prev: any) => ({ ...prev, read: value }));
              }}
              allowClear
            />
            |
            <Select
              placeholder="Chose Notification Type"
              value={filters.targetType}
              options={[
                { label: "Individual", value: "individual" },
                { label: "Department", value: "department" },
                { label: "Position", value: "position" },
              ]}
              onChange={(value) =>
                setFilters((prev: any) => ({
                  ...prev,
                  targetType: value,
                  targetId: undefined,
                }))
              }
              allowClear
            />
            {filters.targetType === "individual" && (
              <Button type="primary" onClick={() => setOpenEmpModal(true)}>
                Chose Employee
              </Button>
            )}
            {filters.targetType === "department" && (
              <Button type="primary" onClick={() => setOpenDepModal(true)}>
                Chose Department
              </Button>
            )}
            {filters.targetType === "position" && (
              <Button type="primary" onClick={() => setOpenPosModal(true)}>
                Chose Position
              </Button>
            )}
            |
            <button
              className="bg-gray-400 text-shadow-neutral-950 hover:bg-gray-600 rounded px-3 py-1 transition shadow-sm"
              onClick={() => {
                setFilters((prev: any) => {
                  const { targetType, targetId, read, userId, ...rest } = prev;
                  return rest;
                });
              }}
            >
              <SyncOutlined />
            </button>
          </Space>
        </div>
      </div>

      <CrudTable
        columns={
          filters.targetType === "department" ||
          filters.targetType === "position"
            ? depPosColumn
            : userColumn
        }
        items={data?.items.map((item, index) => ({
          ...item,
          _id: index,
        }))}
        meta={data?.meta}
      />
      <EmployeeSelectModal
        visible={openEmpModal}
        onCancel={() => setOpenEmpModal(false)}
        onSelect={(value: any) =>
          setFilters((prev: any) => ({ ...prev, userId: value.id }))
        }
      />
      <DepartmentSelectModal
        visible={openDepModal}
        onCancel={() => setOpenDepModal(false)}
        onSelect={(value: any) =>
          setFilters((prev: any) => ({ ...prev, targetId: value._id }))
        }
      />
      <PositionSelectModal
        visible={openPosModal}
        onCancel={() => setOpenPosModal(false)}
        onSelect={(value: any) =>
          setFilters((prev: any) => ({ ...prev, targetId: value._id }))
        }
      />
    </div>
  );
}
