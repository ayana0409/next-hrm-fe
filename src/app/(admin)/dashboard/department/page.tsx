// app/(admin)/dashboard/user/page.tsx
import React from "react";
import DepartmentTable from "@/components/admin/department/department.table";
import { IProp } from "@/components/crud/crud-types";

const ManageDepartmentPage = async ({ searchParams }: IProp) => {
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
      <DepartmentTable filters={filters} />
    </div>
  );
};

export default ManageDepartmentPage;
