import SelectModal, {
  SelectModalProps,
} from "@/components/modal/selected-modal";
import { DEPARTMENT_ENDPOINT } from "./department.const";

interface Department {
  id: string;
  name: string;
}

export const DepartmentSelectModal: React.FC<SelectModalProps<Department>> = ({
  visible,
  onCancel,
  onSelect,
}) => {
  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <SelectModal<Department>
      visible={visible}
      onCancel={onCancel}
      onSelect={onSelect}
      apiRoute={DEPARTMENT_ENDPOINT}
      searchFields={["name", "description"]}
      columns={columns}
      title="Select Department"
    />
  );
};
