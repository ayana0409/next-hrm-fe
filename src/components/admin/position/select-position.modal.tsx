import SelectModal, {
  SelectModalProps,
} from "@/components/modal/selected-modal";
import { POSITION_ENDPOINT } from "./position.const";

interface Position {
  id: string;
  title: string;
  level: string;
}

export const PositionSelectModal: React.FC<SelectModalProps<Position>> = ({
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
    <SelectModal<Position>
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
