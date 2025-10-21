"use client";
import CrudTable from "../../crud/CrudTable";
import { PagingResponse } from "../../crud/crud-types";
import { TableProps } from "@/types/table";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useAxiosAuth } from "@/utils/customHook";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button, DatePicker, message, Select, Space, Tooltip } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { NOTIFICATION_ENDPOINT } from "./notificaton.const";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import Title from "antd/es/typography/Title";
import EmployeeMutiSelectModal from "../employee/muti-select-employee.modal";
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

  // const updateStatus = async (id: string, status: LeaveRequestStatusEnum) => {
  //   dispatch(startLoading());
  //   await axiosAuth
  //     .patch(`${LEAVE_REQUEST_ENDPOINT}/${id}/status/${status}`)
  //     .then(() => {
  //       msg.success(status);
  //       fetchData();
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       msg.error(error?.response.data.message || "Failed");
  //     })
  //     .finally(() => {
  //       dispatch(stopLoading());
  //     });
  // };

  // const handleDateChange = (values: any) => {
  //   setSearchDate(values); // [startDate, endDate]if (values && values[0] && values[1]) {
  //   if (values && values[0] && values[1]) {
  //     const startDate = values[0].format("YYYY/MM/DD");
  //     const endDate = values[1].format("YYYY/MM/DD");

  //     setFilters((prev: any) => ({
  //       ...prev,
  //       startDate,
  //       endDate,
  //     }));
  //   } else {
  //     setFilters((prev: any) => {
  //       const { startDate, endDate, ...rest } = prev;
  //       return rest;
  //     });
  //   }
  // };

  // const handleStatusChange = (values: any) => {
  //   setSearchStatus(values);
  //   if (values) {
  //     setFilters((prev: any) => ({
  //       ...prev,
  //       status: values,
  //     }));
  //   } else {
  //     setFilters((prev: any) => {
  //       const { status, ...rest } = prev;
  //       return rest;
  //     });
  //   }
  // };

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
                { label: "Un seen", value: false },
              ]}
              onChange={(value) =>
                setFilters((prev: any) => ({ ...prev, read: value }))
              }
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
                  const { targetType, targetId, read, ...rest } = prev;
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
        columns={column}
        items={data?.items.map((item, index) => ({
          ...item,
          _id: index,
        }))}
        meta={data?.meta}
        // actions={(record) => (
        //   <Space>
        //     {record.status != LeaveRequestStatusEnum.Pending || (
        //       <EditLeaveRequestButton
        //         record={{
        //           ...record,
        //           startDate: dayjs(record.startDate),
        //           endDate: dayjs(record.endDate),
        //         }}
        //         onUpdated={fetchData}
        //       />
        //     )}
        //     {record.status === LeaveRequestStatusEnum.Approved || (
        //       <Tooltip title="Approve Request" className="m-2">
        //         <button
        //           onClick={() => {
        //             updateStatus(record.id, LeaveRequestStatusEnum.Approved);
        //           }}
        //           aria-label="Approve Request"
        //           className="bg-green-600 text-white hover:bg-green-800 rounded px-3 py-1 transition shadow-sm"
        //         >
        //           <CheckOutlined className="mr-2" />
        //         </button>
        //       </Tooltip>
        //     )}
        //     {record.status === LeaveRequestStatusEnum.Rejected || (
        //       <Tooltip title="Reject Request" className="m-2">
        //         <button
        //           onClick={() => {
        //             updateStatus(record.id, LeaveRequestStatusEnum.Rejected);
        //           }}
        //           aria-label="Reject Request"
        //           className="bg-red-600 text-white hover:bg-red-800 rounded px-3 py-1 transition shadow-sm"
        //         >
        //           <CloseOutlined className="mr-2" />
        //         </button>
        //       </Tooltip>
        //     )}
        //   </Space>
        // )}
      />
      <EmployeeSelectModal
        visible={openEmpModal}
        onCancel={() => setOpenEmpModal(false)}
        onSelect={(value: any) =>
          setFilters((prev: any) => ({ ...prev, targetId: value }))
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
