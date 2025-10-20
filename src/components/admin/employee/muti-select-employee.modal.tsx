import MultiSelectModal from "@/components/modal/muti-select-modal";
import { EMPLOYEE_ROUTE } from "./employee.const";

interface Employee {
  id: string;
  fullName: string;
}

interface SelectModalProps<T> {
  visible: boolean;
  onCancel: () => void;
  onSelect: (selected: string[]) => void;
}

const EmployeeMutiSelectModal: React.FC<SelectModalProps<Employee>> = ({
  visible,
  onCancel,
  onSelect,
}) => {
  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  return (
    <MultiSelectModal<Employee>
      visible={visible}
      onCancel={onCancel}
      onSelect={onSelect}
      apiRoute={EMPLOYEE_ROUTE}
      searchFields={["fullName", "email", "phone"]}
      columns={columns}
      title="Select Employee"
    />
  );
};

export default EmployeeMutiSelectModal;
