"use client";
import { useEffect, useState } from "react";
import { useAxiosAuth } from "@/utils/customHook";
import { useDispatch } from "react-redux";
import { EMPLOYEE_ROUTE } from "../admin/employee/employee.const";
import { useSession } from "next-auth/react";
import EmpLeaveRequestTable from "../admin/employee/emp-leave-request.table";
import EmpAttendanceTable from "../admin/attendance/emp-attendance.table";

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

  return (
    <div className="p-4">
      <div className="text-3xl font-bold text-blue-950 p-4 text-center uppercase">
        {employee?.fullName ?? ""}
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 m-4 p-4">
        <div className="col-span-2">
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4 p-4">
              <div className="">
                <img
                  src={imageUrl || DEFAULT_AVATAR}
                  alt="avatar"
                  style={{
                    objectFit: "cover",
                    cursor: "pointer",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
              <div className="p-4 text-lg space-y-2 bg-gray-50 rounded-md col-span-2">
                <div className="font-medium">
                  Gender:{" "}
                  <span className="font-normal">{employee?.gender}</span>
                </div>
                <div className="font-medium">
                  Birth: <span className="font-normal">{employee?.dob}</span>
                </div>
                <div className="font-medium">
                  Email: <span className="font-normal">{employee?.email}</span>
                </div>
                <div className="font-medium">
                  Phone: <span className="font-normal">{employee?.phone}</span>
                </div>
                <div className="font-medium">
                  Department:{" "}
                  <span className="font-normal">
                    {employee?.department.name}
                  </span>
                </div>
                <div className="font-medium">
                  Position:{" "}
                  <span className="font-normal">
                    {employee?.position.title} - {employee?.position.level}
                  </span>
                </div>
                <div className="font-medium">
                  Address:{" "}
                  <span className="font-normal">{employee?.address}</span>
                </div>
                <div className="font-medium">
                  Status:{" "}
                  <span className="font-normal">{employee?.status}</span>
                </div>
                <div className="font-medium">
                  Start date:{" "}
                  <span className="font-normal">{employee?.startDate}</span>
                </div>
                <div className="font-medium">
                  Stop date:{" "}
                  <span className="font-normal">
                    {employee?.endDate ?? "None"}
                  </span>
                </div>
                <div className="font-medium">
                  Last update:{" "}
                  <span className="font-normal">{employee?.updatedAt}</span>
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
        <div className="col-span-2">
          {employee?.id && (
            <EmpLeaveRequestTable
              initialEmployee={{
                fullName: employee.fullName,
                id: employee.id,
              }}
              hideAction={true}
              hideChooseEmp={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
