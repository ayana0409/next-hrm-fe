import MultiSelectModal from "@/components/modal/muti-select-modal";
import { POSITION_ENDPOINT } from "./position.const";

interface Position {
  id: string;
  title: string;
  level: string;
}

interface SelectModalProps<T> {
  visible: boolean;
  onCancel: () => void;
  onSelect: (selected: string[]) => void;
}

const PositionMutiSelectModal: React.FC<SelectModalProps<Position>> = ({
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
    <MultiSelectModal<Position>
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
