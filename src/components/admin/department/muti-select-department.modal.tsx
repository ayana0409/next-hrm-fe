import MultiSelectModal from "@/components/modal/muti-select-modal";
import { DEPARTMENT_ENDPOINT } from "./department.const";
import SelectModal from "@/components/modal/selected-modal";

interface Department {
  id: string;
  name: string;
}

interface SelectModalProps<T> {
  visible: boolean;
  onCancel: () => void;
  onSelect: (selected: string[]) => void;
}

const DepartmentMutiSelectModal: React.FC<SelectModalProps<Department>> = ({
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
    <MultiSelectModal<Department>
      visible={visible}
      onCancel={onCancel}
      onSelect={onSelect}
      apiRoute={DEPARTMENT_ENDPOINT}
      searchFields={["name"]}
      columns={columns}
      title="Select Department"
    />
  );
};

export default DepartmentMutiSelectModal;
