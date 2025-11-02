"use client"; // Nếu dùng App Router
import Title from "antd/es/typography/Title";
import React, { useRef } from "react";
import { TableProps } from "@/types/common/table";
import FaceAttendance from "../home/face-attendance";
import AttendanceList, { AttendanceListRef } from "../home/attendance-list";

export default function WebcamAttendance({
  filters: initialFilters,
}: TableProps) {
  const listRef = useRef<AttendanceListRef>(null);

  return (
    <div className="p-8 m-8">
      <Title level={2} className="text-center uppercase">
        chấm công bằng khuôn mặt
      </Title>
      <div className="flex flex-row gap-4 flex-wrap md:flex-nowrap w-full max-w-[1280px]">
        <div className="w-full md:w-1/3">
          <AttendanceList filters={initialFilters} ref={listRef} />
        </div>
        <div className="w-full md:w-2/3 ">
          <FaceAttendance onSubmit={() => listRef.current?.fetchData()} />
        </div>
      </div>
    </div>
  );
}
