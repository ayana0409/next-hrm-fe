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
  const [msg, contextHolder] = message.useMessage();
  const { RangePicker } = DatePicker;

  const [data, setData] = useState<PagingResponse>();
  const [filters, setFilters] = useState<any>(initialFilters || {});
  const [searchStatus, setSearchStatus] = useState();
  const [openEmpModal, setOpenEmpModal] = useState(false);
  const [searchDate, setSearchDate] = useState<
    [start: Dayjs | null | undefined, end: Dayjs | null | undefined]
  >([null, null]);

  const isMounted = useRef(false);

  const fetchData = async () => {
    dispatch(startLoading());

    try {
      // Lấy filter động từ state (ví dụ: "position" | "department" | "user")
      const { type, id, current, pageSize } = filters;

      // Gửi đúng query param tùy theo loại filter
      const params: Record<string, any> = {
        current: current || 1,
        pageSize: pageSize || 10,
      };

      if (type === "user" && id) {
        params.userId = id;
      } else if (type === "department" && id) {
        params.targetType = "DEPARTMENT";
        params.targetId = id;
      } else if (type === "position" && id) {
        params.targetType = "POSITION";
        params.targetId = id;
      }

      // Gọi API
      const res = await axiosAuth.get(`${NOTIFICATION_ENDPOINT}/paged`, {
        params,
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
      setFilters({ ...initialFilters, filter: filters.filter });
    }
  }, [initialFilters]);

  return (
    <div>
      {contextHolder}
      <Title level={2} className="text-center uppercase">
        notification management
      </Title>
      <div className="pb-4">
        <div className="items-center justify-between lg:flex ms:grid grid-cols-1">
          <div className="text-center lg:text-left pb-2">
            <CreateNotificationButton onCreated={fetchData} />
          </div>
          {/* <Space className="border rounded-md p-2 w-full bg-gray-300 lg:w-fit justify-between">
           
            <Select
              placeholder="Tìm theo trạng thái"
              value={searchStatus}
              options={[
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
              ]}
              onChange={(value) => handleStatusChange(value)}
              allowClear
            />
            |
            <button
              className="bg-gray-400 text-shadow-neutral-950 hover:bg-gray-600 rounded px-3 py-1 transition shadow-sm"
              onClick={() => {
                handleStatusChange(undefined);
                handleDateChange([null, null]);
              }}
            >
              <SyncOutlined />
            </button>
          </Space> */}
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
    </div>
  );
}
