import EmpAttendanceTable from "@/components/admin/attendance/emp-attendance.table";
import EmployeeDetail from "@/components/admin/employee/emp-detail";
import EmpLeaveRequestTable from "@/components/admin/employee/emp-leave-request.table";

interface IProp {
  searchParams: Promise<{
    id?: string | string[];
    fullName?: string | string[];
    current?: string;
    pageSize?: string;
  }>;
}

const EmpDetailPage = async ({ searchParams }: IProp) => {
  const query = await searchParams; // ✅ giờ mới đúng

  const filters: Record<string, any> = {};
  Object.entries(query).forEach(([key, value]) => {
    if (!value) return;
    filters[key] = Array.isArray(value) ? value[0] : value;
  });

  filters.current = Number(filters.current ?? 1);
  filters.pageSize = Number(filters.pageSize ?? 10);

  const id = Array.isArray(query.id) ? query.id[0] : query.id ?? "";
  const fullName = Array.isArray(query.fullName)
    ? query.fullName[0]
    : query.fullName ?? "";

  return (
    <div>
      <div className="text-3xl font-bold text-blue-950 p-4 text-center uppercase">
        {fullName}
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 m-4 p-4">
        <div className="col-span-2">
          <EmployeeDetail employeeId={id} />
        </div>
        <div>
          <EmpAttendanceTable employeeId={id} filters={filters} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <EmpLeaveRequestTable
            initialEmployee={{
              fullName,
              id,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmpDetailPage;
