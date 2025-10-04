// app/(admin)/dashboard/user/page.tsx
import React from "react";
import UserTable from "@/components/admin/user/user.table";
import { getAllUser } from "@/components/admin/user/actions";

interface IProp {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ManageUserPage = async ({ searchParams }: IProp) => {
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

  const res = await getAllUser(filters);

  return (
    <div>
      <UserTable data={res.items} meta={res.meta} />
    </div>
  );
};

export default ManageUserPage;
