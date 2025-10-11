import React from "react";
import EmpLeaveRequestTable from "@/components/admin/leave-request/emp-leave-request.table";
interface IProp {
  searchParams: { id: string; fullName: string };
}
const EmpLeaveRequestPage = async ({ searchParams }: IProp) => {
  const { id, fullName } = await searchParams;
  return (
    <div>
      <EmpLeaveRequestTable fullName={fullName} id={id} />
    </div>
  );
};

export default EmpLeaveRequestPage;
