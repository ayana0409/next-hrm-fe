import SelectModal, {
  SelectModalPropsGeneric,
} from "@/components/modal/selected-modal";
import { POSITION_ENDPOINT } from "./position.const";
import { SelectedPosition } from "@/types/position";

export const PositionSelectModal: React.FC<
  SelectModalPropsGeneric<SelectedPosition>
> = ({ visible, onCancel, onSelect }) => {
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
    <SelectModal<SelectedPosition>
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
