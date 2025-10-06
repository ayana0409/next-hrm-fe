// app/(admin)/dashboard/user/page.tsx
import React from "react";
import PositionTable from "@/components/admin/position/position.table";
import { getAll } from "@/components/admin/position/actions";

interface IProp {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ManagePositionPage = async ({ searchParams }: IProp) => {
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

  const res = await getAll(filters);

  return (
    <div>
      <PositionTable data={res.items} meta={res.meta} />
    </div>
  );
};

export default ManagePositionPage;
