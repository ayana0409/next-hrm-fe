import EmpAttendanceTable from "@/components/admin/attendance/emp-attendance.table";
import EmployeeDetail from "@/components/admin/employee/emp-detail";
import EmpLeaveRequestTable from "@/components/admin/employee/emp-leave-request.table";
import { Tabs, TabsProps } from "antd";
import { CreditCardOutlined, PoweroffOutlined } from "@ant-design/icons";
import EmpSalaryTable from "@/components/admin/salary/emp-salary.table";

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

  const tabItems: TabsProps["items"] = [
    {
      key: "1",
      label: "Leave request",
      children: (
        <EmpLeaveRequestTable
          initialEmployee={{
            fullName,
            id,
          }}
        />
      ),
      icon: <PoweroffOutlined />,
    },
    {
      key: "2",
      label: "Salary",
      children: <EmpSalaryTable employeeId={id} />,
      icon: <CreditCardOutlined />,
    },
    {
      key: "3",
      label: "Tab 3",
      children: "Content of Tab Pane 3",
    },
  ];

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
          <EmpAttendanceTable employeeId={id} />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-3">
          <Tabs defaultActiveKey="1" items={tabItems} />
        </div>
      </div>
    </div>
  );
};

export default EmpDetailPage;
