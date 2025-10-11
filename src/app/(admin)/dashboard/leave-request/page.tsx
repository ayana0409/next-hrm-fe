// app/(admin)/dashboard/user/page.tsx
import LeaveRequestTable from "@/components/admin/leave-request/leave-request.table";
import React from "react";
interface IProp {
  searchParams: { id: string; fullName: string };
}
const ManageLeaveRequestPage = async ({ searchParams }: IProp) => {
  const query = await searchParams;
  const filters: Record<string, any> = {};
  Object.entries(query).forEach(([key, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      filters[key] = value[0];
    } else {
      filters[key] = value;
    }
  });

  filters.current = Number(filters.current ?? 1);
  filters.pageSize = Number(filters.pageSize ?? 10);

  return (
    <div>
      <LeaveRequestTable filters={filters} />
    </div>
  );
};

export default ManageLeaveRequestPage;
