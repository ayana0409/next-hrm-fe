"use client";
import { useEffect, useState } from "react";
import { useAxiosAuth } from "@/utils/customHook";
import { useDispatch } from "react-redux";
import { EMPLOYEE_ROUTE } from "../admin/employee/employee.const";
import { useSession } from "next-auth/react";
import EmpLeaveRequestTable from "../admin/employee/emp-leave-request.table";
import EmpAttendanceTable from "../admin/attendance/emp-attendance.table";
import {
  AuditOutlined,
  BarChartOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  ContactsOutlined,
  CreditCardOutlined,
  HomeOutlined,
  IdcardOutlined,
  MailOutlined,
  ManOutlined,
  MobileOutlined,
  PoweroffOutlined,
  ShopOutlined,
  TeamOutlined,
  WomanOutlined,
} from "@ant-design/icons";
import { Divider, Space, Tabs, TabsProps, Tag } from "antd";
import EmpSalaryTable from "../admin/salary/emp-salary.table";
import { AttendanceChart } from "../admin/attendance/attendance.chart";

interface Employee {
  id: string;
  fullName: string;
  avatarUrl?: string;
  dob: string;
  gender: string;
  email?: string;
  phone?: string;
  department: { id: string; name: string };
  position: { id: string; title: string; level: string };
  status: string;
  address?: string;
  startDate?: string;
  endDate?: string;
  updatedAt?: string;
}
const DEFAULT_AVATAR = "/images/employee/avatar-preview.png"; // ảnh tạm
export default function EmployeeInfo() {
  const { data: session, status } = useSession();
  const [imageUrl, setImageUrl] = useState<string>(DEFAULT_AVATAR);
  const [employee, setEmployee] = useState<Employee>();
  const dispatch = useDispatch();
  const axiosAuth = useAxiosAuth();

  const fetchData = async () => {
    await axiosAuth
      .get(`${EMPLOYEE_ROUTE}/${session?.employeeId}`)
      .then((res) => {
        setEmployee(res.data.data);
        setImageUrl(res.data.data.avatarUrl);
      });
  };

  useEffect(() => {
    if (status === "authenticated") fetchData();
  }, [status]);

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Leave request",
      children: employee?.id && (
        <EmpLeaveRequestTable
          initialEmployee={{
            fullName: employee.fullName,
            id: employee.id,
          }}
          hideAction={true}
          hideChooseEmp={true}
        />
      ),
      icon: <PoweroffOutlined />,
    },
    {
      key: "2",
      label: "Salary",
      children: employee?.id && <EmpSalaryTable employeeId={employee.id} />,
      icon: <CreditCardOutlined />,
    },
    {
      key: "3",
      label: "Chart",
      children: employee?.id && <AttendanceChart employeeId={employee.id} />,
      icon: <BarChartOutlined />,
    },
  ];

  return (
    <div className="md:p-4">
      <div className="text-3xl font-bold text-blue-950 p-4 text-center uppercase">
        {employee?.fullName ?? ""}
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 m-4 md:p-4">
        <div className="col-span-2">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4 p-4 bg-orange-50 rounded-2xl">
              <div className="col-span-3 lg:col-span-1">
                <img
                  src={imageUrl || DEFAULT_AVATAR}
                  alt="avatar"
                  className="object-cover cursor-pointer border border-gray-300 mx-auto"
                />
              </div>
              <div className="p-4 bg-white rounded-md shadow-md text-lg col-span-3 lg:col-span-2">
                {/* Personal Info */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">
                    <AuditOutlined /> Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-lg">
                    <div className="font-medium">
                      Gender:{" "}
                      <span className="font-normal">
                        {
                          {
                            male: (
                              <Space>
                                Male
                                <Tag color="#0314fc">
                                  <ManOutlined />
                                </Tag>
                              </Space>
                            ),
                            female: (
                              <Space>
                                Female
                                <Tag color="#ff00fb">
                                  <WomanOutlined />
                                </Tag>
                              </Space>
                            ),
                          }[employee?.gender ?? "male"]
                        }
                      </span>
                    </div>
                    <div className="font-medium">
                      Birth:{" "}
                      <span className="font-normal">
                        {employee?.dob ?? "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <Divider className="my-2" />

                {/* Contact Info */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">
                    <ContactsOutlined /> Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-lg">
                    <div className="font-medium">
                      <MailOutlined className="text-blue-500 mr-2" />
                      Email:{" "}
                      <span className="font-normal">{employee?.email}</span>
                    </div>
                    <div className="font-medium">
                      <MobileOutlined className="text-green-500 mr-2" />
                      Phone:{" "}
                      <span className="font-normal">{employee?.phone}</span>
                    </div>
                    <div className="font-medium md:col-span-2">
                      <HomeOutlined className="text-orange-500 mr-2" />
                      Address:{" "}
                      <span className="font-normal">{employee?.address}</span>
                    </div>
                  </div>
                </div>

                <Divider className="my-2" />

                {/* Work info */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-700">
                    <ShopOutlined /> Work Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-lg">
                    <div className="font-medium">
                      <TeamOutlined className="text-indigo-500 mr-2" />
                      Department:{" "}
                      <span className="font-normal">
                        {employee?.department?.name}
                      </span>
                    </div>
                    <div className="font-medium">
                      <IdcardOutlined className="text-purple-500 mr-2" />
                      Position:{" "}
                      <span className="font-normal">
                        {employee?.position?.title} -{" "}
                        {employee?.position?.level}
                      </span>
                    </div>
                    <div className="font-medium">
                      Status:{" "}
                      <span className="font-normal">
                        {
                          {
                            active: <Tag color="#42b848">Active</Tag>,
                            inactive: <Tag color="#b09a37">Inactive</Tag>,
                            terminated: <Tag color="#cd201f">Terminated</Tag>,
                          }[employee?.status ?? "inactive"]
                        }
                      </span>
                    </div>
                    <div className="font-medium">
                      <CalendarOutlined className="text-red-500 mr-2" />
                      Start Date:{" "}
                      <span className="font-normal">{employee?.startDate}</span>
                    </div>
                    <div className="font-medium">
                      Stop Date:{" "}
                      <span className="font-normal">
                        {employee?.endDate ?? "None"}
                      </span>
                    </div>
                    <div className="font-medium md:col-span-2">
                      <ClockCircleOutlined className="text-gray-500 mr-2" />
                      Last Update:{" "}
                      <span className="font-normal">{employee?.updatedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          {employee?.id && <EmpAttendanceTable employeeId={employee.id} />}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-3">
          <Tabs defaultActiveKey="1" items={tabItems} />
        </div>
      </div>
    </div>
  );
}
