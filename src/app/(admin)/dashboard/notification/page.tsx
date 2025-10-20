// app/(admin)/dashboard/user/page.tsx
import React from "react";
import { IProp } from "@/components/crud/crud-types";
import NotificationTable from "@/components/admin/notification/notification.table";

const ManageNotificaionPage = async ({ searchParams }: IProp) => {
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
      <NotificationTable filters={filters} />
    </div>
  );
};

export default ManageNotificaionPage;
