"use client";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useAxiosAuth } from "@/utils/customHook";
import { fieldsToColumns, fieldsToArray } from "@/utils/fields";
import { useSession } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Input, message, Space, Table, Tooltip } from "antd";
import { SyncOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import CreateLeaveRequestButton from "../leave-request/create-leave-request";
import EditLeaveRequestButton from "../leave-request/edit-leave-request";
import {
  LEAVE_REQUEST_ENDPOINT,
  LEAVE_REQUEST_FIELDS,
  LeaveRequestStatusEnum,
} from "../leave-request/leave-request.const";
import dayjs from "dayjs";
import EmpAttendanceTable from "../attendance/emp-attendance.table";

const columns = fieldsToColumns(fieldsToArray(LEAVE_REQUEST_FIELDS, true));

interface Employee {
  id: string;
  fullName: string;
}

export default function EmpLeaveRequestTable(initialEmployee: Employee) {
  const { status } = useSession({ required: true });
  const axiosAuth = useAxiosAuth();
  const [msg, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const [data, setData] = useState();
  const [employee, setEmployee] = useState<Employee>(initialEmployee);
  const [searchValue, setSearchValue] = useState("");

  const isMounted = useRef(false);

  const columnsAction = [
    ...columns,
    {
      title: "Actions",
      key: "actions",
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <Space>
          {record.status != LeaveRequestStatusEnum.Pending || (
            <EditLeaveRequestButton
              record={{
                ...record,
                startDate: dayjs(record.startDate),
                endDate: dayjs(record.endDate),
              }}
              employee={employee}
              onUpdated={fetchData}
            />
          )}
          {record.status === LeaveRequestStatusEnum.Approved || (
            <Tooltip title="Approve Request" className="m-2">
              <button
                onClick={() => {
                  updateStatus(record.id, LeaveRequestStatusEnum.Approved);
                }}
                aria-label="Approve Request"
                className="bg-green-600 text-white hover:bg-green-800 rounded px-3 py-1 transition shadow-sm"
              >
                <CheckOutlined className="mr-2" />
              </button>
            </Tooltip>
          )}
          {record.status === LeaveRequestStatusEnum.Rejected || (
            <Tooltip title="Reject Request" className="m-2">
              <button
                onClick={() => {
                  updateStatus(record.id, LeaveRequestStatusEnum.Rejected);
                }}
                aria-label="Reject Request"
                className="bg-red-600 text-white hover:bg-red-800 rounded px-3 py-1 transition shadow-sm"
              >
                <CloseOutlined className="mr-2" />
              </button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const fetchData = async () => {
    dispatch(startLoading());
    await axiosAuth
      .get(`${LEAVE_REQUEST_ENDPOINT}/employee/${employee.id}`)
      .then((res) => {
        if (!res) return;
        setData(res.data.data);
        dispatch(stopLoading());
      });
  };

  const updateStatus = async (id: string, status: LeaveRequestStatusEnum) => {
    dispatch(startLoading());
    await axiosAuth
      .patch(`${LEAVE_REQUEST_ENDPOINT}/${id}/status/${status}`)
      .then(() => {
        msg.success(status);
        fetchData();
      })
      .catch((error) => {
        console.log(error);
        msg.error(error?.response.data.message || "Failed");
      })
      .finally(() => {
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
  }, [status]);

  return (
    <>
      {contextHolder}
      <div>
        <div className="pb-4">
          <div className="flex items-center justify-between">
            <CreateLeaveRequestButton
              employee={employee}
              onCreated={fetchData}
            />
            <Space>
              <Input
                placeholder="Tìm theo username, email hoặc họ tên..."
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
        <div className="flex-1 overflow-x-auto overflow-y-auto">
          <Table
            rowKey={(record: any) => record.id || record._id}
            dataSource={data}
            columns={columnsAction}
            pagination={false}
          />
        </div>
      </div>
    </>
  );
}
