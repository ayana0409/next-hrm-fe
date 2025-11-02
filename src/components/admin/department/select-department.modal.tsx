import SelectModal, {
  SelectModalPropsGeneric,
} from "@/components/modal/selected-modal";
import { DEPARTMENT_ENDPOINT } from "./department.const";
import { SelectedDepartment } from "@/types/department";

export const DepartmentSelectModal: React.FC<
  SelectModalPropsGeneric<SelectedDepartment>
> = ({ visible, onCancel, onSelect }) => {
  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <SelectModal<SelectedDepartment>
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
