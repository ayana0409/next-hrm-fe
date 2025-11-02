import MultiSelectModal from "@/components/modal/muti-select-modal";
import { POSITION_ENDPOINT } from "./position.const";
import { SelectedPosition } from "@/types/position";
import { SelectModalProps } from "@/components/modal/selected-modal";

const PositionMutiSelectModal: React.FC<SelectModalProps> = ({
  visible,
  onCancel,
  onSelect,
}) => {
  // Table columns
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
    },
  ];

  return (
    <MultiSelectModal<SelectedPosition>
      visible={visible}
      onCancel={onCancel}
      onSelect={onSelect}
      apiRoute={POSITION_ENDPOINT}
      searchFields={["title", "level"]}
      columns={columns}
      title="Select Position"
    />
  );
};

export default PositionMutiSelectModal;
