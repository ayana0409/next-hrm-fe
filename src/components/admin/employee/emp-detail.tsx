"use client";
import { useEffect, useState } from "react";
import { EMPLOYEE_ROUTE } from "./employee.const";
import { useAxiosAuth } from "@/utils/customHook";
import { message, Tooltip, Upload } from "antd";
import { getBase64 } from "@/utils/file";
import EditEmployeeButton from "./edit-employee";
import dayjs from "dayjs";
import EmpFaceRegisterDetail from "./emp-register-face";
import { startLoading, stopLoading } from "@/store/loading-slice";
import { useDispatch } from "react-redux";

interface Employee {
  _id: string;
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
export default function EmployeeDetail({ employeeId }: { employeeId: string }) {
  const [imageUrl, setImageUrl] = useState<string>(DEFAULT_AVATAR);
  const [employee, setEmployee] = useState<Employee>();
  const dispatch = useDispatch();
  const axiosAuth = useAxiosAuth();

  const fetchData = async () => {
    await axiosAuth.get(`${EMPLOYEE_ROUTE}/${employeeId}`).then((res) => {
      setEmployee(res.data.data);
      setImageUrl(res.data.data.avatarUrl);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) message.error("Can only upload image!");
    if (!isLt2M) message.error("Image must be lower than 2MB!");
    return isImage && isLt2M;
  };

  const customUpload = async ({ file, onSuccess, onError }: any) => {
    dispatch(startLoading());
    await axiosAuth
      .post(`${EMPLOYEE_ROUTE}/${employeeId}/avatar`, {
        image: await getBase64(file),
      })
      .then((res) => {
        const newAvatarUrl = res.data.data.avatarUrl;
        setImageUrl(newAvatarUrl);
        onSuccess(res.data);
      })
      .catch((err) => {
        message.error("Upload failed!");
        console.log(err.response);
        onError(err);
      })
      .finally(() => {
        dispatch(stopLoading());
      });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-4 p-4">
        <div className="">
          <Upload
            name="avatar"
            showUploadList={false}
            beforeUpload={beforeUpload}
            customRequest={customUpload}
            accept="image/*"
          >
            <Tooltip title="Click to upload" className="m-2">
              <img
                src={imageUrl || DEFAULT_AVATAR}
                alt="avatar"
                style={{
                  objectFit: "cover",
                  cursor: "pointer",
                  border: "1px solid #ccc",
                }}
              />
            </Tooltip>
          </Upload>
        </div>
        <div className="p-4 text-lg space-y-2 bg-gray-50 rounded-md col-span-2">
          <div className="font-medium">
            Gender: <span className="font-normal">{employee?.gender}</span>
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
            <span className="font-normal">{employee?.department.name}</span>
          </div>
          <div className="font-medium">
            Position:{" "}
            <span className="font-normal">
              {employee?.position.title} - {employee?.position.level}
            </span>
          </div>
          <div className="font-medium">
            Address: <span className="font-normal">{employee?.address}</span>
          </div>
          <div className="font-medium">
            Status: <span className="font-normal">{employee?.status}</span>
          </div>
          <div className="font-medium">
            Start date:{" "}
            <span className="font-normal">{employee?.startDate}</span>
          </div>
          <div className="font-medium">
            Stop date:{" "}
            <span className="font-normal">{employee?.endDate ?? "None"}</span>
          </div>
          <div className="font-medium">
            Last update:{" "}
            <span className="font-normal">{employee?.updatedAt}</span>
          </div>
        </div>
        {employee && (
          <div className="flex gap-3">
            <EditEmployeeButton
              record={{ ...employee, dob: dayjs(employee?.dob) }}
              onUpdated={fetchData}
            />
            <EmpFaceRegisterDetail employeeId={employeeId} />
          </div>
        )}
      </div>
    </div>
  );
}
