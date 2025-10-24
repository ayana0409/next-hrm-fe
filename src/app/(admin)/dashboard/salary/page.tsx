// app/(admin)/dashboard/user/page.tsx
import React from "react";
import SalaryTable from "@/components/admin/salary/salary.table";

const ManageSalaryPage = async () => {
  return (
    <div>
      <SalaryTable />
    </div>
  );
};

export default ManageSalaryPage;
