import MultiSelectModal from "@/components/modal/muti-select-modal";
import { DEPARTMENT_ENDPOINT } from "./department.const";
import { SelectedDepartment } from "@/types/department";
import { SelectModalProps } from "@/components/modal/selected-modal";

const DepartmentMutiSelectModal: React.FC<SelectModalProps> = ({
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
    <MultiSelectModal<SelectedDepartment>
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
