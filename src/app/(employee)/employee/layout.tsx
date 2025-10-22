import EmployeeContent from "@/components/layout/employee/employee.content";
import EmployeeFooter from "@/components/layout/employee/employee.footer";
import EmployeeHeader from "@/components/layout/employee/employee.header";

const EmployeeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex-1 overflow-hidden">
      <EmployeeHeader />
      <EmployeeContent>{children}</EmployeeContent>
      <EmployeeFooter />
    </div>
  );
};

export default EmployeeLayout;
